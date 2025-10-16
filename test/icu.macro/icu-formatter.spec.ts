import { describe, it, expect } from 'vitest';
import * as babel from '@babel/core';
import {
  mergeChildren,
  getTextAndInterpolatedVariables,
} from '../../src/icu.macro/utils/icu-formatter';

describe('mergeChildren', () => {
  it('should merge simple text and variables', () => {
    const code = `
      const x = <Trans>Hello {name}!</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result, finalIndex] = mergeChildren(children, babel);

    expect(result).toBe('Hello {name}!');
    expect(finalIndex).toBe(0);
  });

  it('should merge JSX elements with component indices', () => {
    const code = `
      const x = <Trans>Hello <strong>world</strong>!</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result, finalIndex] = mergeChildren(children, babel);

    expect(result).toBe('Hello <0>world</0>!');
    expect(finalIndex).toBe(1);
  });

  it('should handle nested JSX elements', () => {
    const code = `
      const x = <Trans>
        <div><strong>nested</strong></div>
      </Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result, finalIndex] = mergeChildren(children, babel);

    expect(result).toContain('<0>');
    expect(result).toContain('<0>nested</0>');
    expect(finalIndex).toBeGreaterThan(0);
  });

  it('should handle sequence expressions', () => {
    const code = `
      const x = <Trans>
        Price: {price, number}
      </Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    expect(result).toContain('{price, number}');
  });

  it('should handle numeric literals', () => {
    const code = `
      const x = <Trans>Count: {42}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    expect(result).toContain('42');
  });

  it('should handle string literals', () => {
    const code = `
      const x = <Trans>Text: {"literal"}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    expect(result).toContain('literal');
  });

  it('should use componentStartIndex parameter', () => {
    const code = `
      const x = <Trans><strong>text</strong></Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result, finalIndex] = mergeChildren(children, babel, 5);

    expect(result).toBe('<5>text</5>');
    expect(finalIndex).toBe(6);
  });

  it('should handle multiple JSX elements', () => {
    const code = `
      const x = <Trans>
        <strong>first</strong> and <em>second</em>
      </Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result, finalIndex] = mergeChildren(children, babel);

    expect(result).toContain('<0>first</0>');
    expect(result).toContain('<1>second</1>');
    expect(finalIndex).toBe(2);
  });

  it('should handle empty sequence expressions', () => {
    const code = `
      const x = <Trans>{}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    // Empty expression should result in empty string
    expect(result).toBe('');
  });

  it('should handle sequence expressions with mixed types', () => {
    const code = `
      const x = <Trans>{value, 'format'}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    expect(result).toContain('value');
    expect(result).toContain('format');
  });

  it('should handle tagged templates in expression containers', () => {
    const code = `
      const x = <Trans>Date: {date\`\${now}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    expect(result).toContain('{now, date}');
  });

  it('should handle identifiers in JSX expression containers', () => {
    const code = `
      const x = <Trans>Hello {name}!</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    expect(result).toBe('Hello {name}!');
  });

  it('should handle sequence expressions in JSX', () => {
    const code = `
      const x = <Trans>Price: {price, number, USD}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    expect(result).toBe('Price: {price, number, USD}');
  });

  it('should handle numeric literals in JSX', () => {
    const code = `
      const x = <Trans>Count: {42}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    expect(result).toBe('Count: 42');
  });

  it('should handle string literals in JSX', () => {
    const code = `
      const x = <Trans>Value: {"test"}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
    });

    let children: any[] = [];
    babel.traverse(ast!, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === 'JSXIdentifier' &&
          path.node.openingElement.name.name === 'Trans'
        ) {
          children = path.node.children;
        }
      },
    });

    const [result] = mergeChildren(children, babel);

    expect(result).toBe('Value: test');
  });
});

describe('getTextAndInterpolatedVariables', () => {
  it('should extract variables from tagged template', () => {
    const code = `
      const x = <Trans>{date\`\${now}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        template = path.node;
      },
    });

    expect(template).toBeTruthy();
    const [variables, formatted, finalIndex] = getTextAndInterpolatedVariables(
      'date',
      template,
      0,
      babel,
    );

    expect(variables).toContain('now');
    expect(formatted).toContain('now, date');
    expect(finalIndex).toBe(0);
  });

  it('should handle multiple variables in tagged template', () => {
    const code = `
      const x = <Trans>{plural\`\${count}, =0 { zero } one { one }\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        template = path.node;
      },
    });

    expect(template).toBeTruthy();
    const [variables, formatted] = getTextAndInterpolatedVariables('plural', template, 0, babel);

    expect(variables).toContain('count');
    expect(formatted).toContain('{count, plural');
  });

  it('should handle JSX elements in tagged templates', () => {
    const code = `
      const x = <Trans>{plural\`\${count}, =0 { \${<strong>zero</strong>} }\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        template = path.node;
      },
    });

    expect(template).toBeTruthy();
    const [variables, formatted, finalIndex] = getTextAndInterpolatedVariables(
      'plural',
      template,
      0,
      babel,
    );

    expect(variables).toContain('count');
    expect(finalIndex).toBeGreaterThan(0); // Should increment for JSX element
  });

  it('should handle nested tagged templates', () => {
    const code = `
      const x = <Trans>{plural\`\${count}, other { \${number\`\${value}\`} }\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        if (path.node.tag.type === 'Identifier' && path.node.tag.name === 'plural') {
          template = path.node;
        }
      },
    });

    expect(template).toBeTruthy();
    const [variables, formatted] = getTextAndInterpolatedVariables('plural', template, 0, babel);

    expect(variables).toContain('count');
    expect(variables).toContain('value');
  });

  it('should extract variables from JSX element with identifier', () => {
    const code = `
      const x = <Trans>{date\`\${<strong>{now}</strong>}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        template = path.node;
      },
    });

    expect(template).toBeTruthy();
    const [variables] = getTextAndInterpolatedVariables('date', template, 0, babel);

    expect(variables).toContain('now');
  });

  it('should extract variables from JSX element with sequence expression', () => {
    const code = `
      const x = <Trans>{plural\`\${count}, one {\${<div>{value, number}</div>}}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        template = path.node;
      },
    });

    expect(template).toBeTruthy();
    const [variables] = getTextAndInterpolatedVariables('plural', template, 0, babel);

    expect(variables).toContain('count');
    expect(variables).toContain('value');
  });

  it('should extract variables from JSX element with numeric literal in sequence', () => {
    const code = `
      const x = <Trans>{plural\`\${count}, one {\${<div>{123, number}</div>}}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        template = path.node;
      },
    });

    expect(template).toBeTruthy();
    const [variables] = getTextAndInterpolatedVariables('plural', template, 0, babel);

    expect(variables).toContain('count');
    expect(variables).toContain('123');
  });

  it('should extract variables from nested JSX in tagged templates', () => {
    const code = `
      const x = <Trans>{select\`\${gender}, male {\${<div><strong>{name}</strong></div>}}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        template = path.node;
      },
    });

    expect(template).toBeTruthy();
    const [variables] = getTextAndInterpolatedVariables('select', template, 0, babel);

    expect(variables).toContain('gender');
    expect(variables).toContain('name');
  });

  it('should extract variables from JSX with tagged template children', () => {
    const code = `
      const x = <Trans>{plural\`\${count}, one {\${<div>{date\`\${now}\`}</div>}}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        if (path.node.tag.type === 'Identifier' && path.node.tag.name === 'plural') {
          template = path.node;
        }
      },
    });

    expect(template).toBeTruthy();
    const [variables] = getTextAndInterpolatedVariables('plural', template, 0, babel);

    expect(variables).toContain('count');
    expect(variables).toContain('now');
  });

  it('should extract variables from deeply nested JSX in tagged templates', () => {
    const code = `
      const x = <Trans>{select\`\${gender}, male {\${<div><span><strong>{name}</strong></span></div>}}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        template = path.node;
      },
    });

    expect(template).toBeTruthy();
    const [variables] = getTextAndInterpolatedVariables('select', template, 0, babel);

    expect(variables).toContain('gender');
    expect(variables).toContain('name');
  });

  it('should extract variables from JSX with nested tagged template inside JSX', () => {
    const code = `
      const x = <Trans>{plural\`\${count}, one {\${<Component>{date\`\${now}\`}</Component>}}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        if (path.node.tag.type === 'Identifier' && path.node.tag.name === 'plural') {
          template = path.node;
        }
      },
    });

    expect(template).toBeTruthy();
    const [variables] = getTextAndInterpolatedVariables('plural', template, 0, babel);

    expect(variables).toContain('count');
    expect(variables).toContain('now');
  });

  it('should extract variables from tagged template with nested JSXElement containing JSXElement', () => {
    const code = `
      const x = <Trans>{select\`\${gender}, male {\${<Component><div>{value}</div></Component>}}\`}</Trans>
    `;

    const ast = babel.parse(code, {
      presets: ['@babel/preset-react'],
      filename: 'test.jsx',
      plugins: ['@babel/plugin-syntax-jsx'],
    });

    let template: any = null;
    babel.traverse(ast!, {
      TaggedTemplateExpression(path) {
        template = path.node;
      },
    });

    expect(template).toBeTruthy();
    const [variables] = getTextAndInterpolatedVariables('select', template, 0, babel);

    expect(variables).toContain('gender');
    expect(variables).toContain('value');
  });
});
