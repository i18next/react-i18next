import { describe, it, expect } from 'vitest';
import * as babel from '@babel/core';
import { getValues } from '../../src/icu.macro/utils/values';

describe('getValues', () => {
  it('should extract simple identifier values', () => {
    const code = `
      const x = <Trans>
        Hello {name}!
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

    const values = getValues(children, babel);

    expect(values).toHaveLength(1);
    expect(values[0]).toMatchObject({
      key: { name: 'name' },
      value: { name: 'name' },
    });
  });

  it('should extract values from sequence expressions', () => {
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

    const values = getValues(children, babel);

    expect(values).toHaveLength(1);
    expect(values[0]).toMatchObject({
      key: { name: 'price' },
      value: { name: 'price' },
    });
  });

  it('should extract values from sequence expressions with literals', () => {
    const code = `
      const x = <Trans>
        Value: {123, number}
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

    const values = getValues(children, babel);

    expect(values).toHaveLength(1);
    expect(values[0].key).toMatchObject({ name: '123' });
  });

  it('should extract values from object expressions', () => {
    const code = `
      const x = <Trans>
        Value: {{ count: items.length }}
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

    const values = getValues(children, babel);

    expect(values).toHaveLength(1);
    expect(values[0]).toMatchObject({
      key: { name: 'count' },
    });
  });

  it('should extract values from nested JSX elements', () => {
    const code = `
      const x = <Trans>
        <strong>Hello {name}</strong>
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

    const values = getValues(children, babel);

    expect(values).toHaveLength(1);
    expect(values[0]).toMatchObject({
      key: { name: 'name' },
      value: { name: 'name' },
    });
  });

  it('should extract values from tagged template expressions', () => {
    const code = `
      const x = <Trans>
        Date: {date\`\${now}\`}
      </Trans>
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

    const values = getValues(children, babel);

    expect(values).toHaveLength(1);
    expect(values[0]).toMatchObject({
      key: { name: 'now' },
      value: { name: 'now' },
    });
  });

  it('should handle multiple values of different types', () => {
    const code = `
      const x = <Trans>
        {name} has {count, number} items
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

    const values = getValues(children, babel);

    expect(values).toHaveLength(2);
    expect(values[0].key).toMatchObject({ name: 'name' });
    expect(values[1].key).toMatchObject({ name: 'count' });
  });

  it('should handle sequence expressions with string literals', () => {
    const code = `
      const x = <Trans>
        {'test', format}
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

    const values = getValues(children, babel);

    expect(values).toHaveLength(1);
    expect(values[0].key).toMatchObject({ name: 'test' });
  });

  it('should handle sequence expressions with complex expressions that return null', () => {
    const code = `
      const x = <Trans>
        {obj.prop, format}
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

    const values = getValues(children, babel);

    // Should skip the complex expression and not add a value
    expect(values).toHaveLength(0);
  });

  it('should handle non-tagged-template JSXExpressionContainer', () => {
    const code = `
      const x = <Trans>
        {name}
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

    const values = getValues(children, babel);

    // Should extract the identifier
    expect(values).toHaveLength(1);
    expect(values[0].key).toMatchObject({ name: 'name' });
  });

  it('should handle JSXExpressionContainer with unsupported expression type', () => {
    // This tests the fallback path in extractTaggedTemplateValues (lines 95-96)
    const code = `
      const x = <Trans>
        {someFunction()}
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

    const values = getValues(children, babel);

    // CallExpression is not handled, so should return no values
    expect(values).toHaveLength(0);
  });
});
