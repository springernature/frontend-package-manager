/**
 * _glob-wrapper.js
 * Wrapper for glob NPM package
 * Enables mocking within monorepo using Jest
 */
'use strict';

const glob = require('glob');

function globWrapper(pattern, options, cb) {
	glob(pattern, options, cb);
}

module.exports = globWrapper;
