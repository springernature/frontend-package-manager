/**
 * _current-working-directory.js
 * The directory from which you invoked the node command
 * Allows this to be mocked for testing because of Jest issue with process
 * https://github.com/facebook/jest/issues/5146
 */
'use strict';

/**
 * @function currentWorkingDirectory
 * @return {String}
 */
const currentWorkingDirectory = () => process.cwd();

module.exports = currentWorkingDirectory;
