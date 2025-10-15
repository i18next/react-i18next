import { describe, it, expect } from 'vitest';
import * as BabelTypes from '@babel/types';
import {
  validateTaggedTemplateType,
  validateQuasiNodesHaveInterpolation,
} from '../../src/icu.macro/utils/validate-tagged-template';

describe('validateTaggedTemplateType', () => {
  const createTemplate = (tagName: string) =>
    BabelTypes.taggedTemplateExpression(
      BabelTypes.identifier(tagName),
      BabelTypes.templateLiteral(
        [
          BabelTypes.templateElement({ raw: '', cooked: '' }, false),
          BabelTypes.templateElement({ raw: '', cooked: '' }, true),
        ],
        [BabelTypes.identifier('x')],
      ),
    );

  it('should not throw for valid ICU interpolator types', () => {
    const validTypes = ['date', 'time', 'number', 'plural', 'select', 'selectOrdinal'];

    for (const type of validTypes) {
      const template = createTemplate(type);
      expect(() => validateTaggedTemplateType(type, template)).not.toThrow();
    }
  });

  it('should throw for invalid type', () => {
    const template = createTemplate('invalid');
    expect(() => validateTaggedTemplateType('invalid', template)).toThrow(
      /Unsupported tagged template literal "invalid"/,
    );
  });

  it('should include valid types in error message', () => {
    const template = createTemplate('bad');
    expect(() => validateTaggedTemplateType('bad', template)).toThrow(
      /must be one of date, time, number, plural, select, selectOrdinal/,
    );
  });
});

describe('validateQuasiNodesHaveInterpolation', () => {
  it('should throw if no interpolation', () => {
    const template = BabelTypes.taggedTemplateExpression(
      BabelTypes.identifier('date'),
      BabelTypes.templateLiteral(
        [BabelTypes.templateElement({ raw: 'no vars', cooked: 'no vars' }, true)],
        [],
      ),
    );

    expect(() => validateQuasiNodesHaveInterpolation(template)).toThrow(
      /date argument must be interpolated in "date``"/,
    );
  });

  it('should throw if interpolation is not at the beginning', () => {
    const template = BabelTypes.taggedTemplateExpression(
      BabelTypes.identifier('date'),
      BabelTypes.templateLiteral(
        [
          BabelTypes.templateElement({ raw: 'prefix', cooked: 'prefix' }, false),
          BabelTypes.templateElement({ raw: '', cooked: '' }, true),
        ],
        [BabelTypes.identifier('x')],
      ),
    );

    expect(() => validateQuasiNodesHaveInterpolation(template)).toThrow(
      /date argument must be interpolated at the beginning of "date``"/,
    );
  });

  it('should not throw for valid interpolation at beginning', () => {
    const template = BabelTypes.taggedTemplateExpression(
      BabelTypes.identifier('date'),
      BabelTypes.templateLiteral(
        [
          BabelTypes.templateElement({ raw: '', cooked: '' }, false),
          BabelTypes.templateElement({ raw: ', short', cooked: ', short' }, true),
        ],
        [BabelTypes.identifier('x')],
      ),
    );

    expect(() => validateQuasiNodesHaveInterpolation(template)).not.toThrow();
  });
});
