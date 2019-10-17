/**
 * __mocks__/_check-new-version.js
 * Mock returning a valid version
 */
'use strict';

const result = {
	'global-package': '3.0.0',
	'global-unpublished': '1.0.0',
	'global-match': '2.0.0',
	'global-older': '1.0.0',
	'global-none': '0.0.0'
};

/**
 * Mock checkNewVersion function
 * Return a version string
 * @function checkNewVersion
 * @param {String} pkg package name
 * @return {String}
 */
const checkNewVersion = pkg => result[pkg.name];

module.exports = checkNewVersion;
