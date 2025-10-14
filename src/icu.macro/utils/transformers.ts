import { type NodePath } from '@babel/traverse';
import type * as Babel from '@babel/core';
import { pluralAsJSX } from '../plural';
import { selectAsJSX } from '../select';
import { transAsJSX } from '../trans';
import { getJSXContext } from './get-jsx-context';

/**
 * Transform Plural and SelectOrdinal components
 */
export function transformPluralComponents(references: NodePath[], babel: typeof Babel): void {
  for (const ref of references) {
    const ctx = getJSXContext(ref);
    if (ctx) pluralAsJSX(ctx.parentPath, ctx, babel);
  }
}

/**
 * Transform Select components
 */
export function transformSelectComponents(references: NodePath[], babel: typeof Babel): void {
  for (const ref of references) {
    const ctx = getJSXContext(ref);
    if (ctx) selectAsJSX(ctx.parentPath, ctx, babel);
  }
}

/**
 * Transform Trans components
 */
export function transformTransComponents(
  references: NodePath[],
  babel: typeof Babel,
  state: { filename?: string },
): void {
  for (const ref of references) {
    const ctx = getJSXContext(ref);
    if (ctx) transAsJSX(ctx.parentPath, ctx, babel, state);
  }
}
