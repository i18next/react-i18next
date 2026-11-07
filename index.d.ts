import type { $Subtract, $Tuple } from './helpers.js';
import type {
  ReactOptions,
  i18n,
  Resource,
  FlatNamespace,
  Namespace,
  TypeOptions,
  TFunction,
  KeyPrefix,
  KeyPrefixSelector,
  NsResource,
  ParseKeys,
  TOptions,
  InterpolationMap,
  TFunctionReturn,
  TOptionsBase,
  AppendKeyPrefix,
} from 'i18next';
import * as React from 'react';
import {
  Trans,
  TransProps,
  TransSelectorProps,
  ErrorCode,
  ErrorArgs,
} from './TransWithoutContext.js';
export { initReactI18next } from './initReactI18next.js';
export type { ReactOptions } from 'i18next';

export function nodesToString(
  children: React.ReactNode,
  i18nOptions?: ReactOptions,
  i18n?: i18n,
  i18nKey?: string,
): string;

export const TransWithoutContext: typeof Trans;
export { Trans, TransProps, TransSelectorProps, ErrorArgs, ErrorCode };

/**
 * Content declaration for IcuTrans component
 * Describes React components as type + props blueprints that will be rendered
 */
export interface IcuTransContentDeclaration {
  type: string | React.ComponentType<any>;
  props?: {
    children?: IcuTransContentDeclaration | IcuTransContentDeclaration[];
    [key: string]: any;
  };
}

/**
 * Props for IcuTransWithoutContext component (no React context)
 */
export type IcuTransWithoutContextProps<
  Key extends ParseKeys<Ns, TOpt, KPrefix>,
  Ns extends Namespace = _DefaultNamespace,
  KPrefix = undefined,
  TContext extends string | undefined = undefined,
  TOpt extends TOptions & { context?: TContext } = { context: TContext },
> = {
  /** The i18n key to look up the translation */
  i18nKey: Key;
  /** The default translation in ICU format with numbered tags (e.g., "<0>Click here</0>") */
  defaultTranslation: string;
  /** Declaration tree describing React components and their props */
  content: IcuTransContentDeclaration[];
  /** Optional namespace(s) for the translation */
  // see TransProps.ns: keep single-namespace values assignable when `t` fixes Ns to an array
  ns?: Ns | (Ns extends readonly (infer S extends string)[] ? S : never);
  /**
   * Values for ICU variable interpolation. Under `parseInterpolation: 'icu'`
   * (or `'mf2'`) they are typed from the message.
   */
  values?: [TypeOptions['parseInterpolation']] extends ['icu'] | ['mf2']
    ? InterpolationMap<TFunctionReturn<Ns, AppendKeyPrefix<Key, KPrefix>, TOpt>>
    : Record<string, any>;
  /** i18next instance. If not provided, uses global instance */
  i18n?: i18n;
  /** Custom translation function */
  t?: TFunction<Ns, KPrefix>;
};

/**
 * Props for IcuTrans component (with React context support)
 */
export type IcuTransProps<
  Key extends ParseKeys<Ns, TOpt, KPrefix>,
  Ns extends Namespace = _DefaultNamespace,
  KPrefix = undefined,
  TContext extends string | undefined = undefined,
  TOpt extends TOptions & { context?: TContext } = { context: TContext },
> = IcuTransWithoutContextProps<Key, Ns, KPrefix, TContext, TOpt>;

/**
 * IcuTrans component for rendering ICU MessageFormat translations
 * This is the context-aware version that works with I18nextProvider
 *
 * @example
 * ```tsx
 * // Type-safe usage with namespace
 * <IcuTrans<'welcome.message', 'common'>
 *   i18nKey="welcome.message"
 *   defaultTranslation="Welcome <0>friend</0>!"
 *   content={[{ type: 'strong', props: {} }]}
 * />
 * ```
 */
export interface IcuTransComponent {
  <
    const Key extends ParseKeys<Ns, TOpt, KPrefix>,
    Ns extends Namespace = _DefaultNamespace,
    KPrefix = undefined,
    TContext extends string | undefined = undefined,
    TOpt extends TOptions & { context?: TContext } = { context: TContext },
  >(
    props: IcuTransProps<Key, Ns, KPrefix, TContext, TOpt>,
  ): React.ReactElement;
}

/**
 * IcuTransWithoutContext component for rendering ICU MessageFormat translations
 * This version does not use React context and requires explicit i18n instance
 *
 * @example
 * ```tsx
 * // Type-safe usage with namespace
 * <IcuTransWithoutContext<'welcome.message', 'common'>
 *   i18nKey="welcome.message"
 *   defaultTranslation="Welcome <0>back</0>!"
 *   content={[{ type: 'strong', props: {} }]}
 *   i18n={i18nInstance}
 * />
 * ```
 */
export interface IcuTransWithoutContextComponent {
  <
    const Key extends ParseKeys<Ns, TOpt, KPrefix>,
    Ns extends Namespace = _DefaultNamespace,
    KPrefix = undefined,
    TContext extends string | undefined = undefined,
    TOpt extends TOptions & { context?: TContext } = { context: TContext },
  >(
    props: IcuTransWithoutContextProps<Key, Ns, KPrefix, TContext, TOpt>,
  ): React.ReactElement;
}

export const IcuTrans: IcuTransComponent;
export const IcuTransWithoutContext: IcuTransWithoutContextComponent;

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
  interface CustomInstanceExtensions {
    reportNamespaces?: ReportNamespaces;
  }

  // i18next declares `react?: ReactOptions` in its init options with an empty interface;
  // react-i18next fills it in
  interface ReactOptions {
    /**
     * Set it to fallback to let passed namespaces to translated hoc act as fallbacks
     * @default 'default'
     */
    nsMode?: 'default' | 'fallback';
    /**
     * Set it to the default parent element created by the Trans component.
     * @default undefined (no parent element)
     */
    defaultTransParent?: string;
    /**
     * Set which events trigger a re-render (useTranslation, withTranslation, Translation, Trans
     * and IcuTrans), can be set to false or string of events
     * @default 'languageChanged'
     */
    bindI18n?: string | false;
    /**
     * Set which events on store trigger a re-render, can be set to false or string of events
     * @default ''
     */
    bindI18nStore?: string | false;
    /**
     * Set fallback value for Trans components without children
     * @default undefined
     */
    transEmptyNodeValue?: string;
    /**
     * Set it to false if you do not want to use Suspense
     * @default true
     */
    useSuspense?: boolean;
    /**
     * Function to generate an i18nKey from the defaultValue (or Trans children)
     * when no key is provided.
     * By default, the defaultValue (Trans text) itself is used as the key.
     * If you want to require keys for all translations, supply a function
     * that always throws an error.
     * @default undefined
     */
    hashTransKey?(defaultValue: TOptionsBase['defaultValue']): TOptionsBase['defaultValue'];
    /**
     * Convert eg. <br/> found in translations to a react component of type br
     * @default true
     */
    transSupportBasicHtmlNodes?: boolean;
    /**
     * Which nodes not to convert in defaultValue generation in the Trans component.
     * @default ['br', 'strong', 'i', 'p']
     */
    transKeepBasicHtmlNodesFor?: readonly string[];
    /**
     * Wrap text nodes in a user-specified element.
     * @default ''
     */
    transWrapTextNodes?: string;
    /**
     * Default props to apply to all Trans components.
     * Component-level props will override these defaults.
     */
    transDefaultProps?: {
      tOptions?: TOptions;
      values?: object;
      /** @deprecated ignored: Trans always decodes HTML entities */
      shouldUnescape?: boolean;
      components?: readonly unknown[] | { readonly [tagName: string]: unknown }; // Use `unknown` (or `any`) to be permissive without importing React.
    };
    /**
     * Optional keyPrefix that will be automatically applied to returned t function in useTranslation for example.
     * Accepts a string or a selector function (e.g. `$ => $.deeply.nested`).
     * @default undefined
     */
    keyPrefix?: string | (($: any) => any);
    /**
     * Unescape function, used by Trans to decode the HTML entities in its output
     * by default it unescapes some basic html entities
     */
    unescape?(str: string): string;
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicAttributes {
      i18nIsDynamicList?: boolean;
    }
  }
}

type _DefaultNamespace = TypeOptions['defaultNS'];

export function useSSR(
  initialI18nStore: Resource,
  initialLanguage: string,
  props?: { i18n?: i18n },
): void;

type _EnableSelector = TypeOptions['enableSelector'];

export type UseTranslationOptions<KPrefix> = {
  i18n?: i18n;
  useSuspense?: boolean;
  keyPrefix?: KPrefix;
  bindI18n?: string | false;
  bindI18nStore?: string | false;
  nsMode?: 'fallback' | 'default';
  lng?: string;
  // other of these options might also work: https://github.com/i18next/i18next/blob/master/index.d.ts#L127
};

export type UseTranslationResponse<Ns extends Namespace, KPrefix> = [
  t: TFunction<Ns, KPrefix>,
  i18n: i18n,
  ready: boolean,
] & {
  t: TFunction<Ns, KPrefix>;
  i18n: i18n;
  ready: boolean;
};

// Workaround to make code completion to work when suggesting namespaces.
// This is a typescript limitation when using generics with default values,
// it'll be addressed in this issue: https://github.com/microsoft/TypeScript/issues/52516
export type FallbackNs<Ns> = Ns extends undefined
  ? _DefaultNamespace
  : Ns extends Namespace
    ? Ns
    : _DefaultNamespace;

export const useTranslation: _EnableSelector extends true | 'optimize' | 'strict'
  ? UseTranslationSelector
  : UseTranslationLegacy;

interface UseTranslationLegacy {
  <
    const Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
    const KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
  >(
    ns?: Ns,
    options?: UseTranslationOptions<KPrefix>,
  ): UseTranslationResponse<FallbackNs<Ns>, KPrefix>;
}

interface UseTranslationSelector {
  // Overload: selector function as keyPrefix — provides type-safe key narrowing
  <
    const Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined,
    const KPrefix extends KeyPrefixSelector<FallbackNs<Ns>>,
  >(
    ns: Ns,
    options: UseTranslationOptions<KPrefix> & { keyPrefix: KPrefix },
  ): UseTranslationResponse<FallbackNs<Ns>, KPrefix>;

  // Overload: string or undefined keyPrefix (original behavior)
  <
    const Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
    const KPrefix = undefined,
  >(
    ns?: Ns,
    options?: UseTranslationOptions<KPrefix>,
  ): UseTranslationResponse<FallbackNs<Ns>, KPrefix>;
}

// Need to see usage to improve this
export function withSSR(): <Props>(WrappedComponent: React.ComponentType<Props>) => {
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
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
> {
  t: TFunction<FallbackNs<Ns>, KPrefix>;
  i18n: i18n;
  tReady: boolean;
}

export interface WithTranslationProps {
  i18n?: i18n;
  useSuspense?: boolean;
}

export function withTranslation<
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  ns?: Ns,
  options?: {
    withRef?: boolean;
    keyPrefix?: KPrefix;
  },
): <
  C extends React.ComponentType<React.ComponentProps<any> & WithTranslationProps>,
  ResolvedProps = React.JSX.LibraryManagedAttributes<
    C,
    $Subtract<React.ComponentProps<C>, WithTranslationProps>
  >,
>(
  component: C,
) => React.ComponentType<Omit<ResolvedProps, keyof WithTranslation<Ns>> & WithTranslationProps>;

export interface I18nextProviderProps {
  children?: React.ReactNode;
  i18n: i18n;
  defaultNS?: string | string[];
}

export const I18nextProvider: React.FunctionComponent<I18nextProviderProps>;
// undefined outside an I18nextProvider
export const I18nContext: React.Context<{ i18n: i18n; defaultNS?: string | string[] } | undefined>;

export interface TranslationProps<
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
> {
  children: (
    t: TFunction<FallbackNs<Ns>, KPrefix>,
    options: {
      i18n: i18n;
      lng: string;
    },
    ready: boolean,
  ) => React.ReactNode;
  ns?: Ns;
  i18n?: i18n;
  useSuspense?: boolean;
  keyPrefix?: KPrefix;
  nsMode?: 'fallback' | 'default';
}

export function Translation<
  Ns extends FlatNamespace | $Tuple<FlatNamespace> | undefined = undefined,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(props: TranslationProps<Ns, KPrefix>): any;
