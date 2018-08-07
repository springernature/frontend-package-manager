/**
 * _check-current-version.js
 * Update by comparing NPM version and package.json version
 */
'use strict';

const semver = require('semver');
const chalk = require('chalk');
const getLatestVersion = require('./_get-latest-version');
const checkNewVersion = require('./_check-new-version');
const showOutput = require('./_show-output');
const exitScript = require('./_exit-script');

// Return array of objects containing output json
function getResultsOutput(latest, newVersion, publishNewVersion) {
	return [
		{
			type: 'info',
			description: 'published version',
			message: latest
		},
		{
			type: 'info',
			description: 'package.json version',
			message: newVersion
		},
		{
			type: 'info',
			description: 'update package',
			message: publishNewVersion
		}
	];
}

// Return a promise based on if we need to publish a new version
function checkCurrentVersion(packagePath) {
	return new Promise((resolve, reject) => {
		const pkg = require(`${packagePath}/package.json`);
		const newVersion = checkNewVersion(pkg);

		showOutput.log([{
			type: 'info',
			description: 'checking package',
			message: chalk.blue(pkg.name)
		}]);

		if (newVersion === '0.0.0') {
			showOutput.log([{
				type: 'info',
				description: 'unpublished',
				message: 'version is 0.0.0'
			}]);
			reject();
			return;
		}

		getLatestVersion(pkg.name.replace(/\//g, '%2F'))
			.then(latest => {
				const publishNewVersion = (latest) ? semver.gt(newVersion, latest) : true;

				showOutput.log(
					getResultsOutput(latest, newVersion, publishNewVersion)
				);

				if (publishNewVersion) {
					resolve();
				} else {
					reject();
				}
			}).catch(err => {
				exitScript.displayErr(err);
			});
	});
}

module.exports = checkCurrentVersion;

