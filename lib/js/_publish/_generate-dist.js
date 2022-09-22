/**
 * _generate-dist.js
 * Compile code to distributable folder
 */
'use strict';

const path = require('path');
const renderer = require('@springernature/util-package-renderer');
const reporter = require('@springernature/util-cli-reporter');

const exists = require('../_utils/_check-exists');
const createDistStructure = require('./_create-dist-structure');

/**
 * Compile SCSS and JS
 * @async
 * @private
 * @function compileAssets
 * @param {String} pathToPackage package path on filesystem
 * @param {String} config context package configuration
 * @param {String} context name of brand context on NPM
 * @param {Object} options configuration options to pass to the renderer
 * @param {Boolean} [options.minify=false] minify the js and css output
 * @param {Boolean} [options.reporting=info] level for reporting output from renderer
 * @return {Promise}
 */
async function compileAssets(pathToPackage, config, context, options) {
	const currentWorkingDirectory = require('../_utils/_current-working-directory')();
	// const renderConfig = {
	// 	demoCodeFolder: demoFolder,
	// 	reportingLevel: options.reporting || 'info',
	// 	packageRoot: pathToPackage,
	// 	minify: options.minify || false,
	// 	brandContext: context,
	// 	dynamicTemplateLocation: currentWorkingDirectory,
	// 	...(options.distFolder && {distFolderPath: options.distFolder})
	// };

	// Check if dist folder exists
	try {
		const distStructure = await createDistStructure(pathToPackage, config.configuredBrands);
		// if this is undefined it means no dist endpoints, show warning
		console.log(distStructure);
	} catch (error) {
		reporter.warning('compiling assets', error.message, error.cause);
	}

	// Generate static assets
	// await renderer(renderConfig);

	// Reset CLI reporting
	reporter.init('title');
}

/**
 * Write compiled CSS and JS to file
 * @async
 * @function createDist
 * @param {String} pathToPackage package path on filesystem
 * @param {String} config context package configuration
 * @param {String} [reporting] level for reporting output from renderer
 * @return {Promise}
 */
async function createDist(pathToPackage, config, reporting) {
	reporter.info('creating compiled assets', 'writing to dist folder');
	const context = `@${config.scope}/${config.brandContextName}`;
	await compileAssets(pathToPackage, config, context, {
		minify: true,
		reporting: reporting
	});
}

module.exports = createDist;
