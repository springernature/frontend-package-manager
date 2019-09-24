/**
 * _merge-extended-package.js
 * Get contents of dependency package
 * Merge with contents of local package
 */
'use strict';

const path = require('path');

const fs = require('fs-extra');
const reporter = require('@springernature/util-cli-reporter');

const getRemoteFile = require('./_get-remote-file');

function mergeExtendedPackage(extendedFileList, packagePath, name) {
	return new Promise((resolve, reject) => {
		const promises = [];

		extendedFileList.forEach(file => {
			const filePath = path.join(packagePath, file);

			try {
				fs.accessSync(filePath, fs.constants.F_OK);
			} catch (err) {
				const promise = getRemoteFile(`https://cdn.jsdelivr.net/npm/${name}${file}`)
					.then(data => {
						fs.ensureDirSync(path.dirname(filePath));
						fs.writeFileSync(filePath, data);
						reporter.info('merging file from dependency', file);
					}).catch(err => reject(err));

				promises.push(promise);
			}
		});

		Promise.all(promises).then(() => {
			resolve(name);
		});
	});
}

module.exports = mergeExtendedPackage;
