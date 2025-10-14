import type * as BabelTypes from '@babel/types';
import type { ExtractedTransData, ProcessedTransResult } from './types';
import { attributeExistsAlready } from './find-attribute';

/**
 * Build a Trans JSX element from extracted data
 */
export function buildTransElement(
  extracted: ExtractedTransData | ProcessedTransResult,
  finalAttributes: BabelTypes.JSXAttribute[],
  t: typeof BabelTypes,
  closeDefaults = false,
  wasElementWithChildren = false,
): BabelTypes.JSXOpeningElement | BabelTypes.JSXElement {
  const nodeName = t.jSXIdentifier('Trans');

  // plural, select open { but do not close it while reduce
  if (closeDefaults) extracted.defaults += '}';

  // convert arrays into needed expressions
  const componentsExpr = t.arrayExpression(extracted.components);
  const valuesExpr = t.objectExpression(extracted.values);

  // add generated Trans attributes
  if (!attributeExistsAlready('defaults', finalAttributes)) {
    addDefaultsAttribute(extracted.defaults, finalAttributes, t);
  }

  if (!attributeExistsAlready('components', finalAttributes)) {
    finalAttributes.push(
      t.jSXAttribute(t.jSXIdentifier('components'), t.jSXExpressionContainer(componentsExpr)),
    );
  }

  if (!attributeExistsAlready('values', finalAttributes)) {
    finalAttributes.push(
      t.jSXAttribute(t.jSXIdentifier('values'), t.jSXExpressionContainer(valuesExpr)),
    );
  }

  // create selfclosing Trans component
  const openElement = t.jSXOpeningElement(nodeName, finalAttributes, true);
  if (!wasElementWithChildren) return openElement;

  return t.jSXElement(openElement, null, [], true);
}

/**
 * Add defaults attribute, handling double quotes properly
 */
function addDefaultsAttribute(
  defaults: string,
  attributes: BabelTypes.JSXAttribute[],
  t: typeof BabelTypes,
): void {
  if (defaults.includes(`"`)) {
    // wrap defaults that contain double quotes in brackets
    attributes.push(
      t.jSXAttribute(
        t.jSXIdentifier('defaults'),
        t.jSXExpressionContainer(t.stringLiteral(defaults)),
      ),
    );
  } else {
    attributes.push(t.jSXAttribute(t.jSXIdentifier('defaults'), t.stringLiteral(defaults)));
  }
}
