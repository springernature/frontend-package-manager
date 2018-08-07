/**
 * __tests__/unit/_utils/get-remote-file.js
 * Test: js/_utils/_get-remote-file.js
 */
'use strict';

const nock = require('nock');

const getRemoteFile = require('../../../lib/js/_utils/_get-remote-file');

describe('Getting contents of a remote file from a URL', () => {
	test('resolves with contents of a file', () => {
		nock('https://www.example.com')
			.get('/success')
			.reply(200, 'domain matched');

		expect.assertions(1);
		return expect(
			getRemoteFile('https://www.example.com/success', 'package')
		).resolves.toEqual('domain matched');
	});

	test('Rejects when file not found', () => {
		nock('https://www.example.com')
			.get('/notfound')
			.reply(404);

		expect.assertions(1);
		return expect(
			getRemoteFile('https://www.example.com/notfound', 'package')
		).rejects.toBeInstanceOf(Error);
	});

	test('Rejects when https.get errors', () => {
		nock('https://www.example.com')
			.get('/failure')
			.replyWithError(new Error());

		expect.assertions(1);
		return expect(
			getRemoteFile('https://www.example.com/failure', 'package')
		).rejects.toBeInstanceOf(Error);
	});

	afterEach(() => {
		nock.cleanAll();
	});
});
