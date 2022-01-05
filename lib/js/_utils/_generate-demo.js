/**
 * _generate-demo.js
 * Generate a statci demo file for use in the styleguide
 */
'use strict';

const path = require('path');
const renderer = require('@springernature/util-package-renderer');
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
 * @param {String} context name of brand context on NPM
 * @param {Boolean} minify minify the js and css output
 * @param {Object} options configuration options to pass to the renderer
 * @param {Boolean} [options.reporting=info] level for reporting output from renderer
 * @param {String} [options.distFolder] optionally write index.html to this location
 * @return {Promise}
 */
async function demoCreation(pathToPackage, context, options) {
	const currentWorkingDirectory = require('../_utils/_current-working-directory')();
	const renderConfig = {
		demoCodeFolder: demoFolder,
		reportingLevel: options.reporting || 'info',
		packageRoot: pathToPackage,
		minify: options.minify,
		brandContext: context,
		dynamicTemplateLocation: currentWorkingDirectory,
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
 * @param {String} config context package configuration
 * @return {Promise}
 */
async function checkDemoFolder(pathToPackage, config) {
	const context = `@${config.scope}/${config.brandContextName}`;
	await demoCreation(pathToPackage, context, {minify: false});
}

/**
 * Write generated index.html to file
 * @async
 * @function createDemoFile
 * @param {String} pathToPackage package path on filesystem
 * @param {String} config context package configuration
 * @param {String} reporting level for reporting output from renderer
 * @param {Boolean} [minify=false] minify the js and css output
 * @return {Promise}
 */
async function createDemoFile(pathToPackage, config, reporting, minify) {
	const context = `@${config.scope}/${config.brandContextName}`;
	const distFolder = path.resolve(pathToPackage, demoFolder, 'dist');
	await demoCreation(pathToPackage, context, {
		minify: minify,
		reporting: reporting,
		distFolder: distFolder
	});
}

module.exports = {
	checkDemoFolder,
	createDemoFile
};
