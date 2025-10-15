import { createMacro, type MacroParams } from 'babel-plugin-macros';
import { addNeededImports, type ICUMacroReferences } from './icu.macro/imports';
import {
  validateTaggedTemplatesInsideTrans,
  transformPluralComponents,
  transformSelectComponents,
  transformTransComponents,
} from './icu.macro/utils';

// copy to:
// https://astexplorer.net/#/gist/642aebbb9e449e959f4ad8907b4adf3a/4a65742e2a3e926eb55eaa3d657d1472b9ac7970

function ICUMacro({ references, state, babel }: MacroParams): void {
  const {
    Trans = [],
    Plural = [],
    Select = [],
    SelectOrdinal = [],
    number = [],
    date = [],
    select = [],
    selectOrdinal = [],
    plural = [],
    time = [],
  } = references as ICUMacroReferences;

  // Add necessary imports from 'react-i18next'
  addNeededImports(state, babel, references as ICUMacroReferences);

  // Transform components
  transformPluralComponents([...Plural, ...SelectOrdinal], babel);
  transformSelectComponents(Select, babel);
  transformTransComponents(Trans, babel, state);

  // Validate tagged template literals are only used inside <Trans>
  validateTaggedTemplatesInsideTrans({ number, date, time, select, plural, selectOrdinal }, babel);
}

export default createMacro(ICUMacro);
