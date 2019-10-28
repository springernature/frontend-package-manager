/**
 * _get-license.js
 * Get the global license information
 */
'use strict';

const error = require('./_error');

/**
 * Return the type of license from repository
 * @function getLicense
 * @param {Object} json package.json object
 * @return {String}
 */
function getLicense(json) {
	const licenseInfo = json.license;

	if (!licenseInfo) {
		error(new Error('No license information found in top-level `package.json`'));
	}
	return licenseInfo;
}

module.exports = getLicense;
