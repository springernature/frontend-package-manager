/**
 * __mocks__/_get-latest-version.js
 * Mock the Latest version
 */
'use strict';

/**
 * Mock getting the latest version of a package from NPM
 * User Promise to mock async/await functionality
 * @async
 * @function getLatestVersion
 * @param {String} packageName name of package to check
 * @return {Promise<String>}
 */
function getLatestVersion(name) {
	return new Promise((resolve, reject) => {
		process.nextTick(
			() => {
				if ((name === 'global-error')) {
					reject(new Error('error thrown'));
				}
				if ((name === 'global-unpublished')) {
					resolve(null);
				}
				resolve('2.0.0');
			});
	});
}

module.exports = getLatestVersion;
