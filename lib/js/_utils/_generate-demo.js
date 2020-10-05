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
 * @param {String} [distFolder] optionally write index.html to this location
 * @return {Promise}
 */
async function demoCreation(pathToPackage, npmContext, reporting, distFolder) {
	const renderConfig = {
		demoCodeFolder: demoFolder,
		reportingLevel: reporting,
		packageRoot: pathToPackage,
		brandContext: npmContext,
		...(distFolder && {distFolderPath: distFolder})
	};

	// Check if demo folder exists
	try {
		await exists.directoryExists(path.join(pathToPackage, demoFolder));
	} catch (error) {
		reporter.warning('not found', `${demoFolder} folder`, 'cannot generate styleguide demo');
		return;
	}

	// Generate static html from demo code
	try {
		reporter.info(
			'demo folder found',
			(distFolder) ? 'creating static demo file' : 'checking code compilation'
		);
		await renderer(renderConfig);
	} catch (error) {
		reporter.fail('generating static demo', 'issue with the demo code');
		throw error;
	}
}

/**
 * Check that contents of demo folder compiles
 * @async
 * @function checkDemoFolder
 * @param {String} pathToPackage package path on filesystem
 * @param {String} brandContextName name of brand context on github
 * @param {String} scope package scope on NPM
 * @param {String} [reporting=info] CLI reporting level
 * @return {Promise}
 */
async function checkDemoFolder(pathToPackage, brandContextName, scope, reporting = 'info') {
	const npmContext = `@${scope}/${brandContextName}`;
	await demoCreation(pathToPackage, npmContext, reporting);
}

/**
 * Write generated index.html to file
 * @async
 * @function createDemoFile
 * @param {String} pathToPackage package path on filesystem
 * @param {String} brandContextName name of brand context on github
 * @param {String} scope package scope on NPM
 * @param {String} [reporting=info] CLI reporting level
 * @return {Promise}
 */
async function createDemoFile(pathToPackage, brandContextName, scope, reporting = 'info') {
	const npmContext = `@${scope}/${brandContextName}`;
	const distFolder = path.join(pathToPackage, demoFolder, 'dist');
	await demoCreation(pathToPackage, npmContext, reporting, distFolder);
}

module.exports = {
	checkDemoFolder,
	createDemoFile
};
