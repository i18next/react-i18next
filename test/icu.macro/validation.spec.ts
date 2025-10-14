import { describe, it, expect } from 'vitest';
import * as BabelTypes from '@babel/types';
import * as Babel from '@babel/core';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { validateTaggedTemplatesInsideTrans } from '../../src/icu.macro/utils/validation';

describe('validateTaggedTemplatesInsideTrans', () => {
  it('should not throw when tagged template is inside Trans', () => {
    const code = `
      <Trans>
        {date\`\${now}\`}
      </Trans>
    `;

    const ast = parse(code, { plugins: ['jsx'] });
    const nodePaths: any[] = [];

    traverse(ast, {
      TaggedTemplateExpression(path) {
        nodePaths.push(path);
      },
    });

    expect(() => {
      validateTaggedTemplatesInsideTrans({ date: nodePaths }, Babel);
    }).not.toThrow();
  });

  it('should throw when tagged template is outside Trans', () => {
    const code = `
      const x = date\`\${now}\`;
    `;

    const ast = parse(code, { plugins: ['jsx'], sourceFilename: 'test.js' });
    const nodePaths: any[] = [];

    traverse(ast, {
      TaggedTemplateExpression(path) {
        nodePaths.push(path);
      },
    });

    expect(() => {
      validateTaggedTemplatesInsideTrans({ date: nodePaths }, Babel);
    }).toThrow(/"date``" can only be used inside <Trans>/);
  });

  it('should handle multiple tagged templates', () => {
    const code = `
      const a = date\`\${d1}\`;
      const b = number\`\${n1}\`;
    `;

    const ast = parse(code, { plugins: ['jsx'], sourceFilename: 'test.js' });
    const dateNodes: any[] = [];
    const numberNodes: any[] = [];

    traverse(ast, {
      TaggedTemplateExpression(path) {
        if (path.node.tag.type === 'Identifier') {
          if (path.node.tag.name === 'date') dateNodes.push(path);
          if (path.node.tag.name === 'number') numberNodes.push(path);
        }
      },
    });

    expect(() => {
      validateTaggedTemplatesInsideTrans({ date: dateNodes, number: numberNodes }, Babel);
    }).toThrow();
  });
});
