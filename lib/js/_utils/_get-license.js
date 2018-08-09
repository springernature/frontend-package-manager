/**
 * _get-license.js
 * Get the global license information
 */
'use strict';

const error = require('./_error');

function getLicense(json) {
	const licenseInfo = json.license;

	if (!licenseInfo) {
		error(new Error('No license information found in top-level `package.json`'));
	}
	return licenseInfo;
}

module.exports = getLicense;
