declare module 'react-i18next/icu.macro' {
  type Namespace = import('.').Namespace;
  type DefaultNamespace = import('.').DefaultNamespace;
  type Resources = import('.').Resources;
  type TFuncKey<N extends Namespace = DefaultNamespace, T = Resources> = import('.').TFuncKey<N, T>;
  type i18n = import('i18next').i18n;

  export interface PluralSubProps<
    K extends TFuncKey<N> extends infer A ? A : never,
    N extends Namespace = DefaultNamespace
  > {
    children?: never;
    i18nKey?: K;
    i18n?: i18n;
    ns?: N;
    count: number;
    zero?: string | React.ReactElement;
    one?: string | React.ReactElement;
    two?: string | React.ReactElement;
    few?: string | React.ReactElement;
    many?: string | React.ReactElement;
    other: string | React.ReactElement;
  }

  type PluralProps<
    T,
    K extends TFuncKey<N> extends infer A ? A : never,
    N extends Namespace = DefaultNamespace
  > = {
    [P in keyof T]: P extends keyof PluralSubProps<K, N>
      ? // support the standard properties of Plural
        PluralSubProps<K, N>[P]
      : // this supports infinite $0={..} or $123={..}
      // technically it also supports $-1={..} and $2.3={..} but we don't need to
      // worry since that's invalid syntax.
      P extends `$${number}`
      ? string | React.ReactElement
      : never;
  };

  interface SelectSubProps {
    [key: string]: string | React.ReactElement;
  }

  interface SelectRequiredProps<
    K extends TFuncKey<N> extends infer A ? A : never,
    N extends Namespace = DefaultNamespace
  > {
    children?: never;
    i18nKey?: K;
    i18n?: i18n;
    ns?: N;
    other: string | React.ReactElement;
  }

  // defining it this way ensures that `other` is always defined, but allows
  // unlimited other select types.
  type SelectProps<
    K extends TFuncKey<N> extends infer A ? A : never,
    N extends Namespace = DefaultNamespace
  > = SelectSubProps & SelectRequiredProps<K, N>;

  export function Plural<
    T,
    K extends TFuncKey<N> extends infer A ? A : never,
    N extends Namespace = DefaultNamespace
  >(props: PluralProps<T, K, N>): React.ReactElement;

  export function SelectOrdinal<
    T,
    K extends TFuncKey<N> extends infer A ? A : never,
    N extends Namespace = DefaultNamespace
  >(props: PluralProps<T, K, N>): React.ReactElement;

  export function Select<
    K extends TFuncKey<N> extends infer A ? A : never,
    N extends Namespace = DefaultNamespace
  >(props: SelectProps<K, N>): React.ReactElement;

  export function Trans<
    K extends TFuncKey<N> extends infer A ? A : never,
    N extends Namespace = DefaultNamespace,
    E extends Element = HTMLDivElement
  >(props: import('.').TransProps<K, N, E>): React.ReactElement;
}
