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
  TFunctionReturn,
  InterpolationMap,
} from 'i18next';
import * as React from 'react';

type _DefaultNamespace = TypeOptions['defaultNS'];
type _EnableSelector = TypeOptions['enableSelector'];

type TransChild = React.ReactNode | Record<string, unknown>;
type $NoInfer<T> = [T][T extends T ? 0 : never];

/**
 * Extracts interpolation variable names from a translation string
 * Examples:
 * - ExtractInterpolationKeys<"Hello {{name}}!"> = ["name"]
 * - ExtractInterpolationKeys<"{{count}} items from {{sender}}"> = ["count", "sender"]
 * - ExtractInterpolationKeys<"No variables"> = []
 */
type ExtractInterpolationKeys<S extends string> = S extends ''
  ? []
  : S extends `${infer _Start}{{${infer Variable}}}${infer Rest}`
    ? [Variable, ...ExtractInterpolationKeys<Rest>]
    : [];

/**
 * Converts an array of keys to a union type
 * Example: KeysToUnion<["name", "age"]> = "name" | "age"
 */
type KeysToUnion<T extends readonly string[]> = T[number];

/**
 * Helper type to check if an object has all required keys
 * This creates a type that requires all keys to be present
 */
type RequireKeys<T extends string> = T extends never
  ? Record<string, never> | undefined
  : { [K in T]: unknown };

/**
 * Creates a Record type from extracted interpolation keys
 * If no keys are extracted, returns an empty object type or undefined
 * Otherwise, returns a required Record with the extracted keys
 *
 * Special case: If S is the generic 'string' type (not a literal),
 * it means resources are not defined (e.g., imported from JSON),
 * so we allow any Record<string, unknown> for flexibility.
 */
type InterpolationRecord<S extends string> = string extends S
  ? Record<string, unknown> | undefined // Generic string type - allow any keys
  : ExtractInterpolationKeys<S> extends infer Keys
    ? Keys extends []
      ? Record<string, never> | undefined // No interpolation variables
      : Keys extends readonly string[]
        ? RequireKeys<KeysToUnion<Keys>>
        : never
    : never;

/**
 * Distributive version of InterpolationMap that works correctly with union types
 * This ensures each key is processed individually rather than creating an intersection
 *
 * This type extracts interpolation variables from translation strings and creates
 * a type-safe Record that only accepts the correct variable names.
 */
type TransInterpolationMap<Ns extends Namespace, Key, TOpt extends TOptions> = Key extends any
  ? TFunctionReturn<Ns, Key, TOpt> extends infer TranslationString
    ? TranslationString extends string
      ? InterpolationRecord<TranslationString>
      : InterpolationMap<TFunctionReturn<Ns, Key, TOpt>> // Fallback to i18next's InterpolationMap
    : never
  : never;

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
  values?: TransInterpolationMap<Ns, Key, TOpt>;
  shouldUnescape?: boolean;
  t?: TFunction<Ns, KPrefix>;
};

export interface TransLegacy {
  <
    Key extends ParseKeys<Ns, TOpt, KPrefix>,
    Ns extends Namespace = _DefaultNamespace,
    KPrefix = undefined,
    TContext extends string | undefined = undefined,
    TOpt extends TOptions & { context?: TContext } = { context: TContext },
    E = React.HTMLProps<HTMLDivElement>,
  >(
    props: TransProps<Key, Ns, KPrefix, TContext, TOpt, E>,
  ): React.ReactElement;
}

export interface TransSelectorProps<
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
  values?: TransInterpolationMap<Ns, Key, TOpt>;
  shouldUnescape?: boolean;
  t?: TFunction<Ns, KPrefix>;
}

export interface TransSelector {
  <
    Target extends ConstrainTarget<TOpt>,
    Key extends SelectorFn<GetSource<$NoInfer<Ns>, KPrefix>, ApplyTarget<Target, TOpt>, TOpt>,
    const Ns extends Namespace = _DefaultNamespace,
    KPrefix = undefined,
    TContext extends string | undefined = undefined,
    TOpt extends TOptions & { context?: TContext } = { context: TContext },
    E = React.HTMLProps<HTMLDivElement>,
  >(
    props: TransSelectorProps<Key, Ns, KPrefix, TContext, TOpt> & E,
  ): React.ReactElement;
}

export const Trans: _EnableSelector extends true | 'optimize' ? TransSelector : TransLegacy;

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
