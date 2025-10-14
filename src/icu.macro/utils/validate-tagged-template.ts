import type * as BabelTypes from '@babel/types';

const ICU_INTERPOLATORS = ['date', 'time', 'number', 'plural', 'select', 'selectOrdinal'];

/**
 * Validate that the tagged template type is one of the allowed ICU interpolators
 */
export function validateTaggedTemplateType(
  type: string,
  primaryNode: BabelTypes.TaggedTemplateExpression,
): void {
  if (!ICU_INTERPOLATORS.includes(type)) {
    throw new Error(
      `Unsupported tagged template literal "${type}", must be one of ${ICU_INTERPOLATORS.join(', ')} in "${primaryNode.loc?.filename}" on line ${primaryNode.loc?.start.line}`,
    );
  }
}

/**
 * Validate that the tagged template has interpolation in the correct position
 */
export function validateQuasiNodesHaveInterpolation(
  primaryNode: BabelTypes.TaggedTemplateExpression,
): void {
  const noInterpolationError = !primaryNode.quasi.expressions.length;
  const wrongOrderError = primaryNode.quasi.quasis[0].value.raw.length;
  const tagName = primaryNode.tag.type === 'Identifier' ? primaryNode.tag.name : 'unknown';

  if (noInterpolationError || wrongOrderError) {
    const issue = noInterpolationError ? 'in' : 'at the beginning of';
    throw new Error(
      `${tagName} argument must be interpolated ${issue} "${tagName}\`\`" in "${primaryNode.loc?.filename}" on line ${primaryNode.loc?.start.line}`,
    );
  }
}
