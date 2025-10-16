import { describe, it, expect } from 'vitest';
import * as babel from '@babel/core';
import { getComponents } from '../../src/icu.macro/utils/components';

describe('getComponents', () => {
  it('should extract JSXElements and clean sequence expressions from children', () => {
    // Parse JSX with sequence expression: <strong>{catchDate, date, short}</strong>
    const code = `
      const x = <Trans>
        Text with <strong>{catchDate, date, short}</strong> here
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

    const components = getComponents(children, babel);

    expect(components).toHaveLength(1);
    expect(components[0].openingElement.name).toMatchObject({ name: 'strong' });

    // The component should have its sequence expression cleaned to just the first item
    const expressionContainer = components[0].children.find(
      (child: any) => child.type === 'JSXExpressionContainer',
    );
    expect(expressionContainer).toBeDefined();

    // Should have only one expression (catchDate), not three (catchDate, date, short)
    if (expressionContainer?.expression?.type === 'SequenceExpression') {
      expect(expressionContainer.expression.expressions).toHaveLength(1);
      expect(expressionContainer.expression.expressions[0]).toMatchObject({ name: 'catchDate' });
    }
  });

  it('should handle JSXElements without sequence expressions', () => {
    const code = `
      const x = <Trans>
        Text with <strong>simple</strong> content
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

    const components = getComponents(children, babel);

    expect(components).toHaveLength(1);
    expect(components[0].openingElement.name).toMatchObject({ name: 'strong' });
  });

  it('should handle multiple JSXElements', () => {
    const code = `
      const x = <Trans>
        <strong>Bold</strong> and <em>italic</em>
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

    const components = getComponents(children, babel);

    expect(components).toHaveLength(2);
    expect(components[0].openingElement.name).toMatchObject({ name: 'strong' });
    expect(components[1].openingElement.name).toMatchObject({ name: 'em' });
  });

  it('should handle nested JSXElements with sequence expressions', () => {
    const code = `
      const x = <Trans>
        <div><strong>{value, number}</strong></div>
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

    const components = getComponents(children, babel);

    expect(components).toHaveLength(1);
    expect(components[0].openingElement.name).toMatchObject({ name: 'div' });
  });

  it('should extract components from tagged template expressions', () => {
    const code = `
      const x = <Trans>
        {date\`\${<strong>content</strong>}\`}
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

    const components = getComponents(children, babel);

    expect(components).toHaveLength(1);
    expect(components[0].openingElement.name).toMatchObject({ name: 'strong' });
  });

  it('should extract components from nested tagged templates', () => {
    const code = `
      const x = <Trans>
        {plural\`\${count}, one {\${number\`\${<strong>value</strong>}\`}}\`}
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

    const components = getComponents(children, babel);

    expect(components).toHaveLength(1);
    expect(components[0].openingElement.name).toMatchObject({ name: 'strong' });
  });
});
