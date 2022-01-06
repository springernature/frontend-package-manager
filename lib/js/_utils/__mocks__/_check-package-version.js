/**
 * __mocks__/_check-package-version.js
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
 * Mock checkPackageVersion function
 * Return a version string
 * @function checkPackageVersion
 * @param {String} package_ package name
 * @return {String}
 */
const checkPackageVersion = package_ => result[package_.name];

module.exports = checkPackageVersion;
