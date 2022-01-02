import i18next, {
  ReactOptions,
  i18n,
  ThirdPartyModule,
  Resource,
  TOptions,
  StringMap,
  TFunctionResult,
} from 'i18next';
import * as React from 'react';

type Subtract<T extends K, K> = Omit<T, keyof K>;

/**
 * Due to a limitation/bug on typescript 4.1 (https://github.com/microsoft/TypeScript/issues/41406), we added
 * "extends infer A ? A : never" in a few places to suppress the error "Type instantiation is excessively deep and possibly infinite."
 * on cases where users have more than 22 namespaces. Once the issue is fixed, we can remove all instances of the workaround used.
 *
 * Reference of the bug reported: https://github.com/i18next/react-i18next/issues/1222
 */

/**
 * This interface can be augmented by users to add types to `react-i18next` default resources.
 *
 * @deprecated use the `resources` key of `CustomTypeOptions` instead
 */
export interface Resources {}
/**
 * This interface can be augmented by users to add types to `react-i18next`. It accepts a `defaultNS`, `resources`, `returnNull` and `returnEmptyString` properties.
 *
 * Usage:
 * ```ts
 * // react-i18next.d.ts
 * import 'react-i18next';
 * declare module 'react-i18next' {
 *   interface CustomTypeOptions {
 *     defaultNS: 'custom';
 *     returnNull: false;
 *     returnEmptyString: false;
 *     keySeparator: '.';
 *     jsonFormat: 'v4';
 *     resources: {
 *       custom: {
 *         foo: 'foo';
 *       };
 *     };
 *   }
 * }
 * ```
 */
export interface CustomTypeOptions {}

type MergeBy<T, K> = Omit<T, keyof K> & K;

type TypeOptions = MergeBy<
  {
    returnNull: true;
    returnEmptyString: true;
    keySeparator: '.';
    defaultNS: 'translation';
    jsonFormat: 'v4';
    resources: Resources;
  },
  CustomTypeOptions
>;

type DefaultResources = TypeOptions['resources'];
type DefaultNamespace<T = TypeOptions['defaultNS']> = T extends Fallback<string> ? T : string;

type Fallback<F, T = keyof DefaultResources> = [T] extends [never] ? F : T;

export type Namespace<F = Fallback<string>> = F | F[];

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
  addUsedNamespaces(namespaces: Namespace[]): void;
  getUsedNamespaces(): string[];
}

declare module 'i18next' {
  interface i18n {
    reportNamespaces: ReportNamespaces;
  }
}

type WithOrWithoutPlural<K> = TypeOptions['jsonFormat'] extends 'v4'
  ? K extends `${infer B}_${'zero' | 'one' | 'two' | 'few' | 'many' | 'other'}`
    ? B | K
    : K
  : K;

// Normalize single namespace
export type KeysWithSeparator<K1, K2, S extends string = TypeOptions['keySeparator']> = `${K1 &
  string}${S}${K2 & string}`;
type KeysWithSeparator2<K1, K2> = KeysWithSeparator<K1, Exclude<K2, keyof any[]>>;
type Normalize2<T, K = keyof T> = K extends keyof T
  ? T[K] extends Record<string, any>
    ? T[K] extends readonly any[]
      ?
          | KeysWithSeparator2<K, WithOrWithoutPlural<keyof T[K]>>
          | KeysWithSeparator2<K, Normalize2<T[K]>>
      :
          | KeysWithSeparator<K, WithOrWithoutPlural<keyof T[K]>>
          | KeysWithSeparator<K, Normalize2<T[K]>>
    : never
  : never;
type Normalize<T> = WithOrWithoutPlural<keyof T> | Normalize2<T>;

// Normalize multiple namespaces
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R
  ? R
  : never;
type AppendNS<N, K> = `${N & string}:${K & string}`;
type NormalizeMulti<T, U extends keyof T, L = LastOf<U>> = L extends U
  ? AppendNS<L, Normalize<T[L]>> | NormalizeMulti<T, Exclude<U, L>>
  : never;

interface CustomTypeParameters {
  returnNull?: boolean;
  returnEmptyString?: boolean;
}

type TypeOptionsFallback<TranslationValue, Option, MatchingValue> = Option extends false
  ? TranslationValue extends MatchingValue
    ? string
    : TranslationValue
  : TranslationValue;

/**
 * Checks if user has enabled `returnEmptyString` and `returnNull` options to retrieve correct values.
 */
export type NormalizeByTypeOptions<
  TranslationValue,
  Options extends CustomTypeParameters = TypeOptions,
  R = TypeOptionsFallback<TranslationValue, Options['returnEmptyString'], ''>
> = TypeOptionsFallback<R, Options['returnNull'], null>;

type NormalizeReturn<
  T,
  V,
  S extends string | false = TypeOptions['keySeparator']
> = V extends keyof T
  ? NormalizeByTypeOptions<T[V]>
  : S extends false
  ? V
  : V extends `${infer K}${S}${infer R}`
  ? K extends keyof T
    ? NormalizeReturn<T[K], R>
    : never
  : never;

type NormalizeMultiReturn<T, V> = V extends `${infer N}:${infer R}`
  ? N extends keyof T
    ? NormalizeReturn<T[N], R>
    : never
  : never;

type NormalizeWithKeyPrefix<
  T,
  K,
  S extends string = TypeOptions['keySeparator']
> = K extends `${infer K1}${S}${infer K2}`
  ? K1 extends keyof T
    ? NormalizeWithKeyPrefix<T[K1], K2>
    : never
  : K extends keyof T
  ? T[K] extends string
    ? never
    : Normalize<T[K]>
  : never;

type KeyPrefix<N extends Namespace> =
  | (N extends keyof DefaultResources ? Normalize<DefaultResources[N]> : string)
  | undefined;

export type TFuncKey<
  N extends Namespace = DefaultNamespace,
  TKPrefix = undefined,
  T = DefaultResources
> = N extends (keyof T)[] | Readonly<(keyof T)[]>
  ? NormalizeMulti<T, N[number]>
  : N extends keyof T
  ? TKPrefix extends undefined
    ? Normalize<T[N]>
    : NormalizeWithKeyPrefix<T[N], TKPrefix>
  : string;

export type TFuncReturn<
  N,
  TKeys,
  TDefaultResult,
  TKPrefix = undefined,
  T = DefaultResources
> = N extends (keyof T)[]
  ? NormalizeMultiReturn<T, TKeys>
  : N extends keyof T
  ? TKPrefix extends undefined
    ? NormalizeReturn<T[N], TKeys>
    : NormalizeReturn<T[N], KeysWithSeparator<TKPrefix, TKeys>>
  : Fallback<TDefaultResult>;

export interface TFunction<N extends Namespace = DefaultNamespace, TKPrefix = undefined> {
  <
    TKeys extends TFuncKey<N, TKPrefix> | TemplateStringsArray extends infer A ? A : never,
    TDefaultResult extends TFunctionResult = string,
    TInterpolationMap extends object = StringMap
  >(
    key: TKeys | TKeys[],
    options?: TOptions<TInterpolationMap> | string,
  ): TFuncReturn<N, TKeys, TDefaultResult, TKPrefix>;
  <
    TKeys extends TFuncKey<N, TKPrefix> | TemplateStringsArray extends infer A ? A : never,
    TDefaultResult extends TFunctionResult = string,
    TInterpolationMap extends object = StringMap
  >(
    key: TKeys | TKeys[],
    defaultValue?: string,
    options?: TOptions<TInterpolationMap> | string,
  ): TFuncReturn<N, TKeys, TDefaultResult, TKPrefix>;
}

export type TransProps<
  K extends TFuncKey<N, TKPrefix> extends infer A ? A : never,
  N extends Namespace = DefaultNamespace,
  TKPrefix = undefined,
  E = React.HTMLProps<HTMLDivElement>
> = E & {
  children?: React.ReactNode;
  components?: readonly React.ReactNode[] | { readonly [tagName: string]: React.ReactNode };
  count?: number;
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

export interface WithTranslation<N extends Namespace = DefaultNamespace> {
  t: TFunction<N>;
  i18n: i18n;
  tReady: boolean;
}

export interface WithTranslationProps {
  i18n?: i18n;
  useSuspense?: boolean;
}

export function withTranslation<N extends Namespace = DefaultNamespace>(
  ns?: N,
  options?: {
    withRef?: boolean;
  },
): <
  C extends React.ComponentType<React.ComponentProps<C> & WithTranslationProps>,
  ResolvedProps = JSX.LibraryManagedAttributes<
    C,
    Subtract<React.ComponentProps<C>, WithTranslationProps>
  >
>(
  component: C,
) => React.ComponentType<Omit<ResolvedProps, keyof WithTranslation<N>> & WithTranslationProps>;

export interface I18nextProviderProps {
  i18n: i18n;
  defaultNS?: string;
}

export const I18nextProvider: React.FunctionComponent<I18nextProviderProps>;
export const I18nContext: React.Context<{ i18n: i18n }>;

export interface TranslationProps<N extends Namespace = DefaultNamespace> {
  children: (
    t: TFunction<N>,
    options: {
      i18n: i18n;
      lng: string;
    },
    ready: boolean,
  ) => React.ReactNode;
  ns?: N;
  i18n?: i18n;
  useSuspense?: boolean;
}

export function Translation<N extends Namespace = DefaultNamespace>(
  props: TranslationProps<N>,
): any;
