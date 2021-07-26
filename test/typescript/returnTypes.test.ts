import { NormalizeByTypeOptions } from 'react-i18next';

// Test cases for TypeOptions['returnNull']: true
type ReturnNull = NormalizeByTypeOptions<null, { returnNull: true }>; // Returns null

const nullableValue: ReturnNull = null;

// @ts-expect-error: null is not assignable to string
const nonNullableValue: ReturnNull = '';

// Test cases for TypeOptions['returnNull']: false
type ReturnNonNullable = NormalizeByTypeOptions<null, { returnNull: false }>; // Returns string

// @ts-expect-error: null is not assignable to string
const nullableValue2: ReturnNonNullable = null;

const nonNullableValue2: ReturnNonNullable = '';

// Test cases for TypeOptions['returnEmptyString']: false
type ReturnNonEmptyString = NormalizeByTypeOptions<'', { returnEmptyString: false }>; // Returns string

const emptyStringValue: ReturnNonEmptyString = '';

// Emtpy string should always be assignable to string, but not viceversa
const nonEmptyStringValue: ReturnNonEmptyString = 'non-empty-string';

// Test cases for TypeOptions['returnEmptyString']: true
type ReturnEmptyString = NormalizeByTypeOptions<'', { returnEmptyString: true }>; // Returns ""

const emptyStringValue2: ReturnEmptyString = '';

// @ts-expect-error: '"non-empty-string"' is not assignable to type '""'
const nonEmptyStringValue2: ReturnEmptyString = 'non-empty-string';
