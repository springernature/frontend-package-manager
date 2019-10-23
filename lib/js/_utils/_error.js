#! /usr/bin/env node

/**
 * _error.js
 * Exit a script with an error
 * Used for breaking builds
 */
'use strict';

const PrettyError = require('pretty-error');

const pe = new PrettyError();

// Catch uncaught exceptions
process.once('uncaughtException', error => {
	const renderedError = pe.render(`Uncaught exception: ${error}`);
	console.log(renderedError);
	process.exit(1);
});

// Unhandled promise rejections
process.on('unhandledRejection', reason => {
	const renderedError = pe.render(`Unhandled rejection: ${reason}`);
	console.log(renderedError);
	process.exit(1);
});

module.exports = error => {
	const renderedError = pe.render(error);
	console.log(renderedError);
	process.exit(1);
};
