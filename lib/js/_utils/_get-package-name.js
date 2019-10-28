/**
 * _get-package-name.js
 * Get the name of the package from the folder path
 */
'use strict';

const path = require('path');

/**
 * Get the name of a single package
 * @function getPackageName
 * @param {String} pathToPackage package path on filesystem
 * @return {String}
 */
const getPackageName = pathToPackage => pathToPackage.split(path.sep).slice(-1)[0];

module.exports = getPackageName;
