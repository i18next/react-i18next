import type * as BabelTypes from '@babel/types';
import type { JSXChild } from './types';

/**
 * Filter JSX children to exclude JSXFragment
 */
export function filterJSXChildren(children: (JSXChild | BabelTypes.JSXFragment)[]): JSXChild[] {
  return children.filter((c): c is JSXChild => c.type !== 'JSXFragment');
}
