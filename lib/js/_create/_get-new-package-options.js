/**
 * _get-new-package-options.js
 * Interactive prompt for package information
 */
'use strict';

const sanitize = require('sanitize-filename');
const validatePkgName = require('validate-npm-package-name');

/**
 * Enforce the correct prefix and sanitize
 * @private
 * @function prefixName
 * @param {String} prefix toolkit package prefix
 * @param {String} name new package name
 * @return {String}
 */
function prefixName(prefix, name) {
	prefix = (prefix) ? `${prefix}-` : '';
	if (sanitize(name).startsWith(prefix)) {
		return sanitize(name);
	}
	return `${prefix}${sanitize(name)}`;
}

/**
 * Make sure the name is valid
 * @private
 * @function checkValidName
 * @param {String} prefix toolkit package prefix
 * @param {Array} existingPackages list of existing packages
 * @param {String} name new package name
 * @return {String} returns true if valid (as per inquirer API)
 */
function checkValidName(prefix, existingPackages, name) {
	if (
		(prefix && name.length === (prefix.length + 1)) ||
		(!prefix && name.length === 0)
	) {
		return `Component is invalid: name is blank`;
	}

	if (prefix && name.startsWith(`${prefix}-${prefix}`)) {
		return `Component \`${name}\` is invalid. Must not contain the prefix name`;
	}

	if (checkPackageExists(existingPackages, name)) {
		return `Component \`${name}\` already exists`;
	}

	if (!validatePkgName(name).validForNewPackages) {
		return `Component \`${name}\` is not a valid NPM package name`;
	}

	return true;
}

/**
 * Get array of valid folders
 * @private
 * @function getValidFolders
 * @param {Object} folders names of valid folders
 * @return {Array}
 */
function getValidFolders(folders) {
	return (folders && Object.keys(folders).length > 0) ? Object.keys(folders) : [];
}

/**
 * Capitalize first letter of each word only
 * @private
 * @function capitalizeAuthorName
 * @param {String} name of the author
 * @return {String}
 */
function capitalizeAuthorName(name) {
	return sanitize(name).toLowerCase().replace(/(?:^|\s)\S/g, firstChar => {
		return firstChar.toUpperCase();
	});
}

/**
 * Does package already exist
 * @private
 * @function checkPackageExists
 * @param {Array} existingPackages list of existing packages
 * @param {String} name new package name
 * @return {Boolean}
 */
function checkPackageExists(existingPackages, name) {
	return existingPackages.includes(name);
}

/**
 * Generate list of questions about new package
 * @param {Object} config configuration options of the toolkit
 * @param {Array} existingPackages list of existing packages
 * @return {Array}
 */
module.exports = (config, existingPackages) => {
	const prompts = [
		{
			type: 'input',
			name: 'pkgname',
			message: 'What is the name of your new component:',
			filter: input => prefixName(config.prefix, input),
			validate: input => checkValidName(config.prefix, existingPackages, input)
		},
		{
			type: 'input',
			name: 'description',
			message: 'Write a short description of your new component:'
		},
		{
			type: 'input',
			name: 'author',
			message: 'Enter component author name:',
			filter: input => capitalizeAuthorName(input)
		}
	];
	const folders = [
		{
			type: 'checkbox',
			name: 'folders',
			message: 'Select which folders you are going to need:',
			choices: getValidFolders(config.folders),
			when: getValidFolders(config.folders).length > 0
		}
	];

	return (config.folders) ? prompts.concat(folders) : prompts;
};
