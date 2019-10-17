/**
 * __mocks__/npm-utils.js
 * Mock npm-utils
 */
'use strict';

async function setAuthToken(path) {
	if (path === 'path/to/fail') {
		throw new Error('setAuthToken fail');
	}
}

const publish = () => null;

module.exports = {
	setAuthToken,
	publish
};
