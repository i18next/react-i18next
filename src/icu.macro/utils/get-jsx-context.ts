import { type NodePath } from '@babel/traverse';
import type * as BabelTypes from '@babel/types';

export interface JSXContext {
  parentPath: NodePath<BabelTypes.JSXOpeningElement>;
  attributes: NodePath<BabelTypes.JSXAttribute | BabelTypes.JSXSpreadAttribute>[];
  children: NodePath<
    BabelTypes.JSXText | BabelTypes.JSXExpressionContainer | BabelTypes.JSXElement
  >[];
}

/**
 * Extract attributes and children from a JSX reference path
 */
export function getJSXContext(referencePath: NodePath): JSXContext | null {
  if (!referencePath.parentPath || referencePath.parentPath.type !== 'JSXOpeningElement') {
    return null;
  }

  const attributes = referencePath.parentPath.get('attributes') as NodePath<
    BabelTypes.JSXAttribute | BabelTypes.JSXSpreadAttribute
  >[];

  const children = referencePath.parentPath.parentPath
    ? ((referencePath.parentPath.parentPath as NodePath<BabelTypes.JSXElement>).get(
        'children',
      ) as NodePath<
        BabelTypes.JSXText | BabelTypes.JSXExpressionContainer | BabelTypes.JSXElement
      >[])
    : [];

  return {
    parentPath: referencePath.parentPath as NodePath<BabelTypes.JSXOpeningElement>,
    attributes,
    children,
  };
}
