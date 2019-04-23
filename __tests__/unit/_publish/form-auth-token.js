/**
 * __tests__/unit/_publish/form-auth-token.js
 * Test: js/_publish/_form-auth-token.js
 */
'use strict';

const formAuthToken = require('../../../lib/js/_publish/_form-auth-token');

describe('Generate Auth token URL', () => {
	test('Handles http URL', () => {
		const registryUrl = 'http://registry.npmjs.org/';
		const result = formAuthToken(registryUrl, 'FOO');

		expect.assertions(1);
		expect(result).toEqual({
			test: '//registry.npmjs.org/:_authToken=',
			token: '//registry.npmjs.org/:_authToken=${FOO}'
		});
	});

	test('Handles https URL', () => {
		const registryUrl = 'https://registry.npmjs.org/';
		const result = formAuthToken(registryUrl, 'FOO');

		expect.assertions(1);
		expect(result).toEqual({
			test: '//registry.npmjs.org/:_authToken=',
			token: '//registry.npmjs.org/:_authToken=${FOO}'
		});
	});

	test('Handles default ENV name', () => {
		const registryUrl = 'https://registry.npmjs.org/';
		const result = formAuthToken(registryUrl);

		expect.assertions(1);
		expect(result).toEqual({
			test: '//registry.npmjs.org/:_authToken=',
			token: '//registry.npmjs.org/:_authToken=${NPM_TOKEN}'
		});
	});
});
