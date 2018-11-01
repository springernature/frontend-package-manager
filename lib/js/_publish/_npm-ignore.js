// if there is no .npmignore file, create an .npmignore file

'use strict';

const {promisify} = require('util');
const fs = require('fs');

const writeFileAsync = promisify(fs.writeFile);
const accessAsync = promisify(fs.access);

const stuffToIgnore = `__tests__ \n`;

function npmIgnore(path) {
	return accessAsync(`${path}/.npmignore`, fs.constants.F_OK)
		.catch(() => writeFileAsync(`${path}/.npmignore`, stuffToIgnore));
}

module.exports = npmIgnore;
