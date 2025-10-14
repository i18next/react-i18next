import type * as Babel from '@babel/core';
import type { JSXChild, ProcessedTransResult } from './types';
import { mergeChildren } from './icu-formatter';
import { getComponents } from './components';
import { getValues } from './values';

/**
 * Process Trans children and extract defaults, components, and values
 */
export function processTrans(
  children: JSXChild[],
  babel: typeof Babel,
  componentStartIndex = 0,
): ProcessedTransResult {
  return {
    defaults: mergeChildren(children, babel, componentStartIndex),
    components: getComponents(children, babel),
    values: getValues(children, babel),
  };
}
