/**
 * _publish.js
 * Publish packages with a new version to NPM
 */
'use strict';

const checkCurrentVersion = require('./_check-current-version');
const extendPackage = require('./_extend-package');
const getPackages = require('./_get-packages');
const exitScript = require('./_exit-script');
const publishToNpm = require('./_publish-to-npm');

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
								exitScript.displayErr(err);
							});
					}).catch(err => {
						exitScript.displayErr(err);
					});
			})
			.catch(resolve);
	}).then(() => i >= (allPackagePaths.length - 1) || pathLoop(i + 1));
}

module.exports = configJson => {
	config = configJson;
	allPackagePaths = getPackages(config.packagesDirectory);

	if (!process.env.NPM_TOKEN) {
		exitScript.throwErr(
			'No NPM login token found\nPlease set the NPM_TOKEN environment variable'
		);
	}

	pathLoop(0);
};
