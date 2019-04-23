/**
 * _show-output.js
 * Log the colorized output
 */
'use strict';

const chalk = require('chalk');

// Return the output color configuration json
function getOuputConfig(desc) {
	return {
		description: chalk.magenta(desc),
		info: chalk.green('info'),
		success: chalk.green.bold('success'),
		fail: chalk.red.bold('fail')
	};
}

// Return the colorized output
function getConsoleOuput(json, type, msg) {
	return chalk.white(
		`${json[type]} ` +
		`${json.description} ` +
		`${msg}`
	);
}

// Log each message to console
function log(arr) {
	for (const result of arr) {
		const config = getOuputConfig(result.description);
		console.log(getConsoleOuput(config, result.type, result.message));
	}
}

module.exports = {
	log,
	getOuputConfig,
	getConsoleOuput
};
