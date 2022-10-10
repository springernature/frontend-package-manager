/**
 * _check-file-rendering.js
 * Check valid compilation of assets
 * Check valid demo folder creation
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');
const installPackageDependencies = require('@springernature/util-package-renderer').installPackageDependencies;

const checkDemoFolder = require('../_utils/_generate-demo').checkDemoFolder;
const generateDist = require('../_utils/_generate-dist');

/**
 * Check valid structure for compiling context assets
 * @async
 * @function checkContextFiles
 * @param {Object} config package configuration
 * @return {Promise}
 */
async function checkContextFiles(config) {
	reporter.info('render files', 'checking valid asset endpoints');
	await generateDist.checkContextDistFiles(config);
}

/**
 * Check valid structure for compiling assets and rendering the demo
 * @async
 * @function checkPackageFiles
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @return {Promise}
 */
async function checkPackageFiles(pathToPackage, config) {
	reporter.info('render files', 'checking valid asset endpoints and demo folder');
	await installPackageDependencies(pathToPackage);
	await checkDemoFolder(pathToPackage);
	await generateDist.checkPackageDistFiles(pathToPackage, config);
}

module.exports = {
	checkContextFiles,
	checkPackageFiles
};
