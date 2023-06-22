import type { i18n, ParseKeys, Namespace, TypeOptions, TOptions, TFunction } from 'i18next';
import * as React from 'react';

type _DefaultNamespace = TypeOptions['defaultNS'];

type TransChild = React.ReactNode | Record<string, unknown>;
export type TransProps<
  Key extends ParseKeys<Ns, TOpt, KPrefix>,
  Ns extends Namespace = _DefaultNamespace,
  TOpt extends TOptions = {},
  KPrefix = undefined,
  E = React.HTMLProps<HTMLDivElement>,
> = E & {
  children?: TransChild | readonly TransChild[];
  components?: readonly React.ReactElement[] | { readonly [tagName: string]: React.ReactElement };
  count?: number;
  context?: string;
  defaults?: string;
  i18n?: i18n;
  i18nKey?: Key | Key[];
  ns?: Ns;
  parent?: string | React.ComponentType<any> | null; // used in React.createElement if not null
  tOptions?: TOpt;
  values?: {};
  shouldUnescape?: boolean;
  t?: TFunction<Ns, KPrefix>;
};

export function Trans<
  Key extends ParseKeys<Ns, TOpt, KPrefix>,
  Ns extends Namespace = _DefaultNamespace,
  TOpt extends TOptions = {},
  KPrefix = undefined,
  E = React.HTMLProps<HTMLDivElement>,
>(props: TransProps<Key, Ns, TOpt, KPrefix, E>): React.ReactElement;
