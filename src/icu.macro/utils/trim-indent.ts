const leadingNewLineAndWhitespace = /^\n\s+/g;
const trailingNewLineAndWhitespace = /\n\s+$/g;

/**
 * Trim leading and trailing newlines with whitespace
 */
export function trimIndent(text: string): string {
  return text.replace(leadingNewLineAndWhitespace, '').replace(trailingNewLineAndWhitespace, '');
}
