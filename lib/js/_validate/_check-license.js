/**
 * _check-license.js
 * Check the correct license is used
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

/**
 * Check the correct license is used
 * @async
 * @function checkLicense
 * @param {String} pathToPackage package path on filesystem
 * @param {String} globalLicense the license type that should be used
 * @return {Promise}
 */
async function checkLicense(pathToPackage, globalLicense) {
	const packageLicense = require(path.join(pathToPackage, 'package.json')).license;
	const validates = packageLicense && packageLicense === globalLicense;

	// Report status
	reporter[(validates) ? 'success' : 'fail']('validating', 'license', packageLicense);

	if (validates) {
		return;
	}

	throw new Error(`Invalid license \`${packageLicense}\`. Should be \`${globalLicense}\``);
}

module.exports = checkLicense;
