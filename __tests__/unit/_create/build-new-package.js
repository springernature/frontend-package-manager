/**
 * __tests__/unit/_create/build-new-package.js
 * Test: js/_create/_build-new-package.js
 */
'use strict';

const path = require('path');

const rewire = require('rewire');
const stripAnsi = require('strip-ansi');

const mockfs = require('../../../__mocks__/fs');
const MOCK_PACKAGES = mockfs.__fsMockFiles();

const rewirePath = path.resolve(__dirname, '../../../lib/js/_create/_build-new-package');

// Public object returning the task
describe('Create task object based on config and answers', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('valid task format', () => {
		const tasks = rewire(rewirePath);
		mockfs(MOCK_PACKAGES);

		const result = tasks(
			{
				scope: 'scope',
				required: ['filea.md']
			},
			'license',
			{},
			{
				pkgname: 'package',
				description: 'this is a description',
				author: 'Joe Bloggs',
				folders: ['scss']
			}
		);

		expect.assertions(3);
		expect(stripAnsi(result[0].title)).toBe('Create folder package');
		expect(stripAnsi(result[1].title)).toBe('Create folder package/scss');
		expect(stripAnsi(result[2].title)).toBe('Create file filea.md');
	});

	afterEach(() => {
		mockfs.restore();
	});
});

// Contents of package.json
describe('Create contents for package.json file', () => {
	test('valid contents', () => {
		const tasks = rewire(rewirePath);
		const configurePackageJson = tasks.__get__('configurePackageJson');

		const result = `{
  \"name\": \"@scope/package\",
  \"version\": \"0.0.0\",
  \"license\": \"license\",
  \"description\": \"this is a description\",
  \"keywords\": [],
  \"author\": \"Joe Bloggs\"
}`;

		expect.assertions(1);
		return expect(
			configurePackageJson(
				{
					scope: 'scope'
				},
				'license',
				{
					pkgname: 'package',
					description: 'this is a description',
					author: 'Joe Bloggs'
				}
			)
		).toBe(result);
	});
});

// Create folders based on answers
describe('Create folder tasks based on answers', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('valid task format', () => {
		const tasks = rewire(rewirePath);
		const generateFolders = tasks.__get__('generateFolders');
		mockfs(MOCK_PACKAGES);

		const result = generateFolders({"CSSDirectoryStructure": ["10-settings", "20-functions", "30-mixins", "40-base", "50-components", "60-utilities"]},{
			pkgname: 'package',
			folders: ['scss', 'view']
		});

		expect.assertions(2);
		expect(stripAnsi(result[0].title)).toBe('Create folder package/scss');
		expect(stripAnsi(result[1].title)).toBe('Create folder package/view');
	});

	afterEach(() => {
		mockfs.restore();
	});
});

// Create files based on answers
describe('Create files based on config', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	test('valid task format', () => {
		const tasks = rewire(rewirePath);
		const generateFiles = tasks.__get__('generateFiles');
		mockfs(MOCK_PACKAGES);

		const result = generateFiles(
			{
				required: ['filea.md', 'fileb.md']
			},
			{
				pkgname: 'package'
			}
		);

		expect.assertions(2);
		expect(stripAnsi(result[0].title)).toBe('Create file filea.md');
		expect(stripAnsi(result[1].title)).toBe('Create file fileb.md');
	});

	afterEach(() => {
		mockfs.restore();
	});
});