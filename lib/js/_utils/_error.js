/**
 * _error.js
 * Exit a script with an error
 * Used for breaking builds
 */
'use strict';

// Catch uncaught exceptions
process.once('uncaughtException', err => {
	console.log(`Uncaught exception:\n${err}`);
	process.exit(1);
});

// Display error and exit
function displayErr(err) {
	console.log(err);
	process.exit(1);
}

// Throw error and exit
function throwErr(err) {
	process.exitCode = 1;
	throw new Error(err);
}

module.exports = {
	displayErr,
	throwErr
};
