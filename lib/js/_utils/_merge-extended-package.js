/**
 * _merge-extended-package.js
 * Get contents of dependency package
 * Merge with contents of local package
 */
'use strict';

const path = require('path');
const fs = require('fs-extra');

const getRemoteFile = require('./_get-remote-file');
const showOutput = require('./_show-output');

function mergeExtendedPackage(extendedFileList, packagePath, name) {
	return new Promise((resolve, reject) => {
		const promises = [];
		const messages = [];

		extendedFileList.forEach(file => {
			const filePath = path.join(packagePath, file);

			try {
				fs.accessSync(filePath, fs.constants.F_OK);
			} catch (err) {
				const promise = getRemoteFile(`https://unpkg.com/${name}${file}`, name)
					.then(data => {
						fs.ensureDirSync(path.dirname(filePath));
						fs.writeFileSync(filePath, data);

						messages.push({
							type: 'info',
							description: `merging file from dependency`,
							message: file
						});
					}).catch(err => {
						reject(err);
					});
				promises.push(promise);
			}
		});

		Promise.all(promises).then(() => {
			showOutput.log(messages);
			resolve(name);
		});
	});
}

module.exports = mergeExtendedPackage;
