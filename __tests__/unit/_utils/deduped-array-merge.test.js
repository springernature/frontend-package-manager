/**
 * __tests__/unit/_utils/deduped-array-merge.test.js
 * Test: js/_utils/_deduped-array-merge.js
 */
'use strict';

const mergeArrayNoDupes = require('../../../lib/js/_utils/_deduped-array-merge');

describe('Valid array deduping', () => {
	test('Both arrays are the same', () => {
		const result = mergeArrayNoDupes(['a', 'b', 'c'], ['a', 'b', 'c']);
		expect.assertions(1);
		expect(result).toEqual(['a', 'b', 'c']);
	});

	test('Partial match on array', () => {
		const result = mergeArrayNoDupes(['a', 'b', 'c'], ['a', 'b', 'd', 'e']);
		expect.assertions(1);
		expect(result).toEqual(['a', 'b', 'c', 'd', 'e']);
	});

	test('No match on array', () => {
		const result = mergeArrayNoDupes(['a', 'b', 'c'], ['d', 'e', 'f']);
		expect.assertions(1);
		expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
	});
});

describe('Invalid array deduping', () => {
	test('First argument is a string', () => {
		const result = mergeArrayNoDupes('fail', ['a', 'b', 'c']);
		expect.assertions(1);
		expect(result).toEqual(undefined);
	});

	test('Second argument is an Object', () => {
		const result = mergeArrayNoDupes(['a', 'b', 'c'], {fail: true});
		expect.assertions(1);
		expect(result).toEqual(undefined);
	});

	test('Second argument missing', () => {
		const result = mergeArrayNoDupes(['a', 'b', 'c']);
		expect.assertions(1);
		expect(result).toEqual(undefined);
	});
});