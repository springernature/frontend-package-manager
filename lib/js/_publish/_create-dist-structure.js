/**
 * _create-dist-structure.js
 * Generate the correct folder structure for the distributable
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const exists = require('../_utils/_check-exists');

const mkdir = promisify(fs.mkdir);

/**
 * Does a particular asset folder exist
 * @async
 * @private
 * @function hasAsset
 * @param {String} pathToPackage package path on filesystem
 * @param {String} folder asset folder name
 * @return {Boolean}
 */
async function hasAsset(pathToPackage, folder) {
	try {
		await exists.directoryExists(path.join(pathToPackage, folder));
	} catch {
		return false;
	}

	return true;
}

/**
 * Create the distributable folder structure
 * @async
 * @function createDistStructure
 * @param {String} pathToPackage package path on filesystem
 * @return {Promise}
 */
async function createDistStructure(pathToPackage) {
	const distParentFolder = path.resolve(pathToPackage, 'dist');
	const startingPath = path.join(pathToPackage, distParentFolder);
	const jsPath = hasAsset(pathToPackage, 'js');
	const cssPath = hasAsset(pathToPackage, 'scss');

	if (!jsPath && !cssPath) {
		return;
	}

	try {
		const assetPaths = [
			...(jsPath ? [path.join(startingPath, 'js')] : []),
			...(cssPath ? [path.join(startingPath, 'css')] : [])
		];

		await Promise.all(
			assetPaths.map(dirname => mkdir(dirname).catch(console.error))
		);
	} catch (error) {
		console.error(error);
	}
}

module.exports = createDistStructure;
