/**
 * __tests__/unit/get-package-name.js
 * Test: js/_get-package-name.js
 */
'use strict';

const getPackageName = require('../../js/_get-package-name');

describe('Package name from it\'s path', () => {
	test('The data is the package name', () => {
		const name = getPackageName('some/path/to/global-package');
		expect.assertions(1);
		expect(name).toBe('global-package');
	});
});