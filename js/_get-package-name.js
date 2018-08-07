/**
 * _get-package-name.js
 * Get the name of the package from the folder path
 */
'use strict';

const path = require('path');

const getPackageName = packagePath => packagePath.split(path.sep).slice(-1)[0];

module.exports = getPackageName;
