/**
 * __tests__/unit/_utils/get-package-name.test.js
 * Test: js/_utils/_get-package-name.js
 */
'use strict';

const getPackageName = require('../../../lib/js/_utils/_get-package-name');

describe('Package name from it\'s path', () => {
	test('The data is the package name', () => {
		const name = getPackageName('some/path/to/global-package');
		expect.assertions(1);
		expect(name).toBe('global-package');
	});
});