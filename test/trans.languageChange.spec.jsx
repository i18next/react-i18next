import { describe, it, expect, afterEach } from 'vitest';
import React, { memo, useLayoutEffect, Profiler } from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { createInstance } from 'i18next';
import { Trans } from '../src/Trans';
import { IcuTrans } from '../src/IcuTrans';
import { I18nextProvider } from '../src/I18nextProvider';

const resources = {
  en: { translation: { hello: 'Hello <0>world</0>', icu: 'Hi <0>there</0>' } },
  de: { translation: { hello: 'Hallo <0>Welt</0>', icu: 'Hallo <0>du</0>' } },
};

const createInst = async (react) => {
  const inst = createInstance();
  await inst.init({ lng: 'en', fallbackLng: false, resources, react });
  return inst;
};

// never re-renders on its own: only the subscription can update what is inside
const Frozen = memo(({ children }) => children);

// counts the commits of the subtree, including those Trans triggers through its own subscription
const renderCountingCommits = (element) => {
  const commits = { count: 0 };
  render(
    <Frozen>
      <Profiler id="trans" onRender={() => (commits.count += 1)}>
        {element}
      </Profiler>
    </Frozen>,
  );
  return commits;
};

describe('Trans and IcuTrans follow language changes on their own', () => {
  afterEach(() => {
    cleanup();
  });

  it('should re-render Trans on languageChanged', async () => {
    const inst = await createInst();
    const { container } = render(
      <Frozen>
        <Trans i18n={inst} i18nKey="hello" components={[<b />]} />
      </Frozen>,
    );
    expect(container).toHaveTextContent('Hello world');
    await act(() => inst.changeLanguage('de'));
    expect(container).toHaveTextContent('Hallo Welt');
  });

  it('should re-render Trans with the instance from the context', async () => {
    const inst = await createInst();
    const { container } = render(
      <I18nextProvider i18n={inst}>
        <Frozen>
          <Trans i18nKey="hello" components={[<b />]} />
        </Frozen>
      </I18nextProvider>,
    );
    await act(() => inst.changeLanguage('de'));
    expect(container).toHaveTextContent('Hallo Welt');
  });

  it('should catch a change between render and subscription (a parent layout effect)', async () => {
    const inst = await createInst();
    function Parent() {
      // runs after Trans rendered, before its subscription (a passive effect) exists
      useLayoutEffect(() => {
        inst.changeLanguage('de');
      }, []);
      return (
        <>
          <Trans i18n={inst} i18nKey="hello" components={[<b />]} />
          <IcuTrans
            i18n={inst}
            i18nKey="icu"
            defaultTranslation="Hi <0>there</0>"
            content={[{ type: 'b' }]}
          />
        </>
      );
    }
    const { container } = render(<Parent />);
    await act(async () => {});
    expect(inst.language).toBe('de');
    expect(container).toHaveTextContent('Hallo WeltHallo du');
  });

  it("should not catch it with bindI18n: '' either", async () => {
    const inst = await createInst({ bindI18n: '' });
    function Parent() {
      useLayoutEffect(() => {
        inst.changeLanguage('de');
      }, []);
      return <Trans i18n={inst} i18nKey="hello" components={[<b />]} />;
    }
    const { container } = render(<Parent />);
    await act(async () => {});
    expect(container).toHaveTextContent('Hello world');
  });

  it('should re-render IcuTrans on languageChanged', async () => {
    const inst = await createInst();
    const { container } = render(
      <Frozen>
        <IcuTrans
          i18n={inst}
          i18nKey="icu"
          defaultTranslation="Hi <0>there</0>"
          content={[{ type: 'b' }]}
        />
      </Frozen>,
    );
    expect(container).toHaveTextContent('Hi there');
    await act(() => inst.changeLanguage('de'));
    expect(container).toHaveTextContent('Hallo du');
  });

  it('should not re-render without an event', async () => {
    const inst = await createInst();
    const commits = renderCountingCommits(
      <Trans i18n={inst} i18nKey="hello" components={[<b />]} />,
    );
    const before = commits.count;
    await act(async () => {
      inst.emit('loaded', {});
      inst.store.emit('added', 'en', 'translation');
    });
    expect(commits.count).toBe(before);
  });

  it('should re-render on the events bindI18n and bindI18nStore name', async () => {
    const inst = await createInst({ bindI18n: 'loaded', bindI18nStore: 'added' });
    const commits = renderCountingCommits(
      <Trans i18n={inst} i18nKey="hello" components={[<b />]} />,
    );
    let before = commits.count;
    await act(async () => inst.emit('loaded', {}));
    expect(commits.count).toBe(before + 1);
    before = commits.count;
    await act(async () => inst.store.emit('added', 'en', 'translation'));
    expect(commits.count).toBe(before + 1);
  });

  it('should let a t prop decide the language', async () => {
    const inst = await createInst();
    const tEn = inst.getFixedT('en');
    const { container } = render(
      <Frozen>
        <Trans i18n={inst} t={tEn} i18nKey="hello" components={[<b />]} />
      </Frozen>,
    );
    await act(() => inst.changeLanguage('de'));
    expect(container).toHaveTextContent('Hello world');
  });

  it("should not subscribe with bindI18n: ''", async () => {
    const inst = await createInst({ bindI18n: '' });
    const { container } = render(
      <Frozen>
        <Trans i18n={inst} i18nKey="hello" components={[<b />]} />
      </Frozen>,
    );
    await act(() => inst.changeLanguage('de'));
    expect(container).toHaveTextContent('Hello world');
  });

  it('should unsubscribe on unmount', async () => {
    const inst = await createInst();
    const { unmount } = render(<Trans i18n={inst} i18nKey="hello" components={[<b />]} />);
    expect(inst.observers.languageChanged?.size).toBe(1);
    unmount();
    expect(inst.observers.languageChanged?.size ?? 0).toBe(0);
  });
});
