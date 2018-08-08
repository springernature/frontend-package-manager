/**
 * _publish.js
 * Publish packages with a new version to NPM
 */
'use strict';

const checkCurrentVersion = require('./_utils/_check-current-version');
const extendPackage = require('./_utils/_extend-package');
const getPackages = require('./_utils/_get-packages');
const error = require('./_utils/_error');

const publishToNpm = require('./_modules/_publish-to-npm');

let config;
let allPackagePaths;

// Loop through all packages
function pathLoop(i) {
	new Promise(resolve => {
		checkCurrentVersion(allPackagePaths[i])
			.then(() => {
				extendPackage.publish(config.scope, allPackagePaths[i])
					.then(() => {
						publishToNpm({access: 'public'}, allPackagePaths[i])
							.then(resolve)
							.catch(err => {
								error(err);
							});
					}).catch(err => {
						error(err);
					});
			})
			.catch(resolve);
	}).then(() => i >= (allPackagePaths.length - 1) || pathLoop(i + 1));
}

module.exports = configJson => {
	config = configJson;
	allPackagePaths = getPackages(config.packagesDirectory);

	if (!process.env.NPM_TOKEN) {
		error(new Error('No NPM login token found.Please set the `NPM_TOKEN` environment variable'));
	}

	pathLoop(0);
};
