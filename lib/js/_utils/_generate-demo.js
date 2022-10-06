/**
 * _generate-demo.js
 * Generate a static demo file for use in the styleguide
 */
'use strict';

const path = require('path');
const renderer = require('@springernature/util-package-renderer').renderDemo;
const reporter = require('@springernature/util-cli-reporter');

const exists = require('./_check-exists');

// Name of the demo folder
const demoFolder = 'demo';

/**
 * Compile static html from demo code
 * @async
 * @private
 * @function demoCreation
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} options configuration options to pass to the renderer
 * @param {String} options.reporting level for reporting output from renderer
 * @param {Boolean} options.minify minify the js and css output
 * @param {Boolean} options.installDependencies install deps before compile
 * @param {String} options.distFolder optionally write index.html to this location
 * @return {Promise}
 */
async function demoCreation(pathToPackage, options) {
	const currentWorkingDirectory = require('../_utils/_current-working-directory')();
	const renderConfig = {
		demoCodeFolder: demoFolder,
		packageRoot: pathToPackage,
		dynamicTemplateLocation: currentWorkingDirectory,
		reportingLevel: options.reporting,
		minify: options.minify,
		installDependencies: options.installDependencies,
		...(options.distFolder && {distFolderPath: options.distFolder})
	};

	// Check if demo folder exists
	try {
		await exists.directoryExists(path.join(pathToPackage, demoFolder));
	} catch {
		reporter.warning(
			'not found',
			`${demoFolder} folder`,
			path.relative(
				process.cwd(),
				path.join(pathToPackage, demoFolder)
			)
		);
		return;
	}

	// Generate static html from demo code
	await renderer(renderConfig);

	// Reset CLI reporting
	reporter.init('title');
}

/**
 * Check that contents of demo folder compiles
 * @async
 * @function checkDemoFolder
 * @param {String} pathToPackage package path on filesystem
 * @return {Promise}
 */
async function checkDemoFolder(pathToPackage) {
	await demoCreation(pathToPackage, {
		reporting: 'info',
		minify: false,
		installDependencies: false
	});
}

/**
 * Write generated index.html to file
 * @async
 * @function createDemoFile
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} options renderer configuration
 * @param {String} [options.reporting='info'] level for reporting output from renderer
 * @param {Boolean} [options.minify=false] minify the js and css output
 * @param {Boolean} [options.installDependencies=false] install deps before compile
 * @return {Promise}
 */
async function createDemoFile(pathToPackage, options) {
	await demoCreation(pathToPackage, {
		reporting: options.reporting || 'info',
		minify: options.minify || false,
		installDependencies: options.installDependencies || false,
		distFolder: path.resolve(pathToPackage, demoFolder, 'dist')
	});
}

module.exports = {
	checkDemoFolder,
	createDemoFile
};
