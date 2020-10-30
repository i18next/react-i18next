import i18next, { ReactOptions, i18n, ThirdPartyModule, Resource, TOptions, StringMap } from 'i18next';
import * as React from 'react';

/**
 * This interface can be augmented by users to add types to `react-i18next` default resources.
 */
export interface Resources {}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type ResourcesKey<T = keyof Resources> = [T] extends [never] ? string : T;

export type Namespace = ResourcesKey | ResourcesKey[];

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

// Normalize single namespace
type OmitArrayProps<T> = Exclude<T, keyof any[]>;
type AppendKeys<K1, K2> = `${K1 & string}.${OmitArrayProps<K2> & string}`;
type Normalize2<T, K = keyof T> = K extends keyof T
  ? T[K] extends object
  ? AppendKeys<K, keyof T[K]> | AppendKeys<K, Normalize2<T[K]>>
  : never
  : never;
type Normalize<T> = keyof T | Normalize2<T>;

// Normalize multiple namespaces
type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends (k: infer I) => void
  ? I
  : never;
type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;
type AppendNS<N, K> = `${N & string}:${K & string}`;
type NormalizeMulti<T, U extends keyof T, L = LastOf<U>> = L extends U
  ? AppendNS<L, Normalize<T[L]>> | NormalizeMulti<T, Exclude<U, L>>
  : never;

type NormalizeReturn<T, V> = V extends `${infer K}.${infer R}`
  ? K extends keyof T
  ? NormalizeReturn<T[K], R>
  : never
  : V extends keyof T
  ? T[V]
  : never;

type NormalizeMultiReturn<T, V> = V extends `${infer N}:${infer R}`
  ? N extends keyof T
  ? NormalizeReturn<T[N], R>
  : never
  : never;

export type TFuncKey<N, T = Resources> = N extends (keyof T)[]
  ? NormalizeMulti<T, N[number]>
  : N extends keyof T
  ? Normalize<T[N]>
  : string;

export type TFuncReturn<N, P, T = Resources> = N extends (keyof T)[]
  ? NormalizeMultiReturn<T, P>
  : N extends keyof T
  ? NormalizeReturn<T[N], P>
  : string;

export interface TFunction<N extends Namespace> {
  <K extends TFuncKey<N>, TInterpolationMap extends object = StringMap>(
    key: K,
    options?: TOptions<TInterpolationMap> | string,
  ): TFuncReturn<N, K>;
  <K extends TFuncKey<N>, TInterpolationMap extends object = StringMap>(
    key: K,
    defaultValue?: string,
    options?: TOptions<TInterpolationMap> | string,
  ): TFuncReturn<N, K>;
}

export interface TransProps<N extends Namespace, K extends TFuncKey<N>, E extends Element = HTMLDivElement>
  extends React.HTMLProps<E> {
  children?: React.ReactNode;
  components?: readonly React.ReactNode[] | { [tagName: string]: React.ReactNode };
  count?: number;
  defaults?: string;
  i18n?: i18n;
  i18nKey?: K;
  ns?: N;
  parent?: string | React.ComponentType<any> | null; // used in React.createElement if not null
  tOptions?: {};
  values?: {};
  t?: TFunction<N>;
}
export function Trans<N extends Namespace, K extends TFuncKey<N>, E extends Element = HTMLDivElement>(
  props: TransProps<N, K, E>
): React.ReactElement;

export function useSSR(initialI18nStore: Resource, initialLanguage: string): void;

export interface UseTranslationOptions {
  i18n?: i18n;
  useSuspense?: boolean;
}

type UseTranslationResponse<N extends Namespace> = [TFunction<N>, i18n, boolean] & {
  t: TFunction<N>;
  i18n: i18n;
  ready: boolean;
};
export function useTranslation<
  N extends Namespace = Extract<ResourcesKey, 'translation'>
>(
  ns?: N,
  options?: UseTranslationOptions
): UseTranslationResponse<N>;

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

export interface WithTranslation<N extends Namespace> {
  t: TFunction<N>;
  i18n: i18n;
  tReady: boolean;
}

export interface WithTranslationProps {
  i18n?: i18n;
  useSuspense?: boolean;
}

export function withTranslation<N extends Namespace>(
  ns?: N,
  options?: {
    withRef?: boolean;
  },
): <P extends WithTranslation<N>>(
  component: React.ComponentType<P>,
) => React.ComponentType<Omit<P, keyof WithTranslation<N>> & WithTranslationProps>;

export interface I18nextProviderProps {
  i18n: i18n;
  defaultNS?: string;
}

export const I18nextProvider: React.FunctionComponent<I18nextProviderProps>;
export const I18nContext: React.Context<{ i18n: i18n }>;

export interface TranslationProps<N extends Namespace> {
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
}

export function Translation<N extends Namespace>(props: TranslationProps<N>): any;
