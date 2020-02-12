/**
 * _get-file-naming.js
 * Check any enforced file naming based on context dependencies
 */
'use strict';

const path = require('path');
const globby = require('globby');
const reporter = require('@springernature/util-cli-reporter');

async function checkAllFileInLocation(locationPath, location, brands) {
	try {
		const files = await globby(locationPath, {expandDirectories: true, onlyFiles: true});

		// Check the file name
		// Handle partials for scss
		for (const file of files) {
			const filename = path.basename(file, path.extname(file))
				.replace(/^_/, '');

			if (!brands.includes(filename)) {
				throw new Error(`\`${filename}\` is not a valid brand: ${brands.join(', ')}`);
			}
		}
	} catch (error) {
		reporter.fail('checking file naming', 'problem matching files', location);
		throw error;
	}
}

/**
 * We can enforce some folders to name files based available brands
 * Folders can only contain files named after allowed brands
 * @async
 * @function checkFileNaming
 * @param {Array} enforceContextFileNaming folders that enforce naming conventions
 * @param {String} brands list of all available brands
 * @param {String} packagePath package to validate
 * @return {Promise}
 */
async function checkFileNaming(enforceBrandFileNaming, brands, packagePath) {
	if (!enforceBrandFileNaming && enforceBrandFileNaming !== 'array') {
		return;
	}

	// Check file naming for each location specified
	for (const location of enforceBrandFileNaming) {
		reporter.info('checking file naming', 'for brand context', location);
		await checkAllFileInLocation(path.resolve(packagePath, location), location, brands);
	}
}

module.exports = checkFileNaming;
