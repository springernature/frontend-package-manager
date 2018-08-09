/**
 * _check-license.js
 * Check the correct license is used
 */
'use strict';

const chalk = require('chalk');

const showOutput = require('../_utils/_show-output');

function validLicense(packagePath, globalLicense) {
	return new Promise((resolve, reject) => {
		const packageLicense = require(`${packagePath}/package.json`).license;
		const validates = packageLicense && packageLicense === globalLicense;

		showOutput.log([{
			type: ((validates) ? 'success' : 'fail'),
			description: 'validating',
			message: `license` + chalk.white.dim(` ${packageLicense}`)
		}]);

		if (validates) {
			resolve();
		} else {
			reject(new Error(`Invalid license \`${packageLicense}\`. Should be \`${globalLicense}\``));
		}
	});
}

module.exports = validLicense;
