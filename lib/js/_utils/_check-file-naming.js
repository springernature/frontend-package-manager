/**
 * _get-file-naming.js
 * Check any enforced file naming based on context dependencies
 */
'use strict';

const path = require('path');
const globby = require('globby');
const reporter = require('@springernature/util-cli-reporter');

/**
 * Check all file names in location match one of the brands
 * @private
 * @async
 * @function checkAllFilesInLocation
 * @param {String} locationPath full path to this location
 * @param {String} location name of location
 * @param {Array} brands list of all available brands
 * @return {Promise}
 */
async function checkAllFilesInLocation(locationPath, location, brands) {
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
 * We can enforce some folders to name files based on available brands
 * Folders can only contain files named after allowed brands
 * @async
 * @function checkFileNaming
 * @param {Array} enforceContextFileNaming folders that enforce naming conventions
 * @param {Array} brands list of all available brands
 * @param {String} packagePath package to validate
 * @return {Promise}
 */
async function checkFileNaming(enforceBrandFileNaming, brands, packagePath) {
	if (!enforceBrandFileNaming || !Array.isArray(enforceBrandFileNaming)) {
		return;
	}

	// Check file naming for each location specified
	for (const location of enforceBrandFileNaming) {
		reporter.info('checking file naming', 'for brand context', location);
		await checkAllFilesInLocation(path.resolve(packagePath, location), location, brands);
	}

	reporter.success('checking file naming', 'for brand context');
}

module.exports = checkFileNaming;
