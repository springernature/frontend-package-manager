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

const publish = () => {};

module.exports = {
	setAuthToken,
	publish
};
