import { type NodePath } from '@babel/traverse';
import type * as BabelTypes from '@babel/types';

export interface ICUMacroReferences {
  [key: string]: NodePath[] | undefined;
  Trans?: NodePath[];
  Plural?: NodePath[];
  Select?: NodePath[];
  SelectOrdinal?: NodePath[];
  number?: NodePath[];
  date?: NodePath[];
  select?: NodePath[];
  selectOrdinal?: NodePath[];
  plural?: NodePath[];
  time?: NodePath[];
}

const icuInterpolators = ['date', 'time', 'number', 'plural', 'select', 'selectOrdinal'];
const importsToAdd = ['Trans'];

/**
 * helper split out of addNeededImports to make codeclimate happy
 *
 * This does the work of amending an existing import from "react-i18next", or
 * creating a new one if it doesn't exist
 */
function addImports(
  state: { file: { path: NodePath } },
  existingImport: BabelTypes.ImportDeclaration | undefined,
  allImportsToAdd: string[],
  t: typeof BabelTypes,
): void {
  // append imports to existing or add a new react-i18next import for the Trans and icu tagged template literals
  if (existingImport) {
    allImportsToAdd.forEach((name) => {
      if (
        existingImport.specifiers.findIndex(
          (specifier) =>
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.type === 'Identifier' &&
            specifier.imported.name === name,
        ) === -1
      ) {
        existingImport.specifiers.push(t.importSpecifier(t.identifier(name), t.identifier(name)));
      }
    });
  } else {
    const programPath = state.file.path as NodePath<BabelTypes.Program>;
    programPath.node.body.unshift(
      t.importDeclaration(
        allImportsToAdd.map((name) => t.importSpecifier(t.identifier(name), t.identifier(name))),
        t.stringLiteral('react-i18next'),
      ),
    );
  }
}

/**
 * Add `import { Trans, number, date, <etc.> } from "react-i18next"` as needed
 */
export function addNeededImports(
  state: { file: { path: NodePath } },
  babel: typeof import('@babel/core'),
  references: ICUMacroReferences,
): void {
  const t = babel.types;

  // check if there is an existing react-i18next import
  const programPath = state.file.path as NodePath<BabelTypes.Program>;
  const existingImport = programPath.node.body.find(
    (importNode): importNode is BabelTypes.ImportDeclaration =>
      t.isImportDeclaration(importNode) && importNode.source.value === 'react-i18next',
  );
  // check for any of the tagged template literals that are used in the source, and add them
  const usedRefs = Object.keys(references).filter((importName) => {
    if (!icuInterpolators.includes(importName)) {
      return false;
    }
    return references[importName as keyof ICUMacroReferences]?.length;
  });

  // combine Trans + any tagged template literals
  const allImportsToAdd = importsToAdd.concat(usedRefs);

  addImports(state, existingImport, allImportsToAdd, t);
}
