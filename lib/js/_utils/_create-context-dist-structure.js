/**
 * _create-context-dist-structure.js
 * Generate the correct folder structure for the distributable compiled context assets
 * Return a config for generating assets within that structure
 */
'use strict';

const fs = require('fs').promises;
const constants = require('fs').constants;
const path = require('path');
const globby = require('globby');
const reporter = require('@springernature/util-cli-reporter');

const DIST_FOLDER_NAME = 'dist';

/**
 * Configure the correct distribution path for an asset
 * @private
 * @function configureDestinationPath
 * @param {Object} config package path on filesystem
 * @param {String} config.pathToPackage package path on filesystem
 * @param {String} config.brand name of brand for this asset
 * @param {String} config.assetType javascript or css
 * @param {String} config.endpoint relative path to the asset
 * @param {Boolean} config.minify are we minifying the output
 * @return {String}
 */
function configureDestinationPath(config) {
	const parentDistFolder = path.join(config.pathToPackage, config.brand, DIST_FOLDER_NAME);
	let assetPathEnding;

	// CSS paths are all one level deep within the scss folder
	if (config.assetType === 'css') {
		const assetName = path.parse(config.endpoint).name;
		const fileNameArray = [assetName, ...(config.minify ? ['.min'] : []), '.css'];
		assetPathEnding = fileNameArray.join('');
	}

	// JS paths can be any depth within the js folder
	if (config.assetType === 'js') {
		const pathWithinJsFolder = path.parse(config.endpoint.split('/js/')[1]);
		const fileNameArray = [pathWithinJsFolder.name, ...(config.minify ? ['.min'] : []), pathWithinJsFolder.ext];
		assetPathEnding = path.join(pathWithinJsFolder.dir, fileNameArray.join(''));
	}

	// Asset path within the dist folder
	return path.join(parentDistFolder, config.assetType, assetPathEnding);
}

/**
 * Get all the configured endpoints for the brand context
 * @async
 * @private
 * @function getConfiguredEndpoints
 * @param {String} pathToPackage package path on filesystem
 * @param {Array} configuredBrands all brands in the context
 * @param {Boolean} minify are we minifying the output
 * @return {Promise<Object>}
 */
async function getConfiguredEndpoints(pathToPackage, configuredBrands, minify) {
	const distributionConfig = {js: [], css: []};

	// All possible endpoints
	const javascriptFiles = await globby(`${pathToPackage}/**/index.js`, {
		expandDirectories: false,
		onlyFiles: true,
		ignore: ['**/__tests__/**', '**/dist/**']
	});
	const javascriptEndpoints = javascriptFiles.map(file => path.relative(pathToPackage, file)); // map to brand/path/to/index.js
	const sassEndpoints = configuredBrands.flatMap(brand => [
		`${brand}/scss/core.scss`,
		`${brand}/scss/enhanced.scss`
	]);

	// Filter by configured endpoints
	// Build compilation config
	await Promise.all([...javascriptEndpoints, ...sassEndpoints].map(async endpoint => {
		const endpointFullPath = path.join(pathToPackage, endpoint);
		const assetType = (javascriptEndpoints.includes(endpoint)) ? 'js' : 'css';

		try {
			await fs.access(endpointFullPath, constants.R_OK | constants.W_OK);
			const brand = endpoint.split(path.sep)[0];
			const finalPath = configureDestinationPath({pathToPackage, brand, assetType, endpoint, minify});

			distributionConfig[assetType].push({
				endpoint: endpointFullPath,
				destination: finalPath
			});
		} catch {
			reporter.warning('render files', 'missing endpoint', endpoint);
		}
	}));

	return distributionConfig;
}

/**
 * Create the distributable folder structure and config
 * @async
 * @function createContextDistStructure
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config configuration for compiling assets
 * @param {Array} [config.configuredBrands] configured brands
 * @param {Boolean} [config.publish] are we publishing the compiled assets
 * @param {Boolean} minify are we minifying the output
 * @return {Promise<Object||undefined>}
 */
async function createContextDistStructure(pathToPackage, config, minify) {
	const distributionConfig = await getConfiguredEndpoints(pathToPackage, config.configuredBrands, minify);

	// No assets means no distributable
	if (distributionConfig.js.length === 0 || distributionConfig.css.length === 0) {
		reporter.warning('render files', 'no endpoints found');
		return;
	}

	// Create folder structure
	// Only for publish step
	if (config.publish) {
		const assetPaths = [
			...(distributionConfig.js.length > 0 ? distributionConfig.js.map(endpoint => path.parse(endpoint.destination).dir) : []),
			...(distributionConfig.css.length > 0 ? distributionConfig.css.map(endpoint => path.parse(endpoint.destination).dir) : [])
		];

		await Promise.all(
			assetPaths.map(dirname => fs.mkdir(dirname, {recursive: true}).catch(error => {
				throw error;
			}))
		);
	}

	return distributionConfig;
}

module.exports = createContextDistStructure;
