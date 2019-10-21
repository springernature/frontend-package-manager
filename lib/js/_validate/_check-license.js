/**
 * _check-license.js
 * Check the correct license is used
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

async function validLicense(packagePath, globalLicense) {
	const packageLicense = require(`${packagePath}/package.json`).license;
	const validates = packageLicense && packageLicense === globalLicense;

	// Report status
	reporter[(validates) ? 'success' : 'fail']('validating', 'license', packageLicense);

	if (validates) {
		return;
	}

	throw new Error(`Invalid license \`${packageLicense}\`. Should be \`${globalLicense}\``);
}

module.exports = validLicense;
