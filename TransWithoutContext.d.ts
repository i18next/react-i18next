import { i18n, TFuncKey, Namespace, TypeOptions, TFunction, KeyPrefix } from 'i18next';
import * as React from 'react';

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
