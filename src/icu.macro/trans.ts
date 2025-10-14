import { type NodePath } from '@babel/traverse';
import type * as BabelTypes from '@babel/types';
import type * as Babel from '@babel/core';
import {
  findAttribute,
  cloneExistingAttributes,
  processTrans,
  buildTransElement,
  filterJSXChildren,
  type ProcessedTransResult,
} from './utils';

export function transAsJSX(
  parentPath: NodePath<BabelTypes.JSXOpeningElement>,
  {
    attributes,
    children,
  }: {
    attributes: NodePath<BabelTypes.JSXAttribute | BabelTypes.JSXSpreadAttribute>[];
    children: NodePath<
      BabelTypes.JSXText | BabelTypes.JSXExpressionContainer | BabelTypes.JSXElement
    >[];
  },
  babel: typeof Babel,
  state: { filename?: string },
): void {
  const defaultsAttr = findAttribute('defaults', attributes);
  const componentsAttr = findAttribute('components', attributes);
  // if there is "defaults" attribute and no "components" attribute, parse defaults and extract from the parsed defaults instead of children
  // if a "components" attribute has been provided, we assume they have already constructed a valid "defaults" and it does not need to be parsed
  const parseDefaults = defaultsAttr && !componentsAttr;

  const extracted = parseDefaults
    ? parseDefaultsAttribute(defaultsAttr, babel, state)
    : processTrans(children.map((c) => c.node) as any[], babel);

  let clonedAttributes = cloneExistingAttributes(attributes);
  if (parseDefaults) {
    // remove existing defaults so it can be replaced later with the new parsed defaults
    clonedAttributes = clonedAttributes.filter(
      (node) => node.name.type === 'JSXIdentifier' && node.name.name !== 'defaults',
    );
  }

  // replace the node with the new Trans
  const replacePath = children.length ? children[0].parentPath : parentPath;
  replacePath.replaceWith(
    buildTransElement(extracted, clonedAttributes, babel.types, false, !!children.length),
  );
}

/**
 * Parse the defaults attribute and extract Trans data from it
 */
function parseDefaultsAttribute(
  defaultsAttr: NodePath<BabelTypes.JSXAttribute | BabelTypes.JSXSpreadAttribute>,
  babel: typeof Babel,
  state: { filename?: string },
): ProcessedTransResult {
  const attrValue = (defaultsAttr.node as BabelTypes.JSXAttribute).value;
  if (!attrValue || attrValue.type !== 'StringLiteral') {
    return { defaults: '', components: [], values: [] };
  }

  const defaultsExpression = attrValue.value;
  const parsed = babel.parse(`<>${defaultsExpression}</>`, {
    presets: ['@babel/react'],
    filename: state.filename,
  })?.program.body[0];

  if (!parsed || parsed.type !== 'ExpressionStatement') {
    return { defaults: '', components: [], values: [] };
  }

  if (parsed.expression.type !== 'JSXFragment') {
    return { defaults: '', components: [], values: [] };
  }

  const parsedChildren = filterJSXChildren(parsed.expression.children);
  return processTrans(parsedChildren, babel);
}
