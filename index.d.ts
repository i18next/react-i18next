import * as React from 'react';
import i18next, {
  TranslationFunction,
  ReactOptions as I18nOptions,
} from 'i18next';
import createReactContext, {
  Context as ReactContext,
} from 'create-react-context';

export interface ReactI18NextOptions extends I18nOptions {
  usePureComponent?: boolean;
  omitBoundRerender?: boolean;
}

type i18n = i18next.i18n;

interface ReactI18nextModule {
  type: string;
  init: (instance: i18n) => void;
}

export const reactI18nextModule: ReactI18nextModule;

export function setDefaults(options: ReactI18NextOptions): void;

export function getDefaults(): ReactI18NextOptions;

export function setI18n(instance: i18n): void;

export function getI18n(): i18n;

export interface I18nContextValues {
  i18n: i18n;
  t: TranslationFunction;
  defaultNS?: string;
  reportNS?: string;
  lng?: string;
}

export const I18nContext: ReactContext<I18nContextValues>;

export interface WithI18n extends I18nContextValues {
  i18nOptions?: ReactI18NextOptions;
}

export function withI18n(): <P extends object>(
  Wrapper: React.ComponentType<P & WithI18n>,
) => React.ComponentType<P>;

export interface WithNamespaces extends WithI18n {
  tReady: boolean;
  initialI18nStore?: {};
  initialLanguage?: string;
}

export interface WithNamespacesOptions extends ReactI18NextOptions {
  wait: boolean;
  i18n?: i18n;
  innerRef?:
    | ((instance: any) => void)
    | React.RefObject<HTMLElement | SVGElement | React.Component>;
}

export function withNamespaces(
  namespace?: string,
  options?: WithNamespacesOptions,
): <P extends object>(
  component: React.ComponentType<P & WithNamespaces>,
) => React.ComponentType<P>;

export const translate: typeof withNamespaces;

export interface NamespacesConsumerProps extends ReactI18NextOptions {
  initialI18nStore?: {};
  initialLanguage?: string;
  children(
    t: TranslationFunction,
    options: {
      i18n: i18n;
      lng: string;
      ready: boolean;
    },
  ): React.ReactNode;
}

export const NamespacesConsumer: React.ComponentClass<NamespacesConsumerProps>;

export interface I18nextProviderProps {
  i18n: i18n;
  defaultNS?: string;
  initialI18nStore?: {};
  initialLanguage?: string;
}

export const I18nextProvider: React.ComponentClass<I18nextProviderProps>;

export interface TransProps {
  i18nKey?: string;
  count?: number;
  parent?: React.ReactNode;
  i18n?: i18n;
  t?: TranslationFunction;
  defaults?: string;
  values?: {};
  components?: React.ReactNode[];
}

export const Trans: React.ComponentClass<TransProps>;
