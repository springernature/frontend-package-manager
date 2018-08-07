/**
 * _get-packages.js
 * Get a list of all packages in `frontend-global-toolkit`
 */
'use strict';

const fs = require('fs');
const path = require('path');

function getPackages(dir) {
	return fs
		.readdirSync(dir)
		.map(file => path.resolve(dir, file))
		.filter(f => fs.lstatSync(path.resolve(f)).isDirectory());
}

module.exports = getPackages;
