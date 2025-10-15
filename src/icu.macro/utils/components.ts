import type * as BabelTypes from '@babel/types';
import type * as Babel from '@babel/core';
import type { JSXChild } from './types.js';

/**
 * Extract the React components to pass to Trans as components
 */
export function getComponents(children: JSXChild[], babel: typeof Babel): BabelTypes.JSXElement[] {
  const t = babel.types;
  const components: BabelTypes.JSXElement[] = [];

  for (const child of children) {
    // Direct JSX element
    if (t.isJSXElement(child)) {
      processJSXElement(child, components, t);
      continue;
    }

    // Check for tagged template expressions: date`${var}`
    if (t.isJSXExpressionContainer(child) && t.isTaggedTemplateExpression(child.expression)) {
      extractComponentsFromTaggedTemplate(child.expression, components, t, babel);
    }
  }

  return components;
}

/**
 * Extract components from tagged template expressions (date``, number``, etc.)
 */
function extractComponentsFromTaggedTemplate(
  template: BabelTypes.TaggedTemplateExpression,
  components: BabelTypes.JSXElement[],
  t: typeof BabelTypes,
  babel: typeof Babel,
): void {
  for (const expr of template.quasi.expressions) {
    // Check for nested tagged templates with components
    if (t.isTaggedTemplateExpression(expr) && expr.quasi.expressions.length) {
      const nestedJSXElements = expr.quasi.expressions.filter((e): e is BabelTypes.JSXElement =>
        t.isJSXElement(e),
      );
      components.push(...getComponents(nestedJSXElements, babel));
    }

    // Add JSXElement components
    if (t.isJSXElement(expr)) {
      processJSXElement(expr, components, t);
    }
  }
}

/**
 * Process a JSXElement and add it to the components list
 * Cleans out invalid sequence expressions like `{ catchDate, date, short }` → `{ catchDate }`
 */
function processJSXElement(
  jsxElement: BabelTypes.JSXElement,
  components: BabelTypes.JSXElement[],
  t: typeof BabelTypes,
): void {
  const clone = t.cloneNode(jsxElement, /* deep */ true) as BabelTypes.JSXElement;

  // Clean up children by removing the extra parts of sequence expressions
  clone.children = clone.children.reduce<JSXChild[]>((clonedChildren, clonedChild: any) => {
    const clonedEle = clonedChild.node ? clonedChild.node : clonedChild;

    // clean out invalid definitions by replacing `{ catchDate, date, short }` with `{ catchDate }`
    if (
      clonedEle.expression &&
      clonedEle.expression.expressions &&
      Array.isArray(clonedEle.expression.expressions)
    ) {
      clonedEle.expression.expressions = [clonedEle.expression.expressions[0]];
    }

    clonedChildren.push(clonedChild);
    return clonedChildren;
  }, []);

  components.push(clone);
}
