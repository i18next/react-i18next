import { describe, it, expect } from 'vitest';
import React, { useLayoutEffect } from 'react';
import { act, render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { useTranslation } from '../src/useTranslation';
import { I18nextProvider } from '../src/I18nextProvider';
import { Trans } from '../src/Trans';

describe('useTranslation with bindI18nStore', () => {
  it('should correctly return the correct translation', async () => {
    const i18next = createInstance();
    await i18next.init({
      fallbackLng: ['en'],
      react: { bindI18nStore: 'added' },
    });
    function TranslateAKey() {
      const { t } = useTranslation();
      return <h1>{t('key', { ns: 'namespace' })}</h1>;
    }
    i18next.addResourceBundle('en', 'namespace', { key: 'english' }, false, true);
    render(
      <I18nextProvider i18n={i18next}>
        <TranslateAKey />
      </I18nextProvider>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('english');
    await act(() => i18next.changeLanguage('de'));
    expect(screen.getByRole('heading')).toHaveTextContent('english');
    await act(() => i18next.addResourceBundle('de', 'namespace', { key: 'deutsch' }, false, true));
    expect(screen.getByRole('heading')).toHaveTextContent('deutsch'); // this assertion fails
  });
});

describe('a bindI18nStore event between render and subscribe', () => {
  // de has no bundle yet, so everything renders the en fallback until one is added
  const createInst = async (react) => {
    const inst = createInstance();
    await inst.init({
      lng: 'de',
      fallbackLng: 'en',
      resources: { en: { translation: { title: 'Title', rich: 'Rich <0>text</0>' } } },
      react,
    });
    return inst;
  };

  // runs after the children rendered, before their subscriptions (passive effects) exist
  const AddDeInLayoutEffect = ({ inst, children }) => {
    useLayoutEffect(() => {
      inst.addResourceBundle('de', 'translation', { title: 'Titel', rich: 'Reich <0>Text</0>' });
    }, []);
    return children;
  };

  const Label = ({ inst }) => {
    const { t } = useTranslation('translation', { i18n: inst });
    return <span>{t('title')}</span>;
  };

  it('should re-render useTranslation', async () => {
    const inst = await createInst({ bindI18nStore: 'added' });
    const { container } = render(
      <AddDeInLayoutEffect inst={inst}>
        <Label inst={inst} />
      </AddDeInLayoutEffect>,
    );
    await act(async () => {});
    expect(container).toHaveTextContent('Titel');
  });

  it('should re-render Trans', async () => {
    const inst = await createInst({ bindI18nStore: 'added' });
    const { container } = render(
      <AddDeInLayoutEffect inst={inst}>
        <Trans i18n={inst} i18nKey="rich" components={[<b />]} />
      </AddDeInLayoutEffect>,
    );
    await act(async () => {});
    expect(container).toHaveTextContent('Reich Text');
  });

  it("should not re-render with the default bindI18nStore: ''", async () => {
    const inst = await createInst();
    const { container } = render(
      <AddDeInLayoutEffect inst={inst}>
        <Label inst={inst} />
      </AddDeInLayoutEffect>,
    );
    await act(async () => {});
    expect(container).toHaveTextContent('Title');
  });
});
