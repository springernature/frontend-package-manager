/**
 * _check-package-rendering.js
 * Check valid compilation of assets
 * Check valid demo folder creation
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');
const installPackageDependencies = require('@springernature/util-package-renderer').installPackageDependencies;

const checkDemoFolder = require('../_utils/_generate-demo').checkDemoFolder;
const checkDistFiles = require('../_utils/_generate-dist').checkDistFiles;

/**
 * Check valid structure for compiling assets and rendering the demo
 * @async
 * @function checkPackageRendering
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @return {Promise}
 */
async function checkPackageRendering(pathToPackage, config) {
	reporter.info('package rendering', 'checking valid asset endpoints and demo folder');
	await installPackageDependencies(pathToPackage);
	await checkDemoFolder(pathToPackage);
	await checkDistFiles(pathToPackage, config);
}

module.exports = checkPackageRendering;
