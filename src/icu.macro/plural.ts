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

export function pluralAsJSX(
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

  // plural or selectordinal
  const nodeName =
    parentPath.node.name.type === 'JSXIdentifier'
      ? parentPath.node.name.name.toLocaleLowerCase()
      : 'plural';

  // will need to merge count attribute with existing values attribute in some cases
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
      } else if (jsxAttr.name.type === 'JSXIdentifier' && jsxAttr.name.name === 'count') {
        // take the count for element
        let exprName =
          jsxAttr.value?.type === 'JSXExpressionContainer' &&
          jsxAttr.value.expression.type === 'Identifier'
            ? jsxAttr.value.expression.name
            : undefined;
        if (!exprName) {
          exprName = 'count';
        }
        if (exprName === 'count') {
          // if the prop expression name is also "count", copy it instead: <Plural count={count} --> <Trans count={count}
          mem.attributesToCopy?.push(jsxAttr);
        } else {
          mem.values.unshift(toObjectProperty(exprName));
        }
        mem.defaults = `{${exprName}, ${nodeName}, ${mem.defaults}`;
      } else if (jsxAttr.name.type === 'JSXIdentifier' && jsxAttr.name.name === 'values') {
        // skip the values attribute, as it has already been processed into mem from existingValues
      } else if (jsxAttr.value?.type === 'StringLiteral') {
        // take any string node as plural option
        let pluralForm = jsxAttr.name.type === 'JSXIdentifier' ? jsxAttr.name.name : '';
        if (pluralForm.indexOf('$') === 0) pluralForm = pluralForm.replace('$', '=');
        mem.defaults = `${mem.defaults} ${pluralForm} {${jsxAttr.value.value}}`;
      } else if (jsxAttr.value?.type === 'JSXExpressionContainer') {
        // convert any Trans component to plural option extracting any values and components
        const children = getChildrenFromJSXExpression(jsxAttr.value);
        const thisTrans = processTrans(children, babel, componentStartIndex);

        let pluralForm = jsxAttr.name.type === 'JSXIdentifier' ? jsxAttr.name.name : '';
        if (pluralForm.indexOf('$') === 0) pluralForm = pluralForm.replace('$', '=');

        mem.defaults = `${mem.defaults} ${pluralForm} {${thisTrans.defaults}}`;
        mem.components = mem.components.concat(thisTrans.components);

        componentStartIndex = thisTrans.finalComponentIndex;
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
