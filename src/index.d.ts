import * as i18next from 'i18next';
import * as React from 'react';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type Namespace = string | string[];

export function setDefaults(options: i18next.ReactOptions): void;
export function getDefaults(): i18next.ReactOptions;
export function setI18n(instance: i18next.i18n): void;
export function getI18n(): i18next.i18n;
export const initReactI18next: i18next.ThirdPartyModule;
export function composeInitialProps(ForComponent: any): (ctx: unknown) => Promise<any>;
export function getInitialProps(): {
  initialI18nStore: {
    [ns: string]: {};
  };
  initialLanguage: string;
};

export interface ReportNamespaces {
  addUsedNamespaces(namespaces: Namespace[]): void;
  getUsedNamespaces(): string[];
}

declare module 'i18next' {
  interface i18n {
    reportNamespaces: ReportNamespaces;
  }
}

export interface TransProps extends Partial<i18next.WithT> {
  children?: React.ReactNode;
  components?: React.ReactNode[];
  count?: number;
  defaults?: string;
  i18n?: i18next.i18n;
  i18nKey?: string;
  ns?: Namespace;
  parent?: React.ReactNode;
  tOptions?: {};
  values?: {};
  t?: i18next.TFunction;
}
export function Trans(props: TransProps): any;

export function useSSR(initialI18nStore: any, initialLanguage: any): void;

export interface UseTranslationOptions {
  i18n?: i18next.i18n;
  useSuspense?: boolean;
}
export type UseTranslationResponse = [i18next.TFunction, i18next.i18n, boolean] & {
  t: i18next.TFunction;
  i18n: i18next.i18n;
  ready: boolean;
};
export function useTranslation(
  ns?: Namespace,
  options?: UseTranslationOptions,
): UseTranslationResponse;

// Need to see usage to improve this
export function withSSR(): <Props>(
  WrappedComponent: React.ComponentType<Props>,
) => {
  ({
    initialI18nStore,
    initialLanguage,
    ...rest
  }: {
    initialI18nStore: i18next.Resource;
    initialLanguage: string;
  } & Props): React.FunctionComponentElement<Props>;
  getInitialProps: (ctx: unknown) => Promise<any>;
};

export interface WithTranslation extends i18next.WithT {
  i18n: i18next.i18n;
  tReady: boolean;
}
export function withTranslation(
  ns?: Namespace,
  options?: {
    withRef?: boolean;
  },
): <P extends WithTranslation>(
  component: React.ComponentType<P>,
) => React.ComponentType<Omit<P, keyof WithTranslation>>;

export interface I18nextProviderProps {
  i18n: i18next.i18n;
}

export const I18nextProvider: React.FunctionComponent<I18nextProviderProps>;
export const I18nContext: React.Context<i18next.i18n>;

export interface TranslationProps {
  children: (
    t: i18next.TFunction,
    options: {
      i18n: i18next.i18n;
      lng: string;
    },
  ) => React.ReactNode;
  ns?: Namespace;
  i18n?: i18next.i18n;
}

export function Translation(props: TranslationProps): any;
