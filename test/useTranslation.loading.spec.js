import { renderHook } from '@testing-library/react-hooks';
import i18n from './i18n';
import BackendMock from './backendMock';
import { useTranslation } from '../src/useTranslation';

jest.unmock('../src/useTranslation');

describe('useTranslation loading ns', () => {
  let newI18n;
  let backend;

  beforeEach(() => {
    newI18n = i18n.createInstance();
    backend = new BackendMock();
    newI18n.use(backend).init({
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react!!
      },
    });
  });

  it('should wait for correct translation with suspense', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useTranslation('common', { i18n: newI18n, useSuspense: true }),
    );
    expect(result.all).toHaveLength(0);
    backend.flush();
    await waitForNextUpdate();
    const { t } = result.current;
    expect(t('key1')).toBe('test');
  });

  it('should wait for correct translation without suspense', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useTranslation('common', { i18n: newI18n, useSuspense: false }),
    );
    const { t } = result.current;
    expect(t('key1')).toBe('key1');

    backend.flush();
    await waitForNextUpdate();
    expect(t('key1')).toBe('test');
  });
});
