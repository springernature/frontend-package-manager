/**
 * _add-files-to-package-json.js
 */
'use strict';

const fs = require('fs');

function addFilesToPackageJSON(path) {
	return new Promise((resolve, reject) => {
		try {
			fs.readFile(`${path}/package.json`, (err, data) => {
				const json = JSON.parse(data);
				json.files = ['scss', 'js', 'view', 'img'];
				fs.writeFile(`${path}/package.json`, JSON.stringify(json, null, 2), err => {
					if (err) {
						throw err;
					}
				});
			});
		} catch (err) {
			reject(err);
		}
	});
}

module.exports = addFilesToPackageJSON;
