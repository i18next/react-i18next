import { renderHook } from '@testing-library/react-hooks';
import i18n from './i18n';
import BackendMock from './lngAwareBackendMock';
import { useTranslation } from '../src/useTranslation';

jest.unmock('../src/useTranslation');

describe('useTranslation loading ns with lng via props', () => {
  let newI18n;
  let backend;

  beforeEach(() => {
    newI18n = i18n.createInstance();
    backend = new BackendMock();
    newI18n.use(backend).init({
      lng: 'en',
      fallbackLng: 'en',
    });
  });

  it('should wait for correct translation with suspense', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useTranslation('common', { i18n: newI18n, useSuspense: true, lng: 'de' }),
    );
    expect(result.all).toHaveLength(0);
    backend.flush();
    await waitForNextUpdate();
    const { t } = result.current;
    expect(t('key1')).toBe('de/common for key1');
  });

  it('should wait for correct translation without suspense', async () => {
    const { result } = renderHook(() =>
      useTranslation('common', { i18n: newI18n, useSuspense: false, lng: 'it' }),
    );
    const { t } = result.current;
    expect(t('key1')).toBe('key1');

    backend.flush();
    expect(t('key1')).toBe('it/common for key1');
  });

  it('should return defaultValue if resources not yet loaded', async () => {
    const { result } = renderHook(() =>
      useTranslation('common', { i18n: newI18n, useSuspense: false, lng: 'fr' }),
    );
    const { t } = result.current;
    expect(t('key1', 'my default value')).toBe('my default value');
    expect(t('key1', { defaultValue: 'my default value' })).toBe('my default value');

    backend.flush({ language: 'en' });
    expect(t('key1', 'my default value')).toBe('en/common for key1');
    expect(t('key1', { defaultValue: 'my default value' })).toBe('en/common for key1');

    backend.flush({ language: 'fr' });
    expect(t('key1', 'my default value')).toBe('fr/common for key1');
    expect(t('key1', { defaultValue: 'my default value' })).toBe('fr/common for key1');
  });

  it('should correctly return and render correct tranlations in multiple useTranslation usages', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useTranslation('newns', { i18n: newI18n, useSuspense: true, lng: 'pt' }),
    );
    backend.flush();
    await waitForNextUpdate();
    const { t } = result.current;
    expect(t('key1')).toBe('pt/newns for key1');

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const retDe = renderHook(() =>
      useTranslation('newns', { i18n: newI18n, useSuspense: true, lng: 'de' }),
    );
    backend.flush({ language: 'de' });
    await retDe.waitForNextUpdate();
    const { t: tDE } = retDe.result.current;
    expect(tDE('key1')).toBe('de/newns for key1');

    // eslint-disable-next-line testing-library/render-result-naming-convention
    const retPT = renderHook(() =>
      useTranslation('newns', { i18n: newI18n, useSuspense: true, lng: 'pt' }),
    );
    // backend.flush({ language: 'pt' }); // already loaded
    // await retPT.waitForNextUpdate(); // already loaded
    const { t: tPT } = retPT.result.current;
    expect(tPT('key1')).toBe('pt/newns for key1');
  });
});
