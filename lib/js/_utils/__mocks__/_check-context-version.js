/**
 * __mocks__/_check-context-version.js
 * Check for Semver matching context versions
 */
'use strict';

/**
 * Mock checkContextVersion function
 * @async
 * @function checkContextVersion
 * @param {String} scope package scope
 * @param {String} packageName name of brand context package
 * @param {String} version version of context to check
 * @return {Promise<Array>}
 */
async function checkContextVersion(_scope, packageName, _version) {
	const error = new Error(`failed to match context versions`);
	if (packageName === 'valid-context') {
		return [
			'1.2.0',
			'1.5.0'
		];
	}

	throw error;
}

module.exports = checkContextVersion;
