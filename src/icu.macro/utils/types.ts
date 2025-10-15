import type * as BabelTypes from '@babel/types';

export interface ExtractedTransData {
  attributesToCopy?: BabelTypes.JSXAttribute[];
  values: BabelTypes.ObjectProperty[];
  components: BabelTypes.JSXElement[];
  defaults: string;
}

export interface ProcessedTransResult {
  defaults: string;
  components: BabelTypes.JSXElement[];
  values: BabelTypes.ObjectProperty[];
  finalComponentIndex: number;
}

export type JSXChild =
  | BabelTypes.JSXText
  | BabelTypes.JSXExpressionContainer
  | BabelTypes.JSXElement
  | BabelTypes.JSXSpreadChild;
