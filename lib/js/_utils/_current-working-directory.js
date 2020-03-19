/**
 * _current-working-directory.js
 * Allow process.cwd() to be set on initialisation
 * Also allows this to be mocked for testing because of Jest issue with process
 * https://github.com/facebook/jest/issues/5146
 */
'use strict';

/**
 * @function currentWorkingDirectory
 * @return {String}
 */
const currentWorkingDirectory = () => process.cwd();

module.exports = currentWorkingDirectory;
