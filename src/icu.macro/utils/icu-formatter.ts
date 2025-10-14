/**
 * ICU Message Formatter
 *
 * Single unified processor that converts JSX to ICU message format.
 * Uses a single recursive function instead of mutual recursion.
 */

import type * as BabelTypes from '@babel/types';
import type * as Babel from '@babel/core';
import { trimIndent } from './trim-indent';
import { filterJSXChildren } from './filter-jsx-children';
import {
  validateTaggedTemplateType,
  validateQuasiNodesHaveInterpolation,
} from './validate-tagged-template';

interface FormatterContext {
  babel: typeof Babel;
  componentIndex: number;
}

/**
 * Merge JSX children into an ICU message format string
 */
export function mergeChildren(
  children: (
    | BabelTypes.JSXText
    | BabelTypes.JSXExpressionContainer
    | BabelTypes.JSXElement
    | BabelTypes.JSXSpreadChild
  )[],
  babel: typeof Babel,
  componentStartIndex = 0,
): string {
  const ctx: FormatterContext = { babel, componentIndex: componentStartIndex };
  return processNodes(children, ctx).text;
}

/**
 * Process tagged template and return variable names, formatted text, and new index
 */
export function getTextAndInterpolatedVariables(
  type: string,
  template: BabelTypes.TaggedTemplateExpression,
  componentIndex: number,
  babel: typeof Babel,
): [string[], string, number] {
  validateTaggedTemplateType(type, template);
  validateQuasiNodesHaveInterpolation(template);

  const ctx: FormatterContext = { babel, componentIndex };
  const parts: string[] = [];
  const variableNames: string[] = [];

  // Sort all parts by source position
  const allParts = [...template.quasi.expressions, ...template.quasi.quasis].sort(
    (a, b) => (a.start || 0) - (b.start || 0),
  );

  for (const part of allParts) {
    if (part.type === 'TemplateElement') {
      const text = part.value.cooked?.replace(/\s+/g, ' ') || '';
      if (text) parts.push(text);
      continue;
    }

    const expr = part as BabelTypes.Expression;
    const result = processTemplateExpression(expr, type, ctx, template);
    parts.push(result.text);
    variableNames.push(...result.variables);
  }

  return [variableNames, `{${parts.join('')}}`, ctx.componentIndex];
}

/**
 * Process multiple nodes and return combined text
 */
function processNodes(
  nodes: (
    | BabelTypes.JSXText
    | BabelTypes.JSXExpressionContainer
    | BabelTypes.JSXElement
    | BabelTypes.JSXSpreadChild
  )[],
  ctx: FormatterContext,
): { text: string } {
  const t = ctx.babel.types;
  let result = '';

  for (const node of nodes) {
    if (t.isJSXText(node) && node.value) {
      result += trimIndent(node.value);
      continue;
    }

    if (t.isJSXElement(node)) {
      const filtered = filterJSXChildren(node.children);
      const innerText = processNodes(filtered, ctx).text;
      result += `<${ctx.componentIndex}>${innerText}</${ctx.componentIndex}>`;
      ctx.componentIndex++;
      continue;
    }

    if (node.type === 'JSXExpressionContainer') {
      result += processExpressionContainer(node, ctx);
    }
  }

  return { text: result };
}

/**
 * Process a JSX expression container
 */
function processExpressionContainer(
  container: BabelTypes.JSXExpressionContainer,
  ctx: FormatterContext,
): string {
  const expr = container.expression;

  // Literals
  if (expr.type === 'NumericLiteral' || expr.type === 'StringLiteral') {
    return String(expr.value);
  }

  // Identifiers: {name}
  if (expr.type === 'Identifier') {
    return `{${expr.name}}`;
  }

  // Sequence: {name, number}
  if (expr.type === 'SequenceExpression') {
    const values = expr.expressions
      .map((i) => {
        if (i.type === 'Identifier') return i.name;
        if (i.type === 'NumericLiteral' || i.type === 'StringLiteral') return i.value;
        return null;
      })
      .filter((v): v is string | number => v !== null);
    return values.length > 0 ? `{${values.join(', ')}}` : '';
  }

  // Tagged templates: date`${var}`
  if (expr.type === 'TaggedTemplateExpression' && expr.tag.type === 'Identifier') {
    const [, formatted, newIndex] = getTextAndInterpolatedVariables(
      expr.tag.name,
      expr,
      ctx.componentIndex,
      ctx.babel,
    );
    ctx.componentIndex = newIndex;
    return formatted;
  }

  return '';
}

/**
 * Process an expression within a tagged template
 */
function processTemplateExpression(
  expr: BabelTypes.Expression,
  type: string,
  ctx: FormatterContext,
  template: BabelTypes.TaggedTemplateExpression,
): { text: string; variables: string[] } {
  // Validate expression type
  if (
    !ctx.babel.types.isIdentifier(expr) &&
    !ctx.babel.types.isTaggedTemplateExpression(expr) &&
    !ctx.babel.types.isJSXElement(expr)
  ) {
    const tagName = template.tag.type === 'Identifier' ? template.tag.name : 'unknown';
    throw new Error(
      `Must pass a variable, not an expression to "${tagName}\`\`" in "${template.loc?.filename}" on line ${template.loc?.start.line}`,
    );
  }

  // Simple identifier: ${var} → "var, type"
  if (expr.type === 'Identifier') {
    return { text: `${expr.name}, ${type}`, variables: [expr.name] };
  }

  // JSXElement: ${<Component/>} → "<0>...</0>"
  if (expr.type === 'JSXElement') {
    const filtered = filterJSXChildren(expr.children);
    const innerText = processNodes(filtered, ctx).text;
    const text = `<${ctx.componentIndex}>${innerText}</${ctx.componentIndex}>`;
    ctx.componentIndex++;
    const variables = extractVariableNamesFromJSX(expr, ctx.babel);
    return { text, variables };
  }

  // Nested tagged template: ${number`${x}`}
  if (expr.type === 'TaggedTemplateExpression' && expr.tag.type === 'Identifier') {
    const [vars, formatted, newIndex] = getTextAndInterpolatedVariables(
      expr.tag.name,
      expr,
      ctx.componentIndex,
      ctx.babel,
    );
    ctx.componentIndex = newIndex;
    return { text: formatted, variables: vars };
  }

  return { text: '', variables: [] };
}

/**
 * Extract variable names from JSX children (simplified version for tagged templates)
 */
function extractVariableNamesFromJSX(
  element: BabelTypes.JSXElement,
  babel: typeof Babel,
): string[] {
  const names: string[] = [];
  const filtered = filterJSXChildren(element.children);

  for (const child of filtered) {
    if (child.type === 'JSXExpressionContainer') {
      if (child.expression.type === 'Identifier') {
        names.push(child.expression.name);
      }
      if (child.expression.type === 'SequenceExpression') {
        const first = child.expression.expressions[0];
        if (first.type === 'Identifier') {
          names.push(first.name);
        } else if (first.type === 'NumericLiteral' || first.type === 'StringLiteral') {
          names.push(String(first.value));
        }
      }
    }
    if (babel.types.isJSXElement(child)) {
      names.push(...extractVariableNamesFromJSX(child, babel));
    }
  }

  return names;
}
