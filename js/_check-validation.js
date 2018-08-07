/**
 * _check-validation.js
 * Wrapper for validation check functions
 */
'use strict';

const checkNaming = require('./_check-naming');
const checkPackageStructure = require('./_check-package-structure');
const checkLicense = require('./_check-license');

function checkValidation(config, path, license) {
	return new Promise((resolve, reject) => {
		checkNaming(config, path)
			.then(() => {
				checkLicense(path, license)
					.then(() => {
						checkPackageStructure(config, path, {dot: true})
							.then(resolve)
							.catch(err => {
								reject(err);
							});
					}).catch(err => {
						reject(err);
					});
			}).catch(err => {
				reject(err);
			});
	});
}

module.exports = checkValidation;
