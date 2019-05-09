/**
 * __tests__/unit/_publish/publish-package.js
 * Test: js/_publish/_publish-package.js
 */
'use strict';

const mockspawn = require('mock-spawn');

const mySpawn = mockspawn();
require('child_process').spawn = mySpawn;
mySpawn.sequence.add(mySpawn.simple(0));
mySpawn.sequence.add(function (cb) {
	this.emit('error', new Error('spawn ENOENT'));
});
mySpawn.sequence.add(mySpawn.simple(1));

const publish = require('../../../lib/js/_publish/_publish-package');

describe('Publish a package to NPM', () => {
	test('Successfully publish package', () => {
		expect.assertions(1);
		return expect(
			publish()
		).resolves.toEqual();
	});

	test('Error publishing package', () => {
		expect.assertions(1);
		return expect(
			publish()
		).rejects.toBeInstanceOf(Error);
	});

	test('Exit publishing with error', () => {
		expect.assertions(1);
		return expect(
			publish()
		).rejects.toBeInstanceOf(Error);
	});
});
