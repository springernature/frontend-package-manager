/**
 * __tests__/unit/_utils/check-reserved-keys.test.js
 * Test: js/_utils/_check-reserved-keys.js
 */
'use strict';

const checkReservedKeys = require('../../../lib/js/_utils/_check-reserved-keys');

describe('Check a config for any reserved values', () => {
	test('No reserved keys found', async () => {
		expect.assertions(1);
		await expect(
			checkReservedKeys({
				'scope': 'springernature',
				'changelog': 'HISTORY.md'
			})
		).resolves.toEqual();
	});

	test('Single reserved key found', async () => {
		expect.assertions(1);
		await expect(
			checkReservedKeys({
				'scope': 'springernature',
				'packagesDirectory': 'packages',
				'changelog': 'HISTORY.md'
			})
		).rejects.toThrowError(new Error('the `packagesDirectory` key is reserved and cannot be set'));
	});

	test('Multiple reserved keys found', async () => {
		expect.assertions(1);
		await expect(
			checkReservedKeys({
				'scope': 'springernature',
				'toolkitsDirectory': 'toolkits',
				'packagesDirectory': 'packages',
				'changelog': 'HISTORY.md'
			})
		).rejects.toThrowError(new Error('the `toolkitsDirectory` key is reserved and cannot be set'));
	});
});