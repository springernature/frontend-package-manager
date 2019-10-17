/**
 * _build-new-package.js
 * Build new package structure in the packages folder
 */
'use strict';

const fs = require('fs');
const path = require('path');

let packageJsonContents;
let filePath;

/**
 * Create package.json file contents
 * @private
 * @function configurePackageJson
 * @param {String} scope toolkit details
 * @param {String} globalLicense the repository license
 * @param {Object} answers new package information
 * @return {String}
 */
function configurePackageJson(scope, globalLicense, answers) {
	return JSON.stringify({
		name: `@${scope}/${answers.pkgname}`,
		version: '0.0.0',
		license: globalLicense,
		description: answers.description,
		keywords: [],
		author: answers.author
	}, null, 2);
}

/**
 * Generate a CSS directory structure
 * @private
 * @function createCSSDirectoryStructure
 * @param {Array} subFolders all the sub-folders to create
 * @param {Object} answers new package information
 * @param {String} parentFolder where to create the sub-folders
 * @return {String}
 */
function createCSSDirectoryStructure(subFolders, answers, parentFolder) {
	subFolders.forEach(subFolder => {
		fs.mkdir(`${filePath}/${answers.pkgname}/${parentFolder}/${subFolder}`, err => {
			if (err) {
				console.error(err);
			}
		});
	});
}

/**
 * Create folders based on answers
 * @private
 * @function generateFolders
 * @param {Object} cssFolders folder structure for CSS
 * @param {Object} answers new package information
 * @return {Array}
 */
function generateFolders(cssFolders, answers) {
	const folderTasks = [];

	if (answers.folders) {
		for (const folder of answers.folders) {
			folderTasks.push({
				title: `Create folder ${answers.pkgname}/${folder}`,
				task: () => fs.mkdir(`${filePath}/${answers.pkgname}/${folder}`, err => {
					if (err) {
						console.error(err);
					} else {
						fs.writeFile(`${filePath}/${answers.pkgname}/${folder}/.gitkeep`, '// temporary file, delete as appropriate', err => {
							if (err) {
								console.error(err);
							}
						});
					}
				})
			});
			if (cssFolders && cssFolders[folder]) {
				folderTasks.push({
					title: `Create sub-folder structure within ${answers.pkgname}/${folder}`,
					task: () => createCSSDirectoryStructure(cssFolders[folder], answers, folder)
				});
			}
		}
	}

	return folderTasks;
}

/**
 * Create files based on required config
 * @private
 * @function generateFiles
 * @param {Array} requiredFiles all required files for a package
 * @param {Object} answers new package information
 * @return {Array}
 */
function generateFiles(requiredFiles, answers) {
	const fileTasks = [];

	for (const file of requiredFiles) {
		if (file === 'package.json') {
			fileTasks.push({
				title: `Create file ${answers.pkgname}/${file}`,
				task: () => fs.writeFile(`${filePath}/${answers.pkgname}/${file}`, packageJsonContents, err => {
					if (err) {
						console.error(err);
					}
				})
			});
		} else {
			fileTasks.push({
				title: `Create file ${answers.pkgname}/${file}`,
				task: () => fs.writeFile(`${filePath}/${answers.pkgname}/${file}`, '', err => {
					if (err) {
						console.error(err);
					}
				})
			});
		}
	}

	return fileTasks;
}

/**
 * Generate list of tasks for package creation
 * @param {Object} config configuration options of the toolkit
 * @param {String} basePath location of the toolkit
 * @param {String} globalLicense the repository license
 * @param {Object} answers new package information
 * @return {Array}
 */
module.exports = (config, basePath, globalLicense, answers) => {
	filePath = path.resolve(process.cwd(), basePath, config.packagesDirectory);

	if (config.required && config.required.includes('package.json')) {
		packageJsonContents = configurePackageJson(config.scope, globalLicense, answers);
	}

	return [
		{
			title: `Create folder ${answers.pkgname}`,
			task: () => fs.mkdir(`${filePath}/${answers.pkgname}`, err => {
				if (err) {
					console.error(err);
				}
			})
		},
		...generateFolders(config.CSSDirectoryStructure, answers),
		...generateFiles(config.required, answers)
	];
};
