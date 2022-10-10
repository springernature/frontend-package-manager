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
 * Get all the configured endpoints for the brand context
 * @async
 * @private
 * @function getConfiguredEndpoints
 * @param {String} pathToPackage package path on filesystem
 * @param {Array} configuredBrands all brands in the context
 * @return
 */
async function getConfiguredEndpoints(pathToPackage, configuredBrands) {
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

			distributionConfig[assetType].push({
				endpoint: endpointFullPath,
				...(assetType === 'css' && {destination: path.join(pathToPackage, brand, DIST_FOLDER_NAME, 'css', `${path.parse(endpoint).name}.css`)}),
				...(assetType === 'js' && {destination: path.join(pathToPackage, brand, DIST_FOLDER_NAME, 'js', endpoint.split('/js/')[1])})
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
 * @return {Promise<Object||undefined>}
 */
async function createContextDistStructure(pathToPackage, config) {
	const distributionConfig = await getConfiguredEndpoints(pathToPackage, config.configuredBrands);

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
