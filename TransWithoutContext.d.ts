import type {
  i18n,
  ApplyTarget,
  ConstrainTarget,
  GetSource,
  ParseKeys,
  Namespace,
  SelectorFn,
  TypeOptions,
  TOptions,
  TFunction,
} from 'i18next';
import * as React from 'react';

type _DefaultNamespace = TypeOptions['defaultNS'];
type _EnableSelector = TypeOptions['enableSelector'];

type TransChild = React.ReactNode | Record<string, unknown>;

/**
 * This type functionally replaces {@link TransProps}, and should replace it
 * when cut over from the string-based to the selector API (tentatively v27).
 *
 * So if you depend on this type directly, just be aware that it will be renamed
 * to `TransProps` in a future major version.
 */
interface TransPropsInterface<
  Key,
  Ns extends Namespace = _DefaultNamespace,
  KPrefix = undefined,
  TContext extends string | undefined = undefined,
  TOpt extends TOptions & { context?: TContext } = { context: TContext },
> {
  children?: TransChild | readonly TransChild[];
  components?: readonly React.ReactElement[] | { readonly [tagName: string]: React.ReactElement };
  count?: number;
  context?: TContext;
  defaults?: string;
  i18n?: i18n;
  i18nKey?: Key;
  ns?: Ns;
  parent?: string | React.ComponentType<any> | null; // used in React.createElement if not null
  tOptions?: TOpt;
  values?: {};
  shouldUnescape?: boolean;
  t?: TFunction<Ns, KPrefix>;
}

export type GetTransProps<
  Target extends ConstrainTarget<TOpt>,
  Key extends ParseKeys<Ns, TOpt, KPrefix>,
  Ns extends Namespace = _DefaultNamespace,
  KPrefix = undefined,
  TContext extends string | undefined = undefined,
  TOpt extends TOptions & { context?: TContext } = { context: TContext },
  E = React.HTMLProps<HTMLDivElement>,
> = E &
  TransPropsInterface<
    _EnableSelector extends true
      ? SelectorFn<GetSource<NoInfer<Ns>, KPrefix>, ApplyTarget<Target, TOpt>, TOpt>
      : Key | Key[],
    Ns,
    KPrefix,
    TContext,
    TOpt
  >;

export declare function Trans<
  Key extends ParseKeys<Ns, TOpt, KPrefix>,
  const Ns extends Namespace = _DefaultNamespace,
  KPrefix = undefined,
  TContext extends string | undefined = undefined,
  TOpt extends TOptions & { context?: TContext } = { context: TContext },
  E = React.HTMLProps<HTMLDivElement>,
  Target extends ConstrainTarget<TOpt> = ConstrainTarget<TOpt>,
>(props: GetTransProps<Target, Key, Ns, KPrefix, TContext, TOpt, E>): React.ReactElement;

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

/**
 * This type left here in case anyone in userland depends on it -- it's no longer used internally,
 * and can/should be removed when we cut over to the selector API (tentatively v27)
 */
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
