import { type NodePath } from '@babel/traverse';
import type * as BabelTypes from '@babel/types';
import type * as Babel from '@babel/core';

/**
 * Validates that tagged template literals (number``, date``, etc.) are only used inside <Trans>
 */
export function validateTaggedTemplatesInsideTrans(
  taggedTemplates: Record<string, NodePath[]>,
  babel: typeof Babel,
): void {
  for (const [name, nodes] of Object.entries(taggedTemplates)) {
    for (const item of nodes) {
      if (!isInsideTransComponent(item, babel)) {
        throw new Error(
          `"${name}\`\`" can only be used inside <Trans> in "${item.node.loc?.filename}" on line ${item.node.loc?.start.line}`,
        );
      }
    }
  }
}

/**
 * Check if a node is inside a Trans component
 */
function isInsideTransComponent(item: NodePath, babel: typeof Babel): boolean {
  let f: NodePath | null = item.parentPath;

  while (f) {
    if (babel.types.isJSXElement(f.node)) {
      const jsxElem = f.node as BabelTypes.JSXElement;
      if (
        jsxElem.openingElement.name.type === 'JSXIdentifier' &&
        jsxElem.openingElement.name.name === 'Trans'
      ) {
        return true;
      }
    }
    f = f.parentPath;
  }

  return false;
}
