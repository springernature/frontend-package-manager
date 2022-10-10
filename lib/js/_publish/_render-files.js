/**
 * _render-files.js
 * Compile assets and publish to dist folder
 * Compile assets and templates and render as demo
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');
const installPackageDependencies = require('@springernature/util-package-renderer').installPackageDependencies;

const createDemoFile = require('../_utils/_generate-demo').createDemoFile;
const generateDist = require('../_utils/_generate-dist');

/**
 * Compile static context assets
 * @async
 * @function renderContext
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @return {Promise}
 */
async function renderContext(pathToPackage, config) {
	reporter.info('render files', 'compiling static assets to file');
	await generateDist.createContextDistFiles(pathToPackage, config, {
		minify: true,
		installDependencies: true
	});
}

/**
 * Compile static assets and render the demo
 * @async
 * @function renderPackage
 * @param {String} pathToPackage package path on filesystem
 * @param {Object} config package configuration
 * @return {Promise}
 */
async function renderPackage(pathToPackage, config) {
	reporter.info('render files', 'compiling static assets and rendering demo to file');
	await installPackageDependencies(pathToPackage);
	await createDemoFile(pathToPackage, {
		minify: true,
		installDependencies: false
	});
	await generateDist.createPackageDistFiles(pathToPackage, config, {
		minify: true,
		installDependencies: false
	});
}

module.exports = {
	renderContext,
	renderPackage
};
