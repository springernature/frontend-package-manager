/**
 * _check-publication.js
 * Check the conditions for publishing a package on CI
 * If the package.json version has been incremented:
 * MUST update package.json
 * MUST update changelog
 */
'use strict';

const checkCurrentVersion = require('../_utils/_check-current-version');
const checkFiles = require('./_check-changed-files');

/**
 * Check that a package validates for publication
 * @async
 * @function checkPublicationConditions
 * @param {Boolean} validatePublication validate this package for publication
 * @param {String} pathToPackage package path on filesystem
 * @param {String} changelog name of the changelog file
 * @return {Promise}
 */
async function checkPublicationConditions(validatePublication, pathToPackage, changelog) {
	if (!validatePublication) {
		return;
	}

	if (!process.env.CHANGED_FILES) {
		throw new Error('`CHANGED_FILES` not found. Please make sure this is running on CI');
	}

	if (await checkCurrentVersion(pathToPackage)) {
		await checkFiles(pathToPackage, process.env.CHANGED_FILES, changelog);
	}
}

module.exports = checkPublicationConditions;
