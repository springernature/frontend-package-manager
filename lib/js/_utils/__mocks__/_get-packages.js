/**
 * __mocks__/_get-packages.js
 * Mock the list of current packages
 */
'use strict';

function getPackages() {
	return [
		'path/to/global-package-a',
		'path/to/global-package-b'
	];
}

module.exports = getPackages;
