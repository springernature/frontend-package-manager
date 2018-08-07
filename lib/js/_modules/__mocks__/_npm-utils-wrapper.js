/**
 * __mocks__/npm-utils-wrapper.js
 * Mock npm-utils
 */
'use strict';

const q = require('q');

function setAuthToken(path) {
	const deferred = q.defer();
	if (path === 'path/to/fail') {
		deferred.reject();
	}
	deferred.resolve();
	return deferred.promise;
}

const publish = () => null;

module.exports = {
	setAuthToken,
	publish
};
