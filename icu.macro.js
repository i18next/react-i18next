const { createMacro } = require('babel-plugin-macros');

// copy to:
// https://astexplorer.net/#/gist/642aebbb9e449e959f4ad8907b4adf3a/4a65742e2a3e926eb55eaa3d657d1472b9ac7970
module.exports = createMacro(ICUMacro);

function ICUMacro({ references, state, babel }) {
  const { Trans = [], Plural = [], Select = [], SelectOrdinal = [] } = references;

  // assert we have the react-i18next Trans component imported
  addNeededImports(state, babel);

  // transform Plural and SelectOrdinal
  [...Plural, ...SelectOrdinal].forEach((referencePath) => {
    if (referencePath.parentPath.type === 'JSXOpeningElement') {
      pluralAsJSX(
        referencePath.parentPath,
        {
          attributes: referencePath.parentPath.get('attributes'),
          children: referencePath.parentPath.parentPath.get('children'),
        },
        babel,
      );
    } else {
      // throw a helpful error message or something :)
    }
  });

  // transform Select
  Select.forEach((referencePath) => {
    if (referencePath.parentPath.type === 'JSXOpeningElement') {
      selectAsJSX(
        referencePath.parentPath,
        {
          attributes: referencePath.parentPath.get('attributes'),
          children: referencePath.parentPath.parentPath.get('children'),
        },
        babel,
      );
    } else {
      // throw a helpful error message or something :)
    }
  });

  // transform Trans
  Trans.forEach((referencePath) => {
    if (referencePath.parentPath.type === 'JSXOpeningElement') {
      transAsJSX(
        referencePath.parentPath,
        {
          attributes: referencePath.parentPath.get('attributes'),
          children: referencePath.parentPath.parentPath.get('children'),
        },
        babel,
        state,
      );
    } else {
      // throw a helpful error message or something :)
    }
  });
}

function pluralAsJSX(parentPath, { attributes }, babel) {
  const t = babel.types;
  const toObjectProperty = (name, value) =>
    t.objectProperty(t.identifier(name), t.identifier(name), false, !value);

  // plural or selectordinal
  const nodeName = parentPath.node.name.name.toLocaleLowerCase();

  // will need to merge count attribute with existing values attribute in some cases
  const existingValuesAttribute = findAttribute('values', attributes);
  const existingValues = existingValuesAttribute
    ? existingValuesAttribute.node.value.expression.properties
    : [];

  let componentStartIndex = 0;
  const extracted = attributes.reduce(
    (mem, attr) => {
      if (attr.node.name.name === 'i18nKey') {
        // copy the i18nKey
        mem.attributesToCopy.push(attr.node);
      } else if (attr.node.name.name === 'count') {
        // take the count for element
        let exprName = attr.node.value.expression.name;
        if (!exprName) {
          exprName = 'count';
        }
        if (exprName === 'count') {
          // if the prop expression name is also "count", copy it instead: <Plural count={count} --> <Trans count={count}
          mem.attributesToCopy.push(attr.node);
        } else {
          mem.values.unshift(toObjectProperty(exprName));
        }
        mem.defaults = `{${exprName}, ${nodeName}, ${mem.defaults}`;
      } else if (attr.node.name.name === 'values') {
        // skip the values attribute, as it has already been processed into mem from existingValues
      } else if (attr.node.value.type === 'StringLiteral') {
        // take any string node as plural option
        let pluralForm = attr.node.name.name;
        if (pluralForm.indexOf('$') === 0) pluralForm = pluralForm.replace('$', '=');
        mem.defaults = `${mem.defaults} ${pluralForm} {${attr.node.value.value}}`;
      } else if (attr.node.value.type === 'JSXExpressionContainer') {
        // convert any Trans component to plural option extracting any values and components
        const children = attr.node.value.expression.children || [];
        const thisTrans = processTrans(children, babel, componentStartIndex);

        let pluralForm = attr.node.name.name;
        if (pluralForm.indexOf('$') === 0) pluralForm = pluralForm.replace('$', '=');

        mem.defaults = `${mem.defaults} ${pluralForm} {${thisTrans.defaults}}`;
        mem.components = mem.components.concat(thisTrans.components);

        componentStartIndex += thisTrans.components.length;
      }
      return mem;
    },
    { attributesToCopy: [], values: existingValues, components: [], defaults: '' },
  );

  // replace the node with the new Trans
  parentPath.replaceWith(buildTransElement(extracted, extracted.attributesToCopy, t, true));
}

function selectAsJSX(parentPath, { attributes }, babel) {
  const t = babel.types;
  const toObjectProperty = (name, value) =>
    t.objectProperty(t.identifier(name), t.identifier(name), false, !value);

  // will need to merge switch attribute with existing values attribute
  const existingValuesAttribute = findAttribute('values', attributes);
  const existingValues = existingValuesAttribute
    ? existingValuesAttribute.node.value.expression.properties
    : [];

  let componentStartIndex = 0;

  const extracted = attributes.reduce(
    (mem, attr) => {
      if (attr.node.name.name === 'i18nKey') {
        // copy the i18nKey
        mem.attributesToCopy.push(attr.node);
      } else if (attr.node.name.name === 'switch') {
        // take the switch for select element
        let exprName = attr.node.value.expression.name;
        if (!exprName) {
          exprName = 'selectKey';
          mem.values.unshift(t.objectProperty(t.identifier(exprName), attr.node.value.expression));
        } else {
          mem.values.unshift(toObjectProperty(exprName));
        }
        mem.defaults = `{${exprName}, select, ${mem.defaults}`;
      } else if (attr.node.name.name === 'values') {
        // skip the values attribute, as it has already been processed into mem as existingValues
      } else if (attr.node.value.type === 'StringLiteral') {
        // take any string node as select option
        mem.defaults = `${mem.defaults} ${attr.node.name.name} {${attr.node.value.value}}`;
      } else if (attr.node.value.type === 'JSXExpressionContainer') {
        // convert any Trans component to select option extracting any values and components
        const children = attr.node.value.expression.children || [];
        const thisTrans = processTrans(children, babel, componentStartIndex);

        mem.defaults = `${mem.defaults} ${attr.node.name.name} {${thisTrans.defaults}}`;
        mem.components = mem.components.concat(thisTrans.components);

        componentStartIndex += thisTrans.components.length;
      }
      return mem;
    },
    { attributesToCopy: [], values: existingValues, components: [], defaults: '' },
  );

  // replace the node with the new Trans
  parentPath.replaceWith(buildTransElement(extracted, extracted.attributesToCopy, t, true));
}

function transAsJSX(parentPath, { attributes, children }, babel, { filename }) {
  const defaultsAttr = findAttribute('defaults', attributes);
  const componentsAttr = findAttribute('components', attributes);
  // if there is "defaults" attribute and no "components" attribute, parse defaults and extract from the parsed defaults instead of children
  // if a "components" attribute has been provided, we assume they have already constructed a valid "defaults" and it does not need to be parsed
  const parseDefaults = defaultsAttr && !componentsAttr;

  let extracted;
  if (parseDefaults) {
    const defaultsExpression = defaultsAttr.node.value.value;
    const parsed = babel.parse(`<>${defaultsExpression}</>`, {
      presets: ['@babel/react'],
      filename,
    }).program.body[0].expression.children;

    extracted = processTrans(parsed, babel);
  } else {
    extracted = processTrans(children, babel);
  }

  let clonedAttributes = cloneExistingAttributes(attributes);
  if (parseDefaults) {
    // remove existing defaults so it can be replaced later with the new parsed defaults
    clonedAttributes = clonedAttributes.filter((node) => node.name.name !== 'defaults');
  }

  // replace the node with the new Trans
  const replacePath = children.length ? children[0].parentPath : parentPath;
  replacePath.replaceWith(
    buildTransElement(extracted, clonedAttributes, babel.types, false, !!children.length),
  );
}

function buildTransElement(
  extracted,
  finalAttributes,
  t,
  closeDefaults = false,
  wasElementWithChildren = false,
) {
  const nodeName = t.jSXIdentifier('Trans');

  // plural, select open { but do not close it while reduce
  if (closeDefaults) extracted.defaults += '}';

  // convert arrays into needed expressions
  extracted.components = t.arrayExpression(extracted.components);
  extracted.values = t.objectExpression(extracted.values);

  // add generated Trans attributes
  if (!attributeExistsAlready('defaults', finalAttributes))
    finalAttributes.push(
      t.jSXAttribute(t.jSXIdentifier('defaults'), t.StringLiteral(extracted.defaults)),
    );
  if (!attributeExistsAlready('components', finalAttributes))
    finalAttributes.push(
      t.jSXAttribute(t.jSXIdentifier('components'), t.jSXExpressionContainer(extracted.components)),
    );
  if (!attributeExistsAlready('values', finalAttributes))
    finalAttributes.push(
      t.jSXAttribute(t.jSXIdentifier('values'), t.jSXExpressionContainer(extracted.values)),
    );

  // create selfclosing Trans component
  const openElement = t.jSXOpeningElement(nodeName, finalAttributes, true);
  if (!wasElementWithChildren) return openElement;

  return t.jSXElement(openElement, null, [], true);
}

function cloneExistingAttributes(attributes) {
  return attributes.reduce((mem, attr) => {
    mem.push(attr.node);
    return mem;
  }, []);
}

function findAttribute(name, attributes) {
  return attributes.find((child) => {
    const ele = child.node ? child.node : child;
    return ele.name.name === name;
  });
}

function attributeExistsAlready(name, attributes) {
  return !!findAttribute(name, attributes);
}

function processTrans(children, babel, componentStartIndex = 0) {
  const res = {};

  res.defaults = mergeChildren(children, babel, componentStartIndex);
  res.components = getComponents(children, babel);
  res.values = getValues(children, babel);

  return res;
}

// eslint-disable-next-line no-control-regex
const leadingNewLineAndWhitespace = new RegExp('^\n\\s+', 'g');
// eslint-disable-next-line no-control-regex
const trailingNewLineAndWhitespace = new RegExp('\n\\s+$', 'g');
function trimIndent(text) {
  const newText = text
    .replace(leadingNewLineAndWhitespace, '')
    .replace(trailingNewLineAndWhitespace, '');
  return newText;
}

function mergeChildren(children, babel, componentStartIndex = 0) {
  const t = babel.types;
  let componentFoundIndex = componentStartIndex;

  return children.reduce((mem, child) => {
    const ele = child.node ? child.node : child;

    // add text, but trim indentation whitespace
    if (t.isJSXText(ele) && ele.value) mem += trimIndent(ele.value);
    // add ?!? forgot
    if (ele.expression && ele.expression.value) mem += ele.expression.value;
    // add `{ val }`
    if (ele.expression && ele.expression.name) mem += `{${ele.expression.name}}`;
    // add `{ val, number }`
    if (ele.expression && ele.expression.expressions) {
      mem += `{${ele.expression.expressions
        .reduce((m, i) => {
          m.push(i.name || i.value);
          return m;
        }, [])
        .join(', ')}}`;
    }
    // this is for supporting complex icu type interpolations
    // date`${variable}` and number`{${varName}, ::percent}`
    // also, plural`{${count}, one { ... } other { ... }}
    if (t.isTaggedTemplateExpression(ele.expression)) {
      const [, text, index] = getTextAndInterpolatedVariables(
        ele.expression.tag.name,
        ele.expression,
        componentFoundIndex,
        babel,
      );
      mem += text;
      componentFoundIndex = index;
    }
    // add <strong>...</strong> with replace to <0>inner string</0>
    if (t.isJSXElement(ele)) {
      mem += `<${componentFoundIndex}>${mergeChildren(
        ele.children,
        babel,
      )}</${componentFoundIndex}>`;
      componentFoundIndex++;
    }

    return mem;
  }, '');
}

/**
 * Extract the names of interpolated value as object properties to pass to Trans
 */
function getValues(children, babel) {
  const t = babel.types;
  const toObjectProperty = (name, value) =>
    t.objectProperty(t.identifier(name), t.identifier(name), false, !value);

  return children.reduce((mem, child) => {
    const ele = child.node ? child.node : child;

    // add `{ var }` to values
    if (ele.expression && ele.expression.name) mem.push(toObjectProperty(ele.expression.name));
    // add `{ var, number }` to values
    if (ele.expression && ele.expression.expressions)
      mem.push(
        toObjectProperty(ele.expression.expressions[0].name || ele.expression.expressions[0].value),
      );
    // add `{ var: 'bar' }` to values
    if (ele.expression && ele.expression.properties) mem = mem.concat(ele.expression.properties);
    // date`${variable}` and so on
    if (ele.expression && ele.expression.type === 'TaggedTemplateExpression') {
      const [variables] = getTextAndInterpolatedVariables(
        ele.expression.tag.name,
        ele.expression,
        0,
        babel,
      );
      mem = mem.concat(variables.map((vari) => toObjectProperty(vari)));
    }
    // recursive add inner elements stuff to values
    if (t.isJSXElement(ele)) {
      mem = mem.concat(getValues(ele.children, babel));
    }

    return mem;
  }, []);
}

/**
 * Extract the React components to pass to Trans as components
 */
function getComponents(children, babel) {
  const t = babel.types;

  return children.reduce((mem, child) => {
    const ele = child.node ? child.node : child;

    const processJSXElement = (jsxElement) => {
      const clone = t.clone(jsxElement);
      clone.children = clone.children.reduce((clonedMem, clonedChild) => {
        const clonedEle = clonedChild.node ? clonedChild.node : clonedChild;

        // clean out invalid definitions by replacing `{ catchDate, date, short }` with `{ catchDate }`
        if (clonedEle.expression && clonedEle.expression.expressions)
          clonedEle.expression.expressions = [clonedEle.expression.expressions[0]];

        clonedMem.push(clonedChild);
        return clonedMem;
      }, []);

      mem.push(jsxElement);
    };

    if (t.isJSXExpressionContainer(ele)) {
      // check for date`` and so on
      if (t.isTaggedTemplateExpression(ele.expression)) {
        ele.expression.quasi.expressions.forEach((expr) => {
          // check for sub-expressions. This can happen with plural`` or select`` or selectOrdinal``
          // these can have nested components
          if (t.isTaggedTemplateExpression(expr) && expr.quasi.expressions.length) {
            mem.push(...getComponents(expr.quasi.expressions, babel));
          }
          if (!t.isJSXElement(expr)) {
            // ignore anything that is not a component
            return;
          }
          processJSXElement(expr);
        });
      }
    }
    if (t.isJSXElement(ele)) {
      processJSXElement(ele);
    }

    return mem;
  }, []);
}

/**
 * Add `import { Trans } from "react-i18next" as needed
 */
function addNeededImports(state, babel) {
  const t = babel.types;
  const importsToAdd = ['Trans'];

  // check if there is an existing react-i18next import
  const existingImport = state.file.path.node.body.find(
    (importNode) =>
      t.isImportDeclaration(importNode) && importNode.source.value === 'react-i18next',
  );

  // append Trans to existing or add a new react-i18next import for the Trans
  if (existingImport) {
    importsToAdd.forEach((name) => {
      if (
        existingImport.specifiers.findIndex(
          (specifier) => specifier.imported && specifier.imported.name === name,
        ) === -1
      ) {
        existingImport.specifiers.push(t.importSpecifier(t.identifier(name), t.identifier(name)));
      }
    });
  } else {
    state.file.path.node.body.unshift(
      t.importDeclaration(
        importsToAdd.map((name) => t.importSpecifier(t.identifier(name), t.identifier(name))),
        t.stringLiteral('react-i18next'),
      ),
    );
  }
}

/**
 * Retrieve the new text to use, and any interpolated variables
 *
 * This is used to process tagged template literals like date`${variable}` and number`${num}, ::percent`
 *
 * for the data example, it will return text of `{variable, date}` with a variable of `variable`
 * for the number example, it will return text of `{num, number, ::percent}` with a variable of `num`
 * @param {string} type the name of the tagged template (`date`, `number`, `plural`, etc. - any valid complex ICU type)
 * @param {TaggedTemplateExpression} primaryNode the template expression node
 * @param {int} index starting index number of components to be used for interpolations like <0>
 * @param {*} babel
 */
function getTextAndInterpolatedVariables(type, primaryNode, index, babel) {
  let componentFoundIndex = index;
  // this will contain all the nodes to convert to the ICU messageformat text
  // at first they are unsorted, but will be ordered correctly at the end of the function
  const text = [];
  // the variable names. These are converted to object references as required for the Trans values
  // in getValues() (toObjectProperty helper function)
  const variable = [];
  primaryNode.quasi.expressions.forEach((varNode) => {
    text.push(varNode);
    if (varNode.type === 'JSXElement') {
      // extract inner interpolated variables and add to the list
      variable.push(...getValues(varNode.children, babel).map((value) => value.value.name));
      return;
    }
    if (varNode.type === 'Identifier') {
      // the name of the interpolated variable
      variable.push(varNode.name);
    }
  });
  primaryNode.quasi.quasis.forEach((quasiNode) => {
    // these are the text surrounding the variable interpolation
    // so in date`${varname}, short` it would be `''` and `, short`.
    // (the empty string before `${varname}` and the stuff after it)
    text.push(quasiNode);
  });
  return [
    variable,
    `{${text
      .filter((node) => {
        if (node.type === 'Identifier') {
          // if the node has a name, keep it
          return node.name;
        }
        if (node.type === 'JSXElement' || node.type === 'TaggedTemplateExpression') {
          // always keep interpolated elements or other tagged template literals like a nested date`` inside a plural``
          return true;
        }
        if (node.type === 'TemplateElement') {
          // return the "cooked" (escaped) text for the text in the template literal (`, ::percent` in number`${varname}, ::percent`)
          return node.value.cooked;
        }
        // unknown node type, ignore
        return false;
      })
      // sort by the order they appear in the source code
      .sort((a, b) => {
        if (a.start > b.start) return 1;
        if (b.start < a.start) return -1;
      })
      .map((node) => {
        if (node.type === 'JSXElement') {
          // perform the interpolation of components just as we do in a normal Trans setting
          const subText = `<${componentFoundIndex}>${mergeChildren(
            node.children,
            babel,
          )}</${componentFoundIndex}>`;
          componentFoundIndex++;
          return subText;
        }
        if (node.type === 'TaggedTemplateExpression') {
          // a nested date``/number``/plural`` etc., extract whatever is inside of it
          const [variables, childText, newIndex] = getTextAndInterpolatedVariables(
            node.tag.name,
            node,
            componentFoundIndex,
            babel,
          );
          variable.push(...variables);
          componentFoundIndex = newIndex;
          return childText;
        }
        if (node.type === 'Identifier') {
          // turn date`${thing}` into `thing, date`
          return `${node.name}, ${type}`;
        }
        if (node.type === 'TemplateElement') {
          // convert all whitespace into a single space for the text in the tagged template literal
          return node.value.cooked.replace(/\s+/g, ' ');
        }
      })
      .join('')}}`,
    // return the new component interpolation index
    componentFoundIndex,
  ];
}
