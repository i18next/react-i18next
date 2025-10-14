import { type NodePath } from '@babel/traverse';
import type * as BabelTypes from '@babel/types';
import type * as Babel from '@babel/core';
import {
  findAttribute,
  processTrans,
  buildTransElement,
  extractExistingValues,
  getChildrenFromJSXExpression,
  type ExtractedTransData,
} from './utils';

export function selectAsJSX(
  parentPath: NodePath<BabelTypes.JSXOpeningElement>,
  {
    attributes,
  }: {
    attributes: NodePath<BabelTypes.JSXAttribute | BabelTypes.JSXSpreadAttribute>[];
    children: NodePath<
      BabelTypes.JSXText | BabelTypes.JSXExpressionContainer | BabelTypes.JSXElement
    >[];
  },
  babel: typeof Babel,
): void {
  const t = babel.types;
  const toObjectProperty = (name: string, value?: boolean): BabelTypes.ObjectProperty =>
    t.objectProperty(t.identifier(name), t.identifier(name), false, !value);

  // will need to merge switch attribute with existing values attribute
  const existingValuesAttribute = findAttribute('values', attributes);
  const existingValues = extractExistingValues(existingValuesAttribute);

  let componentStartIndex = 0;

  const extracted = attributes.reduce(
    (mem: ExtractedTransData, attr) => {
      if (attr.node.type === 'JSXSpreadAttribute') return mem;
      const jsxAttr = attr.node as BabelTypes.JSXAttribute;

      if (jsxAttr.name.type === 'JSXIdentifier' && jsxAttr.name.name === 'i18nKey') {
        // copy the i18nKey
        mem.attributesToCopy?.push(jsxAttr);
      } else if (jsxAttr.name.type === 'JSXIdentifier' && jsxAttr.name.name === 'switch') {
        // take the switch for select element
        let exprName =
          jsxAttr.value?.type === 'JSXExpressionContainer' &&
          jsxAttr.value.expression.type === 'Identifier'
            ? jsxAttr.value.expression.name
            : undefined;
        if (!exprName) {
          exprName = 'selectKey';
          if (jsxAttr.value?.type === 'JSXExpressionContainer') {
            mem.values.unshift(
              t.objectProperty(
                t.identifier(exprName),
                jsxAttr.value.expression as BabelTypes.Expression,
              ),
            );
          }
        } else {
          mem.values.unshift(toObjectProperty(exprName));
        }
        mem.defaults = `{${exprName}, select, ${mem.defaults}`;
      } else if (jsxAttr.name.type === 'JSXIdentifier' && jsxAttr.name.name === 'values') {
        // skip the values attribute, as it has already been processed into mem as existingValues
      } else if (jsxAttr.value?.type === 'StringLiteral') {
        // take any string node as select option
        const selectOption = jsxAttr.name.type === 'JSXIdentifier' ? jsxAttr.name.name : '';
        mem.defaults = `${mem.defaults} ${selectOption} {${jsxAttr.value.value}}`;
      } else if (jsxAttr.value?.type === 'JSXExpressionContainer') {
        // convert any Trans component to select option extracting any values and components
        const children = getChildrenFromJSXExpression(jsxAttr.value);
        const thisTrans = processTrans(children, babel, componentStartIndex);

        const selectOption = jsxAttr.name.type === 'JSXIdentifier' ? jsxAttr.name.name : '';
        mem.defaults = `${mem.defaults} ${selectOption} {${thisTrans.defaults}}`;
        mem.components = mem.components.concat(thisTrans.components);

        componentStartIndex += thisTrans.components.length;
      }
      return mem;
    },
    {
      attributesToCopy: [],
      values: existingValues as BabelTypes.ObjectProperty[],
      components: [],
      defaults: '',
    },
  );

  // replace the node with the new Trans
  parentPath.replaceWith(buildTransElement(extracted, extracted.attributesToCopy || [], t, true));
}
