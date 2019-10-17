/**
 * __mocks__/npm-utils.js
 * Mock npm-utils
 */
'use strict';

function setAuthToken(path) {
	return new Promise((resolve, reject) => {
		if (path === 'path/to/fail') {
			reject();
		}
		resolve();
	});
}

const publish = () => null;

module.exports = {
	setAuthToken,
	publish
};
