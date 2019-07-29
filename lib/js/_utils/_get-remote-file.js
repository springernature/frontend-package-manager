/**
 * _get-remote-file.js
 * Get the contents of a remote file
 * Used to get package contents from https://unpkg.com/
 * HTTPS only
 */
'use strict';

const https = require('https');

function getRemoteFile(url) {
	return new Promise((resolve, reject) => {
		const request = https.get(url, response => {
			const body = [];

			if (response.statusCode < 200 || response.statusCode > 399) {
				reject(new Error(`${response.statusCode}: ${url}`));
			}

			response.on('data', chunk => body.push(chunk));
			response.on('end', () => resolve(body.join('')));
		});

		// handle connection errors of the request
		request.on('error', err => reject(err));
	});
}

module.exports = getRemoteFile;
