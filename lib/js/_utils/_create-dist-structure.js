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
const reporter = require('@springernature/util-cli-reporter');

const mkdir = promisify(fs.mkdir);

/**
 * Are the correct endpoints in place to create compiled assets
 * @private
 * @function checkValidEndpoints
 * @param {Array} names asset endpoints
 * @param {String} type asset type, js or scss
 * @param {Array} brands configured brands
 * @param {String} toolkitName name of parent toolkit
 * @return
 */
function checkValidEndpoints(names, type, brands, toolkitName) {
	if (names.length === 0) {
		return;
	}

	// javascript should always have an index file
	if (type === 'js' && !names.includes('index')) {
		throw new Error('requires `index.js` endpoint to create compiled javascript');
	}

	// For toolkits that are not multi-brand
	// There should be a single index.scss endpoint
	if ((toolkitName !== 'global' && type === 'scss') && (names.length !== 1 || names[0] !== 'index')) {
		throw new Error(`${toolkitName} toolkit requires a single 'scss/index.scss' endpoint`);
	}

	// Multi-brand toolkit requires brand named endpoints
	if ((toolkitName === 'global' && type === 'scss') && !names.every(r => brands.includes(r))) {
		throw new Error(`${toolkitName} toolkit requires brand specific endpoints ${brands.map(b => `${b}`).join('/')}`, {
			cause: `found ${names.map(b => `${b}.scss`).join()}`
		});
	}
}

/**
 * Get the name of the toolkit where the package lives
 * @private
 * @function getToolkitName
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} allToolkitPaths information on configured toolkits
 * @return
 */
function getToolkitName(pathToPackage, allToolkitPaths) {
	for (const t of Object.keys(allToolkitPaths)) {
		const toolkitPath = allToolkitPaths[t].path;

		if (pathToPackage.includes(toolkitPath)) {
			return t;
		}
	}

	throw new Error('Could not find a valid toolkit for this package');
}

/**
 * Create the distributable folder structure and config
 * @async
 * @function createDistStructure
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config configuration for compiling assets
 * @param {Array} [config.configuredBrands] configured brands
 * @param {Object} [config.allToolkitPaths] information on configured toolkits
 * @param {Boolean} [config.publish] are we publishing the compiled assets
 * @return {Promise<Object||undefined>}
 */
async function createDistStructure(pathToPackage, config) {
	const distParentFolder = path.resolve(pathToPackage, 'dist');
	const jsPath = path.join(pathToPackage, 'js');
	const cssPath = path.join(pathToPackage, 'scss');
	const distributionConfig = {};

	// Get toolkit name for package
	const toolkitName = getToolkitName(pathToPackage, config.allToolkitPaths);

	// Check for JS endpoints
	const jsResult = await globby(`${jsPath}/*.js`, {expandDirectories: false, onlyFiles: true});
	const distJsPaths = jsResult.map(p => path.parse(p).name);
	checkValidEndpoints(distJsPaths, 'js', config.configuredBrands);

	// Check for Scss endpoints
	const scssResult = await globby(`${cssPath}/*.scss`, {expandDirectories: false, onlyFiles: true});
	const distCssPaths = scssResult.map(p => path.parse(p).name);
	checkValidEndpoints(distCssPaths, 'scss', config.configuredBrands, toolkitName);

	// No assets means no distributable
	if (distJsPaths.length === 0 && distCssPaths.length === 0) {
		reporter.warning('package rendering', 'no endpoints found');
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
			endpoint: path.join(cssPath, `${distCssPaths[0]}.scss`),
			destination: path.join(distParentFolder, 'css', `${distCssPaths[0]}.css`),
			toolkit: toolkitName,
			brand: (distCssPaths[0] === 'index') ? toolkitName : distCssPaths[0]
		}];
	} else if (distCssPaths.length > 1) {
		distributionConfig.css = [];
		for (const endpoint of distCssPaths) {
			distributionConfig.css.push({
				endpoint: path.join(cssPath, `${endpoint}.scss`),
				destination: path.join(distParentFolder, 'css', `${endpoint}.css`),
				toolkit: toolkitName,
				brand: endpoint
			});
		}
	}

	// Create folder structure
	// Only for publish step
	if (config.publish) {
		const assetPaths = [
			...(distJsPaths.length > 0 ? [path.join(distParentFolder, 'js')] : []),
			...(distCssPaths.length > 0 ? [path.join(distParentFolder, 'css')] : [])
		];

		await Promise.all(
			assetPaths.map(dirname => mkdir(dirname, {recursive: true}).catch(error => {
				throw error;
			}))
		);
	}

	return distributionConfig;
}

module.exports = createDistStructure;
