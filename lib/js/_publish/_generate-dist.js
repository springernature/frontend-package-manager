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

async function writeToDistFolder(distStructure) {
	console.log(distStructure);
}

/**
 * Compile SCSS and JS
 * @async
 * @private
 * @function compileAssets
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config context package configuration
 * @param {Object} context name of brand context on NPM
 * @param {Object} options configuration options to pass to the renderer
 * @param {Boolean} [options.minify=false] minify the js and css output
 * @param {Boolean} [options.reporting=info] level for reporting output from renderer
 * @return {Promise}
 */
async function compileAssets(pathToPackage, config, context, options) {
	const currentWorkingDirectory = require('../_utils/_current-working-directory')();
	const renderConfig = {
		reportingLevel: options.reporting || 'info',
		packageRoot: pathToPackage,
		minify: options.minify || false,
		brandContext: context,
		dynamicTemplateLocation: currentWorkingDirectory
	};
	let distStructure;

	// Create folder structure for compiled assets
	try {
		// should also be done when validating, but without the folder creation
		distStructure = await createDistStructure(pathToPackage, config.configuredBrands, config.allToolkitPaths);
	} catch (error) {
		reporter.fail('compiling static assets', error.message, error.cause);
		throw error;
	}

	// Generate distributable from valid endpoints
	if (distStructure) {
		// Generate static assets
		// await renderer(renderConfig);

		// Write static assets to file
		await writeToDistFolder(distStructure);
	}

	// Reset CLI reporting
	reporter.init('title');
}

/**
 * Write compiled CSS and JS to file
 * @async
 * @function createDist
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config context package configuration
 * @param {Object} allToolkitPaths information on configured toolkits
 * @param {String} [reporting] level for reporting output from renderer
 * @return {Promise}
 */
async function createDist(pathToPackage, config, allToolkitPaths, reporting) {
	const context = `@${config.scope}/${config.brandContextName}`;

	reporter.info('compiling static assets', 'writing to dist folder');
	await compileAssets(pathToPackage, {
		configuredBrands: config.configuredBrands,
		allToolkitPaths: allToolkitPaths
	}, context, {
		minify: true,
		reporting: reporting
	});
}

module.exports = createDist;
