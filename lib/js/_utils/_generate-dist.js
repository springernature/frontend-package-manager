/**
 * _generate-dist.js
 * Compile code to distributable folder
 */
'use strict';

const path = require('path');
const renderer = require('@springernature/util-package-renderer');
const reporter = require('@springernature/util-cli-reporter');

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
	let distStructure;

	// Create folder structure for compiled assets
	try {
		distStructure = await createDistStructure(pathToPackage, config);
	} catch (error) {
		reporter.fail('compiling static assets', error.message, error.cause);
		throw error;
	}

	// Generate distributable from valid endpoints
	// Only for publish step
	if (distStructure && config.publish) {
		const currentWorkingDirectory = require('./_current-working-directory')();
		const renderConfig = {
			reportingLevel: options.reporting || 'info',
			packageRoot: pathToPackage,
			minify: options.minify || false,
			brandContext: context,
			dynamicTemplateLocation: currentWorkingDirectory
		};

		// Generate static assets
		// const compiledAssets = await renderer(renderConfig);

		// Write static assets to file
		await writeToDistFolder(distStructure);
	}

	// Validation passed
	if (distStructure && !config.publish) {
		reporter.success('compiling static assets', 'correct endpoints in place');
	}

	// Reset CLI reporting
	reporter.init('title');
}

/**
 * Write compiled CSS and JS to file
 * @async
 * @function createDistFiles
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config context package configuration
 * @param {Object} allToolkitPaths information on configured toolkits
 * @param {String} [reporting] level for reporting output from renderer
 * @return {Promise}
 */
async function createDistFiles(pathToPackage, config, allToolkitPaths, reporting) {
	const context = `@${config.scope}/${config.brandContextName}`;

	reporter.info('compiling static assets', 'creating dist folder and compiling from endpoints');
	await compileAssets(pathToPackage, {
		configuredBrands: config.configuredBrands,
		allToolkitPaths: allToolkitPaths,
		publish: true
	}, context, {
		minify: true,
		reporting: reporting
	});
}

/**
 * Check valid structure for compiled CSS and JS
 * @async
 * @function checkDistFiles
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config context package configuration
 * @param {Object} allToolkitPaths information on configured toolkits
 * @return {Promise}
 */
async function checkDistFiles(pathToPackage, config, allToolkitPaths) {
	reporter.info('compiling static assets', 'checking valid dist folder structure and endpoints');
	await compileAssets(pathToPackage, {
		configuredBrands: config.configuredBrands,
		allToolkitPaths: allToolkitPaths,
		publish: false
	});
}

module.exports = {
	createDistFiles,
	checkDistFiles
};
