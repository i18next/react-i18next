import type { i18n, ParseKeys, Namespace, TypeOptions, TOptions, TFunction } from 'i18next';
import * as React from 'react';

type _DefaultNamespace = TypeOptions['defaultNS'];

type TransChild = React.ReactNode | Record<string, unknown>;
export type TransProps<
  Key extends ParseKeys<Ns, TOpt, KPrefix>,
  Ns extends Namespace = _DefaultNamespace,
  KPrefix = undefined,
  TContext extends string | undefined = undefined,
  TOpt extends TOptions & { context?: TContext } = { context: TContext },
  E = React.HTMLProps<HTMLDivElement>,
> = E & {
  children?: TransChild | readonly TransChild[];
  components?: readonly React.ReactElement[] | { readonly [tagName: string]: React.ReactElement };
  count?: number;
  context?: TContext;
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
  KPrefix = undefined,
  TContext extends string | undefined = undefined,
  TOpt extends TOptions & { context?: TContext } = { context: TContext },
  E = React.HTMLProps<HTMLDivElement>,
>(props: TransProps<Key, Ns, KPrefix, TContext, TOpt, E>): React.ReactElement;

export type ErrorCode =
  | 'NO_I18NEXT_INSTANCE'
  | 'NO_LANGUAGES'
  | 'DEPRECATED_OPTION'
  | 'TRANS_NULL_VALUE'
  | 'TRANS_INVALID_OBJ'
  | 'TRANS_INVALID_VAR'
  | 'TRANS_INVALID_COMPONENTS';

export type ErrorMeta = {
  code: ErrorCode;
  i18nKey?: string;
  [x: string]: any;
};

/**
 * Use to type the logger arguments
 * @example
 * ```
 * import type { ErrorArgs } from 'react-i18next';
 *
 * const logger = {
 *   // ....
 *   warn: function (...args: ErrorArgs) {
 *      if (args[1]?.code === 'TRANS_INVALID_OBJ') {
 *        const [msg, { i18nKey, ...rest }] = args;
 *        return log(i18nKey, msg, rest);
 *      }
 *      log(...args);
 *   }
 * }
 * i18n.use(logger).use(i18nReactPlugin).init({...});
 * ```
 */
export type ErrorArgs = readonly [string, ErrorMeta | undefined, ...any[]];
