/**
 * _check-license.js
 * Check the correct license is used
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

function validLicense(packagePath, globalLicense) {
	return new Promise((resolve, reject) => {
		const packageLicense = require(`${packagePath}/package.json`).license;
		const validates = packageLicense && packageLicense === globalLicense;

		reporter[(validates) ? 'success' : 'fail']('validating', 'license', packageLicense);

		if (validates) {
			resolve();
		} else {
			reject(new Error(`Invalid license \`${packageLicense}\`. Should be \`${globalLicense}\``));
		}
	});
}

module.exports = validLicense;
