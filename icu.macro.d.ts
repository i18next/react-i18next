import React from 'react';
import { Trans } from './';
import type { Namespace, TypeOptions, i18n, ParseKeys } from 'i18next';

export { Trans };

type _DefaultNamespace = TypeOptions['defaultNS'];
declare module 'react-i18next/icu.macro' {
  export interface PluralSubProps<
    Key extends ParseKeys<Ns, {}>,
    Ns extends Namespace = _DefaultNamespace
  > {
    children?: never;
    i18nKey?: Key;
    i18n?: i18n;
    ns?: Ns;
    count: number;
    values?: {};
    zero?: string | React.ReactElement;
    one?: string | React.ReactElement;
    two?: string | React.ReactElement;
    few?: string | React.ReactElement;
    many?: string | React.ReactElement;
    other: string | React.ReactElement;
  }

  type PluralProps<T, Key extends ParseKeys<Ns, {}>, Ns extends Namespace = _DefaultNamespace> = {
    [P in keyof T]: P extends keyof PluralSubProps<Key, Ns>
      ? // support the standard properties of Plural
        PluralSubProps<Key, Ns>[P]
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

  interface NoChildren {
    children?: never;
  }

  interface SelectRequiredProps<
    Key extends ParseKeys<Ns, {}>,
    Ns extends Namespace = _DefaultNamespace
  > extends NoChildren {
    i18nKey?: Key;
    i18n?: i18n;
    ns?: Ns;
    other: string | React.ReactElement;
  }

  // defining it this way ensures that `other` is always defined, but allows
  // unlimited other select types.
  type SelectProps<
    Key extends ParseKeys<Ns, {}>,
    Ns extends Namespace = _DefaultNamespace
  > = SelectSubProps & SelectRequiredProps<Key, Ns>;

  function Plural<T, Key extends ParseKeys<Ns, {}>, Ns extends Namespace = _DefaultNamespace>(
    props: PluralProps<T, Key, Ns> & NoChildren,
  ): React.ReactElement;

  function SelectOrdinal<
    T,
    Key extends ParseKeys<Ns, {}>,
    Ns extends Namespace = _DefaultNamespace
  >(props: PluralProps<T, Key, Ns> & NoChildren): React.ReactElement;

  function Select<Key extends ParseKeys<Ns, {}>, Ns extends Namespace = _DefaultNamespace>(
    props: SelectProps<Key, Ns>,
  ): React.ReactElement;

  function date(strings: TemplateStringsArray, variable: Date): string;
  function time(strings: TemplateStringsArray, variable: Date): string;
  function number(strings: TemplateStringsArray, variable: number): string;

  type ValidInterpolations = React.ReactElement | string;

  function plural(
    strings: TemplateStringsArray,
    variable: number,
    ...args: ValidInterpolations[]
  ): string;
  function selectOrdinal(
    strings: TemplateStringsArray,
    variable: number,
    ...args: ValidInterpolations[]
  ): string;
  function select(
    strings: TemplateStringsArray,
    variable: string,
    ...args: ValidInterpolations[]
  ): string;
}
