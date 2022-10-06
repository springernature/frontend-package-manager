/**
 * _render-package.js
 * Compile assets and publish to dist folder
 * Compile assets and templates and render as demo
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');
const installPackageDependencies = require('@springernature/util-package-renderer').installPackageDependencies;

const createDemoFile = require('../_utils/_generate-demo').createDemoFile;
const createDistFiles = require('../_utils/_generate-dist').createDistFiles;

/**
 * Compile static assets and render the demo
 * @async
 * @function renderPackage
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @return {Promise}
 */
async function renderPackage(pathToPackage, config) {
	reporter.info('package rendering', 'compiling static assets and rendering demo to file');
	await installPackageDependencies(pathToPackage);
	await createDemoFile(pathToPackage, {
		minify: true,
		installDependencies: false
	});
	await createDistFiles(pathToPackage, config, {
		minify: true,
		installDependencies: false
	});
}

module.exports = renderPackage;
