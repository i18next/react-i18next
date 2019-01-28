import * as React from 'react';
import i18next from 'i18next';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type Subtract<T, K> = Omit<T, keyof K>;

export interface ReactI18NextOptions extends i18next.ReactOptions {
  usePureComponent?: boolean;
  omitBoundRerender?: boolean;
}

interface ReactI18nextModule {
  type: string;
  init: (instance: i18next.i18n) => void;
}

export const reactI18nextModule: ReactI18nextModule;

export function setDefaults(options: ReactI18NextOptions): void;

export function getDefaults(): ReactI18NextOptions;

export function setI18n(instance: i18next.i18n): void;

export function getI18n(): i18next.i18n;

export interface I18nContextValues extends i18next.WithT {
  i18n: i18next.i18n;
  defaultNS?: string;
  reportNS?: string;
  lng?: string;
}

export const I18nContext: React.Context<I18nContextValues>;

export interface WithI18n extends I18nContextValues {
  i18nOptions?: ReactI18NextOptions;
}

export function withI18n(): <P extends object>(
  Wrapper: React.ComponentType<P>,
) => React.ComponentType<Subtract<P, WithI18n>>;

export interface WithNamespaces extends WithI18n {
  tReady: boolean;
  initialI18nStore?: {};
  initialLanguage?: string;
}

export interface WithNamespacesOptions extends ReactI18NextOptions {
  wait?: boolean;
  i18n?: i18next.i18n;
  innerRef?:
    | ((instance: any) => void)
    | React.RefObject<HTMLElement | SVGElement | React.Component>;
}

type Namespace = string | string[];
interface NamespaceExtractor {
  (props: any & { namespace: Namespace }): Namespace;
}

export function withNamespaces(
  namespace?: Namespace | NamespaceExtractor,
  options?: WithNamespacesOptions,
): <P extends WithNamespaces>(
  component: React.ComponentType<P>,
) => React.ComponentType<Subtract<P, WithNamespaces>>;

export const translate: typeof withNamespaces;

export interface NamespacesConsumerProps extends ReactI18NextOptions {
  ns?: Namespace;
  i18n?: i18next.i18n;
  initialI18nStore?: {};
  initialLanguage?: string;
  children: (
    t: i18next.TFunction,
    options: {
      i18n: i18next.i18n;
      lng: string;
      ready: boolean;
    },
  ) => React.ReactNode;
}

export const NamespacesConsumer: React.ComponentClass<NamespacesConsumerProps>;

export interface I18nextProviderProps {
  i18n: i18next.i18n;
  defaultNS?: string;
  reportNS?: (ns: string) => void;
  initialI18nStore?: {};
  initialLanguage?: string;
}

export const I18nextProvider: React.ComponentClass<I18nextProviderProps>;

export interface TransProps extends Partial<i18next.WithT> {
  i18nKey?: string;
  count?: number;
  parent?: React.ReactNode;
  i18n?: i18next.i18n;
  defaults?: string;
  values?: {};
  components?: React.ReactNode[];
}

export const Trans: React.ComponentClass<TransProps>;
