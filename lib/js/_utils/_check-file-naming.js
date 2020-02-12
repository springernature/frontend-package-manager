/**
 * _get-file-naming.js
 * Check any enforced file naming based on context dependencies
 */
'use strict';

const reporter = require('@springernature/util-cli-reporter');

/**
 * We can enforce some folders to name files based on context dependencies
 * Folders can only contain files named after definitions in contextDependencies
 * @async
 * @function checkFileNaming
 * @param {Array} enforceContextFileNaming folders that enforce naming conventions
 * @return {Promise}
 */
async function checkFileNaming(enforceBrandFileNaming) {
	if (!enforceBrandFileNaming) {
		return;
	}

	console.log('checking');
}

module.exports = checkFileNaming;
