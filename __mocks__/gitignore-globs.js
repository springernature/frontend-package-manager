/**
 * __mocks__/gitignore-globs.js
 * Mock returning entry from a .gitignore files
 */
'use strict';

module.exports = () => {
	return ['**/folder3', '**/folder3/**', '**/packages/**/package-lock.json'];
};
