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
	}, undefined, 2);
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
	for (const subFolder of subFolders) {
		fs.mkdir(`${filePath}/${answers.pkgname}/${parentFolder}/${subFolder}`, error => {
			if (error) {
				console.error(error);
			}
		});
	}
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
			// If the folder has sub-folders create those as well
			if (cssFolders && cssFolders[folder]) {
				folderTasks.push({
					title: `Create folder ${answers.pkgname}/${folder}`,
					task: () => {
						// Create the parent folder
						// Make sure it exists before processing next task
						try {
							fs.mkdirSync(`${filePath}/${answers.pkgname}/${folder}`);
						} catch (error) {
							console.error(error);
						}
					}
				},
				{
					title: `Create sub-folder structure within ${answers.pkgname}/${folder}`,
					task: () => createCSSDirectoryStructure(cssFolders[folder], answers, folder)
				});
			} else {
				folderTasks.push({
					title: `Create folder ${answers.pkgname}/${folder}`,
					task: () => fs.mkdir(`${filePath}/${answers.pkgname}/${folder}`, error => {
						if (error) {
							console.error(error);
						}
					})
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
				test: packageJsonContents,
				task: () => fs.writeFile(`${filePath}/${answers.pkgname}/${file}`, packageJsonContents, error => {
					if (error) {
						console.error(error);
					}
				})
			});
		} else {
			fileTasks.push({
				title: `Create file ${answers.pkgname}/${file}`,
				task: () => fs.writeFile(`${filePath}/${answers.pkgname}/${file}`, '', error => {
					if (error) {
						console.error(error);
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
	filePath = path.join(basePath, config.packagesDirectory);

	if (config.required && config.required.includes('package.json')) {
		packageJsonContents = configurePackageJson(config.scope, globalLicense, answers);
	}

	return [
		{
			title: `Create folder ${answers.pkgname}`,
			task: () => {
				// Create the package folder
				// Make sure it exists before processing next task
				try {
					fs.mkdirSync(`${filePath}/${answers.pkgname}`);
				} catch (error) {
					console.error(error);
				}
			}
		},
		...generateFolders(config.CSSDirectoryStructure, answers),
		...generateFiles(
			[...config.required, config.changelog],
			answers
		)
	];
};
