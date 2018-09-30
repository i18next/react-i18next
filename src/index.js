export { loadNamespaces } from './utils';

export { withNamespaces, translate } from './withNamespaces';
export { NamespacesConsumer, I18n } from './NamespacesConsumer';

export { Trans } from './Trans';
export { I18nextProvider } from './I18nextProvider';

export {
  withI18n,
  I18nContext,
  reactI18nextModule,
  setDefaults,
  getDefaults,
  setI18n,
  getI18n,
} from './context';

// will be deprecated in v9.0.0
export { Interpolate } from './Interpolate';
