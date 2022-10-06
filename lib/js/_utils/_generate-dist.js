/**
 * _generate-dist.js
 * Compile code to distributable folder
 */
'use strict';

const compilePackageAssets = require('@springernature/util-package-renderer').compilePackageAssets;
const reporter = require('@springernature/util-cli-reporter');

const createDistStructure = require('./_create-dist-structure');

/**
 * Compile SCSS and JS
 * @async
 * @private
 * @function compileAssets
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @param {Object} options configuration options to pass to the renderer
 * @param {String} options.reporting level for reporting output from renderer
 * @param {Boolean} options.minify minify the js and css output
 * @param {Boolean} options.installDependencies install deps before compile
 * @param {Boolean} options.writeDistFiles write the files to disk
 * @return {Promise}
 */
async function compileAssets(pathToPackage, config, options) {
	let distStructure;

	// Create folder structure for compiled assets
	try {
		distStructure = await createDistStructure(pathToPackage, config);
	} catch (error) {
		reporter.fail('compiling assets', error.message, error.cause);
		throw error;
	}

	// Generate distributable from valid endpoints
	if (distStructure) {
		const renderConfig = {
			packageRoot: pathToPackage,
			reportingLevel: options.reporting,
			minify: options.minify,
			installDependencies: options.installDependencies,
			writeDistFiles: options.writeDistFiles,
			assetConfig: distStructure
		};

		// Generate static assets
		await compilePackageAssets(renderConfig);
	}

	// Reset CLI reporting
	reporter.init('title');
}

/**
 * Check valid structure and setup for compiled CSS and JS
 * @async
 * @function checkDistFiles
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @return {Promise}
 */
async function checkDistFiles(pathToPackage, config) {
	await compileAssets(pathToPackage, {
		configuredBrands: config.context.configuredBrands,
		allToolkitPaths: config.allToolkitPaths
	}, {
		minify: false,
		reporting: 'info',
		installDependencies: false,
		writeDistFiles: false
	});
}

/**
 * Write compiled CSS and JS to file
 * @async
 * @function createDistFiles
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @param {Object} options configuration options to pass to the renderer
 * @param {String} [options.reporting='info'] level for reporting output from renderer
 * @param {Boolean} [options.minify=false] minify the js and css output
 * @param {Boolean} [options.installDependencies=false] install deps before compile
 * @return {Promise}
 */
async function createDistFiles(pathToPackage, config, options) {
	await compileAssets(pathToPackage, {
		configuredBrands: config.context.configuredBrands,
		allToolkitPaths: config.allToolkitPaths,
		publish: true
	}, {
		reporting: options.reporting || 'info',
		minify: options.minify || false,
		installDependencies: options.installDependencies || false,
		writeDistFiles: true
	});
}

module.exports = {
	checkDistFiles,
	createDistFiles
};
