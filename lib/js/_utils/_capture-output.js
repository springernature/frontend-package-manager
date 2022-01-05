/**
 * _capture-output.js
 * Capture third-party output and format
 */
'use strict';

const capcon = require('capture-console');
const stripAnsi = require('strip-ansi');

let output = {
	out: '',
	err: ''
};

/**
 * Clear captured logs
 * @function clear
 */
function clear() {
	output = {
		out: '',
		err: ''
	};
}

/**
 * Strip Ansi color formats and return length of string
 * @function getLength
 * @param {String} text the raw text to check
 * @return {Promise<Integer>}
 */
function getLength(text) {
	return stripAnsi(text).length;
}

/**
 * Format captured output line by line
 * @function log
 */
function log() {
	// Each of out and err
	for (const key of Object.keys(output)) {
		const lines = output[key].split('\n');

		// Each line of the output
		for (const line of lines) {
			const lineLength = getLength(line);

			// Log non-blank lines
			if (lineLength > 0) {
				console.log('  \u203A', line);
			}
		}
	}

	// Clear logs
	clear();
}

/**
 * Start intercepting stdout and stderr
 * @function start
 */
function start() {
	capcon.startIntercept(process.stdout, stdout => {
		output.out += stdout;
	});

	capcon.startIntercept(process.stderr, stderr => {
		output.err += stderr;
	});
}

/**
 * Stop intercepting stdout and stderr
 * @function stop
 */
function stop() {
	capcon.stopIntercept(process.stdout);
	capcon.stopIntercept(process.stderr);
}

module.exports = {
	start,
	stop,
	log,
	clear
};
