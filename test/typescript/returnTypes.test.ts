import { KeysWithSeparator, NormalizeByTypeOptions, NormalizeReturn } from 'react-i18next';

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

// Test cases for TypeOptions['keySeparator']: '.' (default)
type DefaultCase = KeysWithSeparator<'namespace', 'key' | 'key2'>;
const defaultCaseExpectedResult = 'namespace.key';
const defaultCaseExpectedResult2 = 'namespace.key2';
const defaultCase: DefaultCase = defaultCaseExpectedResult;
const defaultCase2: DefaultCase = defaultCaseExpectedResult2;

// Test cases for TypeOptions['keySeparator']: '>>>' (arbitrary separator)
type ArbitrarySeparatorCase = KeysWithSeparator<'namespace', 'key' | 'key2', '>>>'>;
const arbitrarySeparatorExpectedResult = 'namespace>>>key';
const arbitrarySeparatorExpectedResult2 = 'namespace>>>key2';
const arbitrarySeparatorCase: ArbitrarySeparatorCase = arbitrarySeparatorExpectedResult;
const arbitrarySeparatorCase2: ArbitrarySeparatorCase = arbitrarySeparatorExpectedResult2;

// Test cases for TypeOptions['keySeparator']: false (nesting not supported)
interface MockDictionary {
  key: { nested: 'value' };
  notNested: 'value';
}

type ReturnGivenKey = NormalizeReturn<MockDictionary, 'key.nested', false>;
const shouldBeGivenKey: ReturnGivenKey = 'key.nested';

type ReturnGivenKey2 = NormalizeReturn<MockDictionary, 'keyfalsenested', false>;
const shouldBeGivenKey2: ReturnGivenKey2 = 'keyfalsenested';

type ReturnValue = NormalizeReturn<MockDictionary, 'notNested', false>;
const shouldBeTranslationValue: ReturnValue = 'value';

type ReturnValue2 = NormalizeReturn<MockDictionary, 'key//nested', '//'>;
const shouldBeTranslationValue2: ReturnValue2 = 'value';
