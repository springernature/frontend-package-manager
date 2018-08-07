/**
 * _get-license.js
 * Get the global license information
 */
'use strict';

const exitScript = require('./_exit-script');

function getLicense(json) {
	const licenseInfo = json.license;

	if (!licenseInfo) {
		exitScript.throwErr('No license information found in top-level package.json. This MUST be fixed before release.');
	}
	return licenseInfo;
}

module.exports = getLicense;
