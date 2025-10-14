import type * as BabelTypes from '@babel/types';
import type * as Babel from '@babel/core';
import type { JSXChild } from './types';
import { filterJSXChildren } from './filter-jsx-children';
import { getTextAndInterpolatedVariables } from './icu-formatter';

/**
 * Extract the names of interpolated values as object properties to pass to Trans
 */
export function getValues(children: JSXChild[], babel: typeof Babel): BabelTypes.ObjectProperty[] {
  const t = babel.types;
  const toObjectProperty = (name: string): BabelTypes.ObjectProperty =>
    t.objectProperty(t.identifier(name), t.identifier(name), false, true);

  const values: BabelTypes.ObjectProperty[] = [];

  for (const child of children) {
    // Recursively add inner element values
    if (t.isJSXElement(child)) {
      const innerValues = getValues(filterJSXChildren(child.children), babel);
      values.push(...innerValues);
      continue;
    }

    if (child.type !== 'JSXExpressionContainer') continue;

    const { expression } = child;

    // Simple identifier: { var }
    if (expression.type === 'Identifier') {
      values.push(toObjectProperty(expression.name));
      continue;
    }

    // Sequence expression: { var, number }
    if (expression.type === 'SequenceExpression') {
      const firstName = getFirstExpressionName(expression);
      if (firstName) values.push(toObjectProperty(firstName));
      continue;
    }

    // Object expression: { var: 'bar' }
    if (expression.type === 'ObjectExpression') {
      const objectProperties = expression.properties.filter(
        (p): p is BabelTypes.ObjectProperty => p.type === 'ObjectProperty',
      );
      values.push(...objectProperties);
      continue;
    }

    // Tagged template: date`${variable}`
    const taggedValues = extractTaggedTemplateValues(child, babel, toObjectProperty);
    values.push(...taggedValues);
  }

  return values;
}

/**
 * Get the name from the first expression in a sequence
 */
function getFirstExpressionName(seq: BabelTypes.SequenceExpression): string | null {
  const firstExpr = seq.expressions[0];

  if (firstExpr.type === 'Identifier') return firstExpr.name;
  if (firstExpr.type === 'NumericLiteral' || firstExpr.type === 'StringLiteral') {
    return String(firstExpr.value);
  }

  return null;
}

/**
 * Extract values from tagged template literals
 */
function extractTaggedTemplateValues(
  ele: JSXChild,
  babel: typeof Babel,
  toObjectProperty: (name: string) => BabelTypes.ObjectProperty,
): BabelTypes.ObjectProperty[] {
  // date`${variable}` and so on
  if (
    ele.type === 'JSXExpressionContainer' &&
    ele.expression.type === 'TaggedTemplateExpression' &&
    ele.expression.tag.type === 'Identifier'
  ) {
    const [variables] = getTextAndInterpolatedVariables(
      ele.expression.tag.name,
      ele.expression,
      0,
      babel,
    );
    return variables.map((vari) => toObjectProperty(vari));
  }
  return [];
}
