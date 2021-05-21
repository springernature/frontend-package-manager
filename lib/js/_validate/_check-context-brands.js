/**
 * _check-context-brands.js
 * Check the context package contains valid brands
 */
'use strict';

const fs = require('fs');
const {promisify} = require('util');
const reporter = require('@springernature/util-cli-reporter');

const readdir = promisify(fs.readdir);

/**
 * Check package is structured into brands
 * @async
 * @function checkContextBrands
 * @param {String} config context config
 * @param {String} pathToPackage context package path on filesystem
 * @return {Promise}
 */
async function checkContextBrands(config, pathToPackage) {
	const allowedBrands = config.brands || [];
	let contextBrands;

	reporter.info(
		'checking',
		'allowed brand configurations',
		(allowedBrands && allowedBrands.length > 0) ? allowedBrands.join(', ') : 'none'
	);

	try {
		const allContents = await readdir(pathToPackage, {withFileTypes: true});

		// Get all directory names
		contextBrands = allContents
			.filter(item => item.isDirectory())
			.map(item => item.name);

		// Brand context must contain at least one brand
		if (contextBrands.length === 0) {
			throw new Error(`${config.brandContextName} must contain at least ONE brand`);
		}

		// Filter by brands NOT in the allowed brands list
		const filteredBrands = contextBrands.filter(brand => !allowedBrands.includes(brand));

		// Contains brands not in the allowed list
		if (filteredBrands.length > 0) {
			throw new Error(`the following brands are not allowed: ${filteredBrands.join(', ')}`);
		}
	} catch (error) {
		reporter.fail(
			'validating',
			'context brand configurations',
			(contextBrands && contextBrands.length > 0) ? contextBrands.join(', ') : 'none'
		);
		throw error;
	}

	// reporter.success('validating', 'found brand configurations', contextBrands.join(', '));
	return contextBrands;
}

module.exports = checkContextBrands;
