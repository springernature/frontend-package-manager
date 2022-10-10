/**
 * _generate-dist.js
 * Compile code to distributable folder
 */
'use strict';

const compilePackageAssets = require('@springernature/util-package-renderer').compilePackageAssets;
const reporter = require('@springernature/util-cli-reporter');

const createPackageDistStructure = require('./_create-package-dist-structure');
const createContextDistStructure = require('./_create-context-dist-structure');

/**
 * Compile SCSS and JS
 * @async
 * @private
 * @function compileAssets
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @param {Array} config.configuredBrands configured brands
 * @param {Object} config.allToolkitPaths information on configured toolkits
 * @param {Boolean} config.publish are we writing the files to disk
 * @param {Boolean} config.compileContext are we compiling the brand context assets
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
		// eslint-disable-next-line unicorn/prefer-ternary
		if (config.compileContext) {
			// Create dist structure for context
			distStructure = await createContextDistStructure(pathToPackage, config);
		} else {
			// Create dist structure for package
			distStructure = await createPackageDistStructure(pathToPackage, config);
		}
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
 * Check valid package structure and setup for compiled CSS and JS
 * @async
 * @function checkPackageDistFiles
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @return {Promise}
 */
async function checkPackageDistFiles(pathToPackage, config) {
	await compileAssets(pathToPackage, {
		configuredBrands: config.context.configuredBrands,
		allToolkitPaths: config.allToolkitPaths,
		publish: false
	}, {
		minify: false,
		reporting: 'info',
		installDependencies: false,
		writeDistFiles: false
	});
}

/**
 * Check valid context structure and setup for compiled CSS and JS
 * @async
 * @function checkContextDistFiles
 * @param {Object} config context package configuration
 * @return {Promise}
 */
async function checkContextDistFiles(config) {
	await compileAssets(config.context.path, {
		configuredBrands: config.context.configuredBrands,
		publish: false,
		compileContext: true
	}, {
		minify: false,
		reporting: 'info',
		installDependencies: true,
		writeDistFiles: false
	});
}

/**
 * Write compiled CSS and JS to file
 * @async
 * @function createPackageDistFiles
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @param {Object} options configuration options to pass to the renderer
 * @param {String} [options.reporting='info'] level for reporting output from renderer
 * @param {Boolean} [options.minify=false] minify the js and css output
 * @param {Boolean} [options.installDependencies=false] install deps before compile
 * @return {Promise}
 */
async function createPackageDistFiles(pathToPackage, config, options) {
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

/**
 * Write compiled CSS and JS to file
 * @async
 * @function createContextDistFiles
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @param {Object} options configuration options to pass to the renderer
 * @param {String} [options.reporting='info'] level for reporting output from renderer
 * @param {Boolean} [options.minify=false] minify the js and css output
 * @param {Boolean} [options.installDependencies=false] install deps before compile
 * @return {Promise}
 */
async function createContextDistFiles(config, options) {
	await compileAssets(config.context.path, {
		configuredBrands: config.context.configuredBrands,
		publish: true,
		compileContext: true
	}, {
		reporting: options.reporting || 'info',
		minify: options.minify || false,
		installDependencies: options.installDependencies || false,
		writeDistFiles: true
	});
}

module.exports = {
	checkPackageDistFiles,
	checkContextDistFiles,
	createPackageDistFiles,
	createContextDistFiles
};
