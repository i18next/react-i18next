import i18next, {
  ReactOptions,
  i18n,
  ThirdPartyModule,
  Resource,
  TFuncKey,
  Namespace,
  TypeOptions,
  TFunction,
  KeyPrefix,
} from 'i18next';
import * as React from 'react';

type Subtract<T extends K, K> = Omit<T, keyof K>;

export function setDefaults(options: ReactOptions): void;
export function getDefaults(): ReactOptions;
export function setI18n(instance: i18n): void;
export function getI18n(): i18n;
export const initReactI18next: ThirdPartyModule;
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
type ReactI18NextChild = React.ReactNode | ObjectOrNever;

declare module 'react' {
  interface HTMLAttributes<T> {
    children?: ReactI18NextChild | Iterable<ReactI18NextChild>;
  }
}

type DefaultNamespace = TypeOptions['defaultNS'];

type TransChild = React.ReactNode | Record<string, unknown>;
export type TransProps<
  K extends TFuncKey<N, TKPrefix> extends infer A ? A : never,
  N extends Namespace = DefaultNamespace,
  TKPrefix = undefined,
  E = React.HTMLProps<HTMLDivElement>
> = E & {
  children?: TransChild | TransChild[];
  components?: readonly React.ReactElement[] | { readonly [tagName: string]: React.ReactElement };
  count?: number;
  context?: string;
  defaults?: string;
  i18n?: i18n;
  i18nKey?: K | K[];
  ns?: N;
  parent?: string | React.ComponentType<any> | null; // used in React.createElement if not null
  tOptions?: {};
  values?: {};
  shouldUnescape?: boolean;
  t?: TFunction<N, TKPrefix>;
};

export function Trans<
  K extends TFuncKey<N, TKPrefix> extends infer A ? A : never,
  N extends Namespace = DefaultNamespace,
  TKPrefix extends KeyPrefix<N> = undefined,
  E = React.HTMLProps<HTMLDivElement>
>(props: TransProps<K, N, TKPrefix, E>): React.ReactElement;

export function useSSR(initialI18nStore: Resource, initialLanguage: string): void;

export interface UseTranslationOptions<TKPrefix = undefined> {
  i18n?: i18n;
  useSuspense?: boolean;
  keyPrefix?: TKPrefix;
  bindI18n?: string | false;
  nsMode?: 'fallback' | 'default';
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
  defaultNS?: string;
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
