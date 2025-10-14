/**
 * Utility functions for the ICU macro
 *
 * This index aggregates all utility functions from individual modules.
 * Each utility is in its own file to avoid circular dependencies.
 *
 * Using `export *` is fine for tree shaking - bundlers can still remove unused exports
 * when consumers use named imports.
 */

export * from './types';
export * from './builder';
export * from './clone-attributes';
export * from './components';
export * from './extract-existing-values';
export * from './filter-jsx-children';
export * from './find-attribute';
export * from './get-children-from-jsx';
export * from './get-jsx-context';
export * from './icu-formatter';
export * from './processor';
export * from './transformers';
export * from './trim-indent';
export * from './validate-tagged-template';
export * from './validation';
export * from './values';
