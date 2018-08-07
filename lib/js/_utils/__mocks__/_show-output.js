/**
 * __mocks__/_show-output.js
 * Mock output
 * Bypasses issue in fs-mock
 */
'use strict';

const chalk = require('chalk');

// Unmocked
function getOuputConfig(desc) {
	return {
		description: chalk.magenta(desc),
		info: chalk.green('info'),
		success: chalk.green.bold('success'),
		fail: chalk.red('fail')
	};
}

// Unmocked
function getConsoleOuput(json, type, msg) {
	return chalk.white(
		`${json[type]} ` +
		`${json.description} ` +
		`${msg}`
	);
}

// Kill console logging
const log = () => null;

module.exports = {
	log,
	getOuputConfig,
	getConsoleOuput
};
