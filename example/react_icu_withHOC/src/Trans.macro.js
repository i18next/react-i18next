const {createMacro} = require('babel-plugin-macros')


module.exports = createMacro(myMacro);

function myMacro({ references, state, babel }) {
  const t = babel.types;
  const { Trans = [], Plural = [], Select=[], default: defaultImport = [] } = references;

  // assert we have the react-i18next Trans component imported
  transformImports(state, babel);

  // transform Plural
  Plural.forEach(referencePath => {
    if (referencePath.parentPath.type === "JSXOpeningElement") {
      console.log("jsx props", {
        attributes: referencePath.parentPath.get("attributes"),
        children: referencePath.parentPath.parentPath.get("children")
      });
      pluralAsJSX(
        referencePath.parentPath,
        {
          attributes: referencePath.parentPath.get('attributes'),
          children: referencePath.parentPath.parentPath.get('children'),
        },
        state,
        babel
      )
    } else {
      // throw a helpful error message or something :)
    }
  });

    // transform Select
    Select.forEach(referencePath => {
      if (referencePath.parentPath.type === "JSXOpeningElement") {
        console.log("jsx props", {
          attributes: referencePath.parentPath.get("attributes"),
          children: referencePath.parentPath.parentPath.get("children")
        });
        selectAsJSX(
          referencePath.parentPath,
          {
            attributes: referencePath.parentPath.get('attributes'),
            children: referencePath.parentPath.parentPath.get('children'),
          },
          state,
          babel
        )
      } else {
        // throw a helpful error message or something :)
      }
    });

  // transform Trans
  Trans.forEach(referencePath => {
    if (referencePath.parentPath.type === "JSXOpeningElement") {
      console.log("jsx props", {
        attributes: referencePath.parentPath.get("attributes"),
        children: referencePath.parentPath.parentPath.get("children")
      });
      transAsJSX(
        {
          attributes: referencePath.parentPath.get('attributes'),
          children: referencePath.parentPath.parentPath.get('children'),
        },
        state,
        babel
      )
    } else {
      // throw a helpful error message or something :)
    }
  });
}

function pluralAsJSX(parentPath, {attributes, children}, state, babel) {
  const t = babel.types;
  const toObjectProperty = (name, value) => t.objectProperty(t.identifier(name), t.identifier(name), false, !value)

  // It's a shame you cannot use evaluate() with JSX
  //const value = children[0].node.value
  const selfClosing = true;


  const nodeName = t.jSXIdentifier('Trans');
  let componentStartIndex = 0;

  const extracted = attributes.reduce((mem, attr) => {
    if (attr.node.name.name === 'i18nKey') {
      mem.attributesToCopy.push(attr.node);
    } else if (attr.node.name.name === 'count') {
      mem.values.push(toObjectProperty(attr.node.value.expression.name));
      mem.defaults = `{${attr.node.value.expression.name}, plural, ${mem.defaults}`;
    } else if (attr.node.value.type === 'StringLiteral') {
      let pluralForm = attr.node.name.name;
      if (pluralForm.indexOf('$') === 0) pluralForm = pluralForm.replace('$', '=');
      mem.defaults = `${mem.defaults} ${pluralForm} {${attr.node.value.value}}`;
    } else if (attr.node.value.type === 'JSXExpressionContainer') {
      const children = attr.node.value.expression.children;
      const thisTrans = processTrans(children, babel, componentStartIndex);

      let pluralForm = attr.node.name.name;
      if (pluralForm.indexOf('$') === 0) pluralForm = pluralForm.replace('$', '=');

      mem.defaults = `${mem.defaults} ${pluralForm} {${thisTrans.defaults}}`;
      mem.components = mem.components.concat(thisTrans.components);
      mem.values = mem.values.concat(thisTrans.values);

	  componentStartIndex = componentStartIndex + thisTrans.components.length;
    }
    return mem;
  }, { attributesToCopy: [], values: [], components: [], defaults: ''});
  extracted.defaults += '}';
  extracted.components = t.arrayExpression(extracted.components);
  extracted.values = t.objectExpression(extracted.values);
  const finalAttributes = extracted.attributesToCopy;


  finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('defaults'), t.StringLiteral(extracted.defaults)));
  finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('components'), t.jSXExpressionContainer(extracted.components)));
  finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('values'), t.jSXExpressionContainer(extracted.values)));


  const openElement = t.jSXOpeningElement(nodeName, finalAttributes, selfClosing);
  //const closeElement = t.jSXClosingElement(nodeName);
  //const newNode = t.jSXElement(openElement, null, [], selfClosing)

  parentPath.replaceWith(openElement)
}

function selectAsJSX(parentPath, {attributes, children}, state, babel) {
  const t = babel.types;
  const toObjectProperty = (name, value) => t.objectProperty(t.identifier(name), t.identifier(name), false, !value)

  // It's a shame you cannot use evaluate() with JSX
  //const value = children[0].node.value
  const selfClosing = true;


  const nodeName = t.jSXIdentifier('Trans');
  let componentStartIndex = 0;

  const extracted = attributes.reduce((mem, attr) => {
    if (attr.node.name.name === 'i18nKey') {
      mem.attributesToCopy.push(attr.node);
    } else if (attr.node.name.name === 'switch') {
      mem.values.push(toObjectProperty(attr.node.value.expression.name));
      mem.defaults = `{${attr.node.value.expression.name}, select, ${mem.defaults}`;
    } else if (attr.node.value.type === 'StringLiteral') {
      mem.defaults = `${mem.defaults} ${attr.node.name.name} {${attr.node.value.value}}`;
    } else if (attr.node.value.type === 'JSXExpressionContainer') {
      const children = attr.node.value.expression.children;
      const thisTrans = processTrans(children, babel, componentStartIndex);

      mem.defaults = `${mem.defaults} ${attr.node.name.name} {${thisTrans.defaults}}`;
      mem.components = mem.components.concat(thisTrans.components);
      mem.values = mem.values.concat(thisTrans.values);

	  componentStartIndex = componentStartIndex + thisTrans.components.length;
    }
    return mem;
  }, { attributesToCopy: [], values: [], components: [], defaults: ''});
  extracted.defaults += '}';
  extracted.components = t.arrayExpression(extracted.components);
  extracted.values = t.objectExpression(extracted.values);
  const finalAttributes = extracted.attributesToCopy;


  finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('defaults'), t.StringLiteral(extracted.defaults)));
  finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('components'), t.jSXExpressionContainer(extracted.components)));
  finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('values'), t.jSXExpressionContainer(extracted.values)));


  const openElement = t.jSXOpeningElement(nodeName, finalAttributes, selfClosing);
  //const closeElement = t.jSXClosingElement(nodeName);
  //const newNode = t.jSXElement(openElement, null, [], selfClosing)

  parentPath.replaceWith(openElement)
}

function transAsJSX({attributes, children}, state, babel) {
  const t = babel.types;
  // It's a shame you cannot use evaluate() with JSX
  const value = children[0].node.value
  const selfClosing = true;


  const nodeName = t.jSXIdentifier('Trans');

  const extracted = processTrans(children, babel);
  extracted.values = t.objectExpression(extracted.values);
  extracted.components = t.arrayExpression(extracted.components);

  const finalAttributes = cloneExistingAttributes(attributes);



  // if (!attributeExistsAlready('foo', attributes)) finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('foo'), t.StringLiteral('bar')));
  if (!attributeExistsAlready('defaults', attributes)) finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('defaults'), t.StringLiteral(extracted.defaults)));
  if (!attributeExistsAlready('components', attributes)) finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('components'), t.jSXExpressionContainer(extracted.components)));
  if (!attributeExistsAlready('values', attributes)) finalAttributes.push(t.jSXAttribute(t.jSXIdentifier('values'), t.jSXExpressionContainer(extracted.values)));


  const openElement = t.jSXOpeningElement(nodeName, finalAttributes, selfClosing);
  const closeElement = t.jSXClosingElement(nodeName);
  const newNode = t.jSXElement(openElement, null, [], selfClosing)

  children[0].parentPath.replaceWith(newNode)
}

function cloneExistingAttributes(attributes) {
  return attributes.reduce((mem, attr) => {
    mem.push(attr.node);
    return mem;
  }, []);
}

function attributeExistsAlready(name, attributes) {
  const found = attributes.find(attr => {
    return attr.node.name.name === name;
  });
  return !!found;
}

function processTrans(children, babel, componentStartIndex = 0) {
  const res = {};
  res.defaults = mergeChildren(children, babel, componentStartIndex);
  res.components = getComponents(children, babel);
  res.values = getValues(children, babel);

  return res;
}

function mergeChildren(children, babel, componentStartIndex = 0) {
  const t = babel.types;
  let componentFoundIndex = componentStartIndex;
  return children.reduce((mem, child) => {
    const ele = child.node ? child.node : child;

    if (t.isJSXText(ele) && ele.value) mem += ele.value;
    if (ele.expression && ele.expression.value) mem += ele.expression.value;
    if (ele.expression && ele.expression.name) mem += `{${ele.expression.name}}`;
    if (ele.expression && ele.expression.expressions) {
      mem += `{${(ele.expression.expressions.reduce((m, i) => { m.push(i.name || i.value); return m }, [])).join(', ')}}`;
    }
    if (t.isJSXElement(ele)) {
      mem += `<${componentFoundIndex}>${mergeChildren(ele.children, babel)}</${componentFoundIndex}>`;
      componentFoundIndex++;
    }

    return mem;
  }, '');
}


function getValues(children, babel) {
  const t = babel.types;
  const toObjectProperty = (name, value) => t.objectProperty(t.identifier(name), t.identifier(name), false, !value)

  const nodes = children.reduce((mem, child) => {
    const ele = child.node ? child.node : child;

    if (ele.expression && ele.expression.name) mem.push(toObjectProperty(ele.expression.name));
    if (ele.expression && ele.expression.expressions) mem.push(toObjectProperty(ele.expression.expressions[0].name || ele.expression.expressions[0].value));
    if (ele.expression && ele.expression.properties) mem = mem.concat(ele.expression.properties);
    if (t.isJSXElement(ele)) {
      mem = mem.concat(getValues(ele.children, babel));
    }

    return mem;
  }, []);

  // t.objectExpression
  return nodes;
}

function getComponents(children, babel) {
  const t = babel.types;
  const nodes = children.reduce((mem, child) => {
    const ele = child.node ? child.node : child;

    if (t.isJSXElement(ele)) {
      const clone = t.clone(ele)
      clone.children = clone.children.reduce((mem, child) => {
        const ele = child.node ? child.node : child;

    	if (ele.expression && ele.expression.expressions) ele.expression.expressions = [ele.expression.expressions[0]]
      	mem.push(child);
      }, [])
      //if (clone.children
      mem.push(ele)
    }

    return mem;
  }, []);

  // t.arrayExpression(
  return nodes;
}

function transformImports(state, babel) {
  const t = babel.types;
  const importsToAdd = ['Trans'];

  // check if there is an existing react-i18next import
  const existingImport = state.file.path.node.body.find(
    importNode => t.isImportDeclaration(importNode) && importNode.source.value === "react-i18next"
  )

  // append Trans to existing or add a new react-i18next import for the Trans
  if (existingImport) {
    importsToAdd.forEach(name => {
      if (
        existingImport.specifiers.findIndex(
          specifier => specifier.imported && specifier.imported.name === name
        ) === -1
      ) {
        existingImport.specifiers.push(
          t.importSpecifier(t.identifier(name), t.identifier(name))
        )
      }
    })
  } else {
    state.file.path.node.body.unshift(
      t.importDeclaration(
        importsToAdd.map(name =>
          t.importSpecifier(t.identifier(name), t.identifier(name))
        ),
        t.stringLiteral("react/i18next")
      )
    )
  }
}