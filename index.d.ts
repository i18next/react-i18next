import i18next, {
  ReactOptions,
  i18n,
  Resource,
  Namespace,
  TypeOptions,
  TFunction,
  KeyPrefix,
} from 'i18next';
import * as React from 'react';
export { Trans, TransProps } from './TransWithoutContext';
export { initReactI18next } from './initReactI18next';

type Subtract<T extends K, K> = Omit<T, keyof K>;

export function setDefaults(options: ReactOptions): void;
export function getDefaults(): ReactOptions;
export function setI18n(instance: i18n): void;
export function getI18n(): i18n;
export function composeInitialProps(ForComponent: any): (ctx: unknown) => Promise<any>;
export function getInitialProps(): {
  initialI18nStore: {
    [ns: string]: {};
  };
  initialLanguage: string;
};

export interface ReportNamespaces {
  addUsedNamespaces(namespaces: Namespace): void;
  getUsedNamespaces(): string[];
}

declare module 'i18next' {
  interface i18n {
    reportNamespaces: ReportNamespaces;
  }
}

type ObjectOrNever = TypeOptions['allowObjectInHTMLChildren'] extends true
  ? Record<string, unknown>
  : never;

type ReactI18NextChildren = React.ReactNode | ObjectOrNever;

declare module 'react' {
  interface HTMLAttributes<T> {
    children?: ReactI18NextChildren;
  }
}

type DefaultNamespace = TypeOptions['defaultNS'];

export function useSSR(initialI18nStore: Resource, initialLanguage: string): void;

export interface UseTranslationOptions<TKPrefix = undefined> {
  i18n?: i18n;
  useSuspense?: boolean;
  keyPrefix?: TKPrefix;
  bindI18n?: string | false;
  nsMode?: 'fallback' | 'default';
  lng?: string;
  // other of these options might also work: https://github.com/i18next/i18next/blob/master/index.d.ts#L127
}

export type UseTranslationResponse<N extends Namespace, TKPrefix = undefined> = [
  TFunction<N, TKPrefix>,
  i18n,
  boolean,
] & {
  t: TFunction<N, TKPrefix>;
  i18n: i18n;
  ready: boolean;
};

export function useTranslation<
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined
>(
  ns?: N | Readonly<N>,
  options?: UseTranslationOptions<TKPrefix>,
): UseTranslationResponse<N, TKPrefix>;

// Need to see usage to improve this
export function withSSR(): <Props>(
  WrappedComponent: React.ComponentType<Props>,
) => {
  ({
    initialI18nStore,
    initialLanguage,
    ...rest
  }: {
    initialI18nStore: Resource;
    initialLanguage: string;
  } & Props): React.FunctionComponentElement<Props>;
  getInitialProps: (ctx: unknown) => Promise<any>;
};

export interface WithTranslation<
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined
> {
  t: TFunction<N, TKPrefix>;
  i18n: i18n;
  tReady: boolean;
}

export interface WithTranslationProps {
  i18n?: i18n;
  useSuspense?: boolean;
}

export function withTranslation<
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined
>(
  ns?: N,
  options?: {
    withRef?: boolean;
    keyPrefix?: TKPrefix;
  },
): <
  C extends React.ComponentType<React.ComponentProps<any> & WithTranslationProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<
    C,
    Subtract<React.ComponentProps<C>, WithTranslationProps>
  >
>(
  component: C,
) => React.ComponentType<Omit<ResolvedProps, keyof WithTranslation<N>> & WithTranslationProps>;

export interface I18nextProviderProps {
  children?: React.ReactNode;
  i18n: i18n;
  defaultNS?: string | string[];
}

export const I18nextProvider: React.FunctionComponent<I18nextProviderProps>;
export const I18nContext: React.Context<{ i18n: i18n }>;

export interface TranslationProps<
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined
> {
  children: (
    t: TFunction<N, TKPrefix>,
    options: {
      i18n: i18n;
      lng: string;
    },
    ready: boolean,
  ) => React.ReactNode;
  ns?: N;
  i18n?: i18n;
  useSuspense?: boolean;
  keyPrefix?: TKPrefix;
  nsMode?: 'fallback' | 'default';
}

export function Translation<
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined
>(props: TranslationProps<N, TKPrefix>): any;
