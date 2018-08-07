/**
 * __mocks__/_get-latest-version.js
 * Mock the Latest version
 */
'use strict';

function getLatestVersion(name) {
	return new Promise((resolve, reject) => {
		process.nextTick(
			() => (name === 'error') ?
				reject(new Error('error thrown')) :
				resolve('2.0.0')
		);
	});
}

module.exports = getLatestVersion;
