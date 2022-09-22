/**
 * _create-dist-structure.js
 * Generate the correct folder structure for the distributable compiled assets
 * Return a config for generating assets within that structure
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const globby = require('globby');

const mkdir = promisify(fs.mkdir);

/**
 * Are the correct endpoints in place to create compiled assets
 * @async
 * @private
 * @function checkValidEndpoints
 * @param {Array} names asset endpoints
 * @param {String} type asset type, js or scss
 * @param {Array} brands configured brands
 * @return
 */
function checkValidEndpoints(names, type, brands) {
	if (names.length === 0) {
		return;
	}

	// javascript should always have an index file
	if (type === 'js' && !names.includes('index')) {
		throw new Error('requires `index.js` endpoint to create compiled javascript');
	}

	// If there is only one brand there should be an index file
	if (type === 'scss' && names.length === 1 && names[0] !== 'index') {
		throw new Error('requires `index.scss` endpoint to create compiled css');
	}

	// Multiple brands should have brand named files
	if (type === 'scss' && names.length > 1 && !names.every(r => brands.includes(r))) {
		throw new Error(`requires brand specific endpoints ${brands.map(b => `${b}`).join('/')}`, {
			cause: `found ${names.map(b => `${b}.scss`).join()}`
		});
	}
}

/**
 * Create the distributable folder structure and config
 * @async
 * @function createDistStructure
 * @param {String} pathToPackage package path on filesystem
 * @param {Array} brands configured brands
 * @return {Promise<Object>}
 */
async function createDistStructure(pathToPackage, brands) {
	const distParentFolder = path.resolve(pathToPackage, 'dist');
	const jsPath = path.join(pathToPackage, 'js');
	const cssPath = path.join(pathToPackage, 'scss');
	const distributionConfig = {};

	// Check for JS endpoints
	const jsResult = await globby(`${jsPath}/*.js`, {expandDirectories: false, onlyFiles: true});
	const distJsPaths = jsResult.map(p => path.parse(p).name);
	checkValidEndpoints(distJsPaths, 'js', brands);

	// Check for Scss endpoints
	const scssResult = await globby(`${cssPath}/*.scss`, {expandDirectories: false, onlyFiles: true});
	const distCssPaths = scssResult.map(p => path.parse(p).name);
	checkValidEndpoints(distCssPaths, 'scss', brands);

	// No assets means no distributable
	if (distJsPaths.length === 0 && distCssPaths.length === 0) {
		return;
	}

	// configure for js distributable
	if (distJsPaths.length > 0) {
		distributionConfig.js = {
			endpoint: path.join(jsPath, 'index.js'),
			destination: path.join(distParentFolder, 'js', 'index.js')
		};
	}

	// configure for css distributable
	if (distCssPaths.length === 1) {
		distributionConfig.css = [{
			endpoint: path.join(cssPath, 'index.scss'),
			destination: path.join(distParentFolder, 'css', 'index.css')
		}];
	} else if (distCssPaths.length > 1) {
		distributionConfig.css = [];
		for (const endpoint of distCssPaths) {
			distributionConfig.css.push({
				endpoint: path.join(cssPath, `${endpoint}.scss`),
				destination: path.join(distParentFolder, 'css', `${endpoint}.css`)
			});
		}
	}

	// Create folder structure
	const assetPaths = [
		...(distJsPaths.length > 0 ? [path.join(distParentFolder, 'js')] : []),
		...(distCssPaths.length > 0 ? [path.join(distParentFolder, 'css')] : [])
	];

	await Promise.all(
		assetPaths.map(dirname => mkdir(dirname, {recursive: true}).catch(error => {
			throw new Error('problem creating directory', {
				cause: error.message
			});
		}))
	);

	return distributionConfig;
}

module.exports = createDistStructure;
