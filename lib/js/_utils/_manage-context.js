/**
 * _manage-context.js
 * Manage the handling of brand context packages
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const getContextInfo = require('./_get-context-info');

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

	// Early return if not extended package
	if (!hasContext) {
		return;
	}

	console.log('success');
}

/**
 * Check that brand contexts have been set up properly
 * @async
 * @function validate
 * @param {Object} scope package scope
 * @param {String} packagePath package to validate
 * @return {Promise}
 */
async function validate(scope, packagePath) {
	const packageJsonPath = path.resolve(packagePath, 'package.json');
	const packageJson = require(packageJsonPath);
	const hasContext = Boolean(packageJson.contextDependencies);
	const contextInfo = {};

	// Extension status
	reporter.info('package has context', hasContext.toString(), (hasContext) ? Object.keys(packageJson.contextDependencies).join(', ') : '');

	// Early return if not extended package
	if (!hasContext) {
		return;
	}

	// Validate context dependencies
	for (const context of Object.keys(packageJson.contextDependencies)) {
		contextInfo[context] = await getContextInfo(scope, context, packageJson.contextDependencies[context]);
	}

	console.log(contextInfo);
}

module.exports = {
	validate,
	publish
};
