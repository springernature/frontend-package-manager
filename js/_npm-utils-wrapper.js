/**
 * _npm-utils-wrapper.js
 * Wrapper for npm-utils NPM package
 * Enables mocking within monorepo using Jest
 */
'use strict';

const npm = require('npm-utils');

function npmSetAuthToken(path) {
	return new Promise((resolve, reject) => {
		npm.setAuthToken(path)
			.then(() => {
				resolve();
			}, () => {
				reject();
			});
	});
}

function npmPublish(config) {
	return new Promise((resolve, reject) => {
		npm.publish(config)
			.then(() => {
				resolve();
			}, () => {
				reject();
			});
	});
}

module.exports = {
	setAuthToken: npmSetAuthToken,
	publish: npmPublish
};
