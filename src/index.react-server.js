// The entry for React Server Components (the `react-server` export condition): only what works
// without context and hooks. Hooks, HOCs, Translation, I18nextProvider and useSSR are client-only,
// so importing them in a Server Component fails at build time instead of crashing at runtime.
import { Trans as TransWithoutContext } from './TransWithoutContext.js';
import { IcuTransWithoutContext } from './IcuTransWithoutContext.js';
import { getI18n } from './i18nInstance.js';
import { inDevelopment, warnOnce } from './utils.js';

export { nodesToString } from './TransWithoutContext.js';
export { initReactI18next } from './initReactI18next.js';
export { setDefaults, getDefaults } from './defaults.js';
export { setI18n, getI18n } from './i18nInstance.js';
export { TransWithoutContext, IcuTransWithoutContext };

// the global instance is shared by all requests: fine with a single instance, wrong with an
// instance per request, which has to be passed as `i18n`. A `t` alone is not enough: a fixed t
// carries no instance, so options, formatting and the language for the values still come from the
// global one
const warnOnGlobalInstance = (name, props) => {
  if (props.i18n || !inDevelopment()) return;
  warnOnce(
    getI18n(),
    'GLOBAL_INSTANCE_ON_SERVER',
    `${name} in a Server Component: no i18n prop, so it uses the global i18next instance (initReactI18next). With an i18next instance per request, pass that instance as i18n (t is optional).`,
    { i18nKey: props.i18nKey },
  );
};

export function Trans(props) {
  warnOnGlobalInstance('Trans', props);
  return TransWithoutContext(props);
}

export function IcuTrans(props) {
  warnOnGlobalInstance('IcuTrans', props);
  return IcuTransWithoutContext(props);
}
