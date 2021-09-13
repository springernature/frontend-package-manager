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
 * @param {String} npmContext name of brand context on NPM
 * @param {String} [reporting=info] CLI reporting level
 * @param {Boolean} minify minify the js and css output
 * @param {String} [distFolder] optionally write index.html to this location
 * @return {Promise}
 */
// eslint-disable-next-line max-params
async function demoCreation(pathToPackage, npmContext, reporting, minify, distFolder) {
	const renderConfig = {
		demoCodeFolder: demoFolder,
		reportingLevel: reporting,
		packageRoot: pathToPackage,
		minify: minify,
		brandContext: npmContext,
		...(distFolder && {distFolderPath: distFolder})
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

	reporter.init('title'); // Reset CLI reporting
}

/**
 * Check that contents of demo folder compiles
 * @async
 * @function checkDemoFolder
 * @param {String} pathToPackage package path on filesystem
 * @param {String} brandContextName name of brand context on github
 * @param {String} scope package scope on NPM
 * @param {Boolean} minify minify the js and css output
 * @param {String} [reporting=info] CLI reporting level
 * @return {Promise}
 */
// eslint-disable-next-line max-params
async function checkDemoFolder(pathToPackage, brandContextName, scope, minify, reporting = 'info') {
	const npmContext = `@${scope}/${brandContextName}`;
	await demoCreation(pathToPackage, npmContext, reporting, minify);
}

/**
 * Write generated index.html to file
 * @async
 * @function createDemoFile
 * @param {String} pathToPackage package path on filesystem
 * @param {String} brandContextName name of brand context on github
 * @param {String} scope package scope on NPM
 * @param {Boolean} minify minify the js and css output
 * @param {String} [reporting=info] CLI reporting level
 * @return {Promise}
 */
// eslint-disable-next-line max-params
async function createDemoFile(pathToPackage, brandContextName, scope, minify = false, reporting = 'info') {
	const npmContext = `@${scope}/${brandContextName}`;
	const distFolder = path.resolve(pathToPackage, demoFolder, 'dist');
	await demoCreation(pathToPackage, npmContext, reporting, minify, distFolder);
}

module.exports = {
	checkDemoFolder,
	createDemoFile
};
