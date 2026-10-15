import { describe, it, expect, vi, afterEach } from 'vitest';
import React, { useState } from 'react';
import { act, render, screen, cleanup } from '@testing-library/react';
import { createInstance } from 'i18next';
import { useTranslation } from '../src/useTranslation';
import { I18nextProvider } from '../src/I18nextProvider';

// `subscribe` used to depend on the options object, which is rebuilt whenever `props` is
// a new object (the `{}` default, inline options), so every re-render made React
// unsubscribe and resubscribe the i18n listeners.
describe('useTranslation subscription', () => {
  afterEach(() => {
    cleanup();
  });

  async function setup(Component) {
    const i18n = createInstance();
    await i18n.init({
      lng: 'en',
      resources: {
        en: { translation: { deep: { key: 'english' } } },
        de: { translation: { deep: { key: 'deutsch' } } },
      },
    });
    let bump;
    function Parent() {
      const [, setCount] = useState(0);
      bump = () => setCount((c) => c + 1);
      return <Component />;
    }
    render(
      <I18nextProvider i18n={i18n}>
        <Parent />
      </I18nextProvider>,
    );
    return { i18n, rerender: () => act(() => bump()) };
  }

  it.each([
    [
      'no options',
      () => {
        const { t } = useTranslation();
        return <h1>{t('deep.key')}</h1>;
      },
    ],
    [
      'inline options',
      () => {
        const { t } = useTranslation('translation', { keyPrefix: 'deep' });
        return <h1>{t('key')}</h1>;
      },
    ],
  ])('keeps its i18n listeners across re-renders with %s', async (_, Component) => {
    const { i18n, rerender } = await setup(Component);
    const on = vi.spyOn(i18n, 'on');
    const off = vi.spyOn(i18n, 'off');

    await rerender();

    expect(on).not.toHaveBeenCalled();
    expect(off).not.toHaveBeenCalled();

    // still subscribed
    await act(() => i18n.changeLanguage('de'));
    expect(screen.getByRole('heading')).toHaveTextContent('deutsch');
  });
});
