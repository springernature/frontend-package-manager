/**
 * _manage-context.js
 * Manage the handling of brand context packages
 */
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const getContextInfo = require('./_get-context-info');

/**
 * Check package has defined context for it's parent toolkit
 * @async
 * @function checkHasToolkitContext
 * @param {String} toolkit name of toolkit where package lives
 * @param {Array} contextDependencies names of all contexts defined for this package
 * @return {Promise}
 */
async function checkHasToolkitContext(toolkit, contextDependencies) {
	if (!contextDependencies.includes(toolkit)) {
		reporter.fail('missing context', 'must define a context for this package toolkit', toolkit);
		throw new Error(`missing context for the ${toolkit} toolkit`);
	}
}

/**
 * Check all contexts defined for a package
 * Must all be valid toolkit names
 * @async
 * @function checkAllValidContext
 * @param {Array} allToolkitNames names of all toolkits in repo
 * @param {Array} contextDependencies names of all contexts defined for this package
 * @return {Promise}
 */
async function checkAllValidContext(allToolkitNames, contextDependencies) {
	// All values from contextDependencies must exist in allToolkitNames
	if (!contextDependencies.every(i => allToolkitNames.includes(i))) {
		reporter.fail('invalid context', 'all context dependencies must map to a toolkit', allToolkitNames.join(', '));
		throw new Error(`one of these context dependencies does not map to a toolkit: ${contextDependencies.join(', ')}`);
	}
}

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
 * Check that brand contexts have been set up properly
 * @async
 * @function validate
 * @param {Array} allToolkitNames names of all toolkits in repo
 * @param {String} toolkit name of toolkit where package lives
 * @param {Object} scope package scope
 * @param {String} packagePath package to validate
 * @return {Promise}
 */
async function validate(allToolkitNames, toolkit, scope, packagePath) {
	const packageJsonPath = path.resolve(packagePath, 'package.json');
	const packageJson = require(packageJsonPath);
	const hasContext = Boolean(packageJson.contextDependencies);
	const contextInfo = {};

	// Extension status
	reporter.info('package has context defined', hasContext.toString(), (hasContext) ? Object.keys(packageJson.contextDependencies).join(', ') : '');

	// Early return if not contain context
	if (!hasContext || typeof packageJson.contextDependencies !== 'object') {
		return;
	}

	// Check package defines context for this toolkit
	await checkHasToolkitContext(toolkit, Object.keys(packageJson.contextDependencies));

	// Check all defined contexts are for valid toolkits
	await checkAllValidContext(allToolkitNames, Object.keys(packageJson.contextDependencies));

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
