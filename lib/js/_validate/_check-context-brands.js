/**
 * _check-context-brands.js
 * Check the context package contains valid brands
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

/**
 * Check package is structured into brands
 * @async
 * @function checkContextBrands
 * @param {String} config context configuration
 * @return {Promise}
 */
async function checkContextBrands(config) {
	const allowedBrands = config.brands || [];
	const configuredBrands = config.configuredBrands || [];

	reporter.info('checking', 'context brand configuration');

	// Brand context must contain at least one brand
	if (configuredBrands.length === 0) {
		throw new Error(`${config.brandContextName} must contain at least ONE brand`);
	}

	// Filter by brands NOT in the allowed brands list
	const filteredBrands = configuredBrands.filter(brand => !allowedBrands.includes(brand));

	// Contains brands not in the allowed list
	if (filteredBrands.length > 0) {
		throw new Error(`the following brands are not allowed: ${filteredBrands.join(', ')}`);
	}
}

module.exports = checkContextBrands;
