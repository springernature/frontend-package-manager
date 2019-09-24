/**
 * _get-remote-file.js
 * Get the contents of a remote file
 * HTTPS only
 */
'use strict';

const chalk = require('chalk');
const got = require('got');
const reporter = require('@springernature/util-cli-reporter');

// Number of times to retry request
const maxRetry = 2;

// Request configuration options
const config = {
	retry: {
		retries: maxRetry,
		statusCodes: new Set([404, 408, 413, 429, 500, 502, 503, 504]),
		errorCodes:
			new Set([
				'ETIMEDOUT',
				'ECONNRESET',
				'EADDRINUSE',
				'ECONNREFUSED',
				'EPIPE',
				'ENOTFOUND',
				'ENETUNREACH',
				'EAI_AGAIN'
			])
	},
	hooks: {
		beforeRetry: [
			(options, error, retryCount) => {
				reporter.fail('request', options.href);
				reporter.info(`${generateErrorMessage(error)}`, '');
				reporter.info('retrying', `(${retryCount}/${maxRetry})`);
			}
		]
	}
};

/**
 * Generate an error message based on error type
 * @param {Object} error the error object from the request
 * @return {String}
 */
function generateErrorMessage(error) {
	switch (error.name) {
		case 'RequestError':
			return `request failed with ${error.code}`;
		case 'ParseError':
		case 'HTTPError':
		case 'MaxRedirectsError':
			return `${error.statusCode} ${chalk.white(error.statusMessage)}`;
		default:
			return `Uh-oh Something went wrong`;
	}
}

/**
 * Get contents of a file from a URL
 * Retry on failure <maxRetry>
 * @param {String} url the request
 * @return {Promise<Object>}
 */
function getRemoteFile(url) {
	return new Promise((resolve, reject) => {
		got(url, config)
			.then(response => resolve(response.body))
			.catch(error => {
				reporter.fail('request', url);
				reject(new Error(`${generateErrorMessage(error)}`));
			});
	});
}

module.exports = getRemoteFile;
