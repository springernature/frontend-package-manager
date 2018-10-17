/**
 * _build-new-package.js
 * Build new package structure in the packages folder
 */
'use strict';

const fs = require('fs');

const folderTasks = [];
const fileTasks = [];

let packageJsonContents;
let filePath;

// Create package.json file contents
function configurePackageJson(config, globalLicense, answers) {
	return JSON.stringify({
		name: `@${config.scope}/${answers.pkgname}`,
		version: '0.0.0',
		license: globalLicense,
		description: answers.description,
		keywords: [],
		author: answers.author
	}, null, 2);
}

// Generate a CSS directory structure
function createCSSDirectoryStructure(config, answers, value) {
	config.CSSDirectoryStructure[value].forEach(subfolder => {
		fs.mkdir(`${filePath}/${answers.pkgname}/${value}/${subfolder}`, err => {
			if (err) {
				console.error(err);
			}
		});
	});
}

// Create folders based on answers
function generateFolders(config, answers) {
	if (answers.folders) {
		for (const value of answers.folders) {
			folderTasks.push({
				title: `Create folder ${answers.pkgname}/${value}`,
				task: () => fs.mkdir(`${filePath}/${answers.pkgname}/${value}`, err => {
					if (err) {
						console.error(err);
					} else {
						fs.writeFile(`${filePath}/${answers.pkgname}/${value}/.gitkeep`, '// temporary file, delete as appropriate', err => {
							if (err) {
								console.error(err);
							}
						});
					}
				})
			});
			if (config.CSSDirectoryStructure && config.CSSDirectoryStructure[value]) {
				folderTasks.push({
					title: `Create sub-folder structure within ${answers.pkgname}/${value}`,
					task: () => createCSSDirectoryStructure(config, answers, value)
				});
			}
		}
	}

	return folderTasks;
}

// Create files based on required config
function generateFiles(config, answers) {
	for (const value of config.required) {
		if (value === 'package.json') {
			fileTasks.push({
				title: `Create file ${value}`,
				task: () => fs.writeFile(`${filePath}/${answers.pkgname}/${value}`, packageJsonContents, err => {
					if (err) {
						console.error(err);
					}
				})
			});
		} else {
			fileTasks.push({
				title: `Create file ${value}`,
				task: () => fs.writeFile(`${filePath}/${answers.pkgname}/${value}`, '', err => {
					if (err) {
						console.error(err);
					}
				})
			});
		}
	}

	return fileTasks;
}

module.exports = (config, globalLicense, packagesDirectory, answers) => {
	filePath = packagesDirectory;

	if (config.required && config.required.includes('package.json')) {
		packageJsonContents = configurePackageJson(config, globalLicense, answers);
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
		...generateFolders(config, answers),
		...generateFiles(config, answers)
	];
};
