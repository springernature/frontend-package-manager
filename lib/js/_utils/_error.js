/**
 * _error.js
 * Exit a script with an error
 * Used for breaking builds
 */
'use strict';

var PrettyError = require('pretty-error');
var pe = new PrettyError();

// Catch uncaught exceptions
process.once('uncaughtException', err => {
	const renderedError = pe.render(`Uncaught exception: ${err}`);
	console.log(renderedError);
	process.exit(1);
});

module.exports = err => {
	const renderedError = pe.render(err);
	console.log(renderedError);
	process.exit(1);
};
