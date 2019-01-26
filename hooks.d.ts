import i18next from 'i18next';
import * as React from 'react';
import { Namespace, ReactI18NextOptions, TransProps } from './src/index';

interface HooksTransProps extends TransProps {
  children: React.ReactElement<any>[];
  tOptions?: {};
  ns?: Namespace;
}
interface UseTranslationOptions {
  i18n?: i18next.i18n;
}
export function setDefaults(options: ReactI18NextOptions): void;
export function getDefaults(): ReactI18NextOptions;
export function addUsedNamespaces(namespaces: Namespace[]): void;
export function getUsedNamespaces(): string[];
export function setI18n(instance: i18next.i18n): void;
export function getI18n(): i18next.i18n;
export const initReactI18next: {
  type: string;
  init(instance: i18next.i18n): void;
};
export function composeInitialProps(ForComponent: any): (ctx: unknown) => Promise<any>;
export function getInitialProps(): {
  initialI18nStore: {
    [ns: string]: {};
  };
  initialLanguage: string;
};
export function Trans({
  i18nKey,
  count,
  parent,
  i18n: i18nFromProps,
  t: tFromProps,
  defaults,
  values,
  components,
  children,
  tOptions,
  ns,
  ...additionalProps
}: HooksTransProps): any;

export function useSSR(initialI18nStore: any, initialLanguage: any): void;
export function useTranslation(
  ns?: Namespace,
  options?: UseTranslationOptions,
): [i18next.TFunction, i18next.i18n | {}];

export function withSSR(): (
  WrappedComponent: React.ComponentClass<{}, any>,
) => {
  ({
    initialI18nStore,
    initialLanguage,
    ...rest
  }: {
    [x: string]: any;
    initialI18nStore: any;
    initialLanguage: any;
  }): React.ComponentElement<{}, React.Component<{}, any, any>>;
  getInitialProps: (ctx: unknown) => Promise<any>;
};
export function withTranslation(
  ns?: Namespace,
): (WrappedComponent: React.ComponentClass<any>) => (props: any) => any;
