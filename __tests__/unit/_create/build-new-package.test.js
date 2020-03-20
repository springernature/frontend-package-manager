/**
 * __tests__/unit/_create/build-new-package.test.js
 * Test: js/_create/_build-new-package.js
 */
'use strict';

const path = require('path');
const stripAnsi = require('strip-ansi');

jest.mock('fs');
jest.mock('../../../lib/js/_utils/_current-working-directory.js', () => () => '/path/to');

const buildNewPackage = require('../../../lib/js/_create/_build-new-package');

describe('Create task objects', () => {
	const originalErrorLog = console.error;
	const mockedErrorLog = output => consoleOutput = output;
	let consoleOutput = '';

	beforeEach(() => console.error = mockedErrorLog);

	afterEach(() => {
		console.error = originalErrorLog;
		consoleOutput = '';
	});

	test('Create valid task format', () => {
		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['filea.md'],
				packagesDirectory: 'path/to'
			},
			'.',
			'license',
			{
				pkgname: 'package',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['scss', 'view']
			}
		);

		// Run the tasks
		result[0].task();
		result[1].task();
		result[2].task();
		result[3].task();

		expect.assertions(4);
		expect(stripAnsi(result[0].title)).toBe('Create folder package');
		expect(stripAnsi(result[1].title)).toBe('Create folder package/scss');
		expect(stripAnsi(result[2].title)).toBe('Create folder package/view');
		expect(stripAnsi(result[3].title)).toBe('Create file package/filea.md');
	});

	test('Create valid task format, with package.json', () => {
		const pkgJson = `{
  \"name\": \"@scope/package\",
  \"version\": \"0.0.0\",
  \"license\": \"license\",
  \"description\": \"this is a description\",
  \"keywords\": [],
  \"author\": \"Joe Bloggs\"
}`;

		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['filea.md', 'package.json'],
				packagesDirectory: 'path/to'
			},
			'.',
			'license',
			{
				pkgname: 'package',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['scss']
			}
		);

		// Run the task
		result[3].task();

		expect.assertions(1);
		expect(stripAnsi(result[3].test)).toBe(pkgJson);
	});

	test('Create valid task format, with CSS directory structure', () => {
		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['filea.md'],
				packagesDirectory: 'path/to',
				CSSDirectoryStructure: {
					'scss': ['A', 'B']
				}
			},
			'.',
			'license',
			{
				pkgname: 'package',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['scss']
			}
		);

		// Run the tasks
		result[0].task();
		result[1].task();
		result[2].task();
		result[3].task();

		expect.assertions(4);
		expect(stripAnsi(result[0].title)).toBe('Create folder package');
		expect(stripAnsi(result[1].title)).toBe('Create folder package/scss');
		expect(stripAnsi(result[2].title)).toBe('Create sub-folder structure within package/scss');
		expect(stripAnsi(result[3].title)).toBe('Create file package/filea.md');
	});

	test('Create valid task format, with no folders specified', () => {
		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['filea.md'],
				packagesDirectory: 'path/to'
			},
			'.',
			'license',
			{
				pkgname: 'package',
				description: 'this is a description',
				author: 'Joe Bloggs'
			}
		);

		// Run the tasks
		result[0].task();
		result[1].task();

		expect.assertions(2);
		expect(stripAnsi(result[0].title)).toBe('Create folder package');
		expect(stripAnsi(result[1].title)).toBe('Create file package/filea.md');
	});

	test('Log error if unable to create top level package folder', () => {
		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['filea.md'],
				packagesDirectory: 'path/to'
			},
			'.',
			'license',
			{
				pkgname: 'package-error',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['scss', 'view']
			}
		);
		
		// Run the first task
		result[0].task();

		expect.assertions(1);
		expect(consoleOutput).toEqual('mkdir error');
	});

	test('Log error if unable to create package.json', () => {
		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['package.json'],
				packagesDirectory: 'path/to'
			},
			'.',
			'license',
			{
				pkgname: 'package-error',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['view']
			}
		);

		// Run the first task
		result[2].task();

		expect.assertions(1);
		expect(consoleOutput).toEqual('writefile error');
	});

	test('Log error if unable to create file', () => {
		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['file.ext'],
				packagesDirectory: 'path/to'
			},
			'.',
			'license',
			{
				pkgname: 'package-error',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['view']
			}
		);

		// Run the first task
		result[2].task();

		expect.assertions(1);
		expect(consoleOutput).toEqual('writefile error');
	});

	test('Log error if unable to create folder', () => {
		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['file.ext'],
				packagesDirectory: 'path/to'
			},
			'.',
			'license',
			{
				pkgname: 'package-error',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['view']
			}
		);

		// Run the first task
		result[1].task();

		expect.assertions(1);
		expect(consoleOutput).toEqual('mkdir error');
	});

	test('Log error if unable to create .gitkeep file in folder', () => {
		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['file.ext'],
				packagesDirectory: 'path/to'
			},
			'.',
			'license',
			{
				pkgname: 'package-file-error',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['view']
			}
		);

		// Run the first task
		result[1].task();

		expect.assertions(1);
		expect(consoleOutput).toEqual('writefile error');
	});

	test('Log error if unable to create CSSDirectoryStructure', () => {
		const result = buildNewPackage(
			{
				scope: 'scope',
				required: ['file.ext'],
				packagesDirectory: 'path/to',
				CSSDirectoryStructure: {
					'scss': ['A']
				}
			},
			'.',
			'license',
			{
				pkgname: 'package-css-folders',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['scss']
			}
		);

		// Run the first task
		result[2].task();

		expect.assertions(1);
		expect(consoleOutput).toEqual('mkdir error');
	});
});