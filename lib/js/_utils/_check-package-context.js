/**
 * _check-package-context.js
 * Check correct use of brand context for packages
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const checkContextVersion = require('./_check-context-version');
const checkFileNaming = require('./_check-file-naming');

/**
 * Add build messaging at the publish step
 * @async
 * @function publish
 * @param {String} packagePath package to validate
 * @return {Promise}
 */
async function publish(packagePath) {
	const packageJsonPath = path.resolve(packagePath, 'package.json');
	const packageJson = require(packageJsonPath);
	const hasContext = Boolean(packageJson.contextDependencies);
	const whatPackage = `${packageJson.name}@${packageJson.version}`;

	// Extension status
	reporter.info('package has context', hasContext.toString(), (hasContext) ? Object.keys(packageJson.contextDependencies).join(', ') : '');

	// Early return if not contain context
	if (!hasContext || typeof packageJson.contextDependencies !== 'object') {
		return;
	}

	console.log('success');
}

/**
 * Check that brand context has been defined properly
 * @async
 * @function validate
 * @param {Object} config for the containing toolkit
 * @param {String} packagePath package to validate
 * @param {Array} brands list of all available brands
 * @param {String} brandContextName name of the brand context package
 * @return {Promise}
 */
async function validate(config, packagePath, brands, brandContextName) {
	const packageJsonPath = path.resolve(packagePath, 'package.json');
	const packageJson = require(packageJsonPath);
	const hasContext = Boolean(packageJson.brandContext);

	// Extension status
	reporter.info('package has context defined', hasContext.toString(), packageJson.brandContext);

	// Early return if not contain context
	if (!hasContext || typeof packageJson.brandContext !== 'string') {
		return;
	}

	// Check defined brand context matches version on NPM
	await checkContextVersion(config.scope, brandContextName, packageJson.brandContext);

	// Check any enforced file naming based on context
	await checkFileNaming(config.enforceBrandFileNaming, brands, packagePath);
}

module.exports = {
	validate,
	publish
};
