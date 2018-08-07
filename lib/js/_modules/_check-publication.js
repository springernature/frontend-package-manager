/**
 * _check-publication.js
 * Check the conditions for publishing a package on CI
 * If the package.json version has been incremented:
 * MUST update package.json
 * MUST update changelog
 */
'use strict';

const error = require('../_utils/_error');
const checkCurrentVersion = require('../_utils/_check-current-version');

const checkFiles = require('./_check-changed-files');

function checkPublicationConditions(validatePublication, path, changelog) {
	return new Promise((resolve, reject) => {
		if (!validatePublication) {
			resolve();
			return;
		}

		if (!process.env.CHANGED_FILES) {
			error(new Error('`CHANGED_FILES` not found\nPlease make sure this is running on CI'));
		}

		checkCurrentVersion(path)
			.then(() => {
				checkFiles(path, process.env.CHANGED_FILES, changelog)
					.then(resolve)
					.catch(err => {
						reject(err);
					});
			})
			.catch(resolve);
	});
}

module.exports = checkPublicationConditions;
