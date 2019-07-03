/**
 * __mocks__/glob.js
 * Mock globbing a directory
 */
'use strict';

const results = {
	pass: [
		'path/to/global-package/required.md',
		'path/to/global-package/folder1',
		'path/to/global-package/folder1/file.scss',
		'path/to/global-package/folder1/file.css',
		'path/to/global-package/folder2',
		'path/to/global-package/folder2/file.js',
		'path/to/global-package/folder2/file.spec.js',
		'path/to/global-package/folder2/file.json',
		'path/to/global-package/folder2/subfolder',
		'path/to/global-package/folder2/subfolder/file.js'
	],
	passGitIgnore: [
		'path/to/global-package/required.md',
		'path/to/global-package/folder1',
		'path/to/global-package/folder1/file.scss',
		'path/to/global-package/folder1/file.css',
		'path/to/global-package/folder2',
		'path/to/global-package/folder2/file.js',
		'path/to/global-package/folder2/file.json',
		'path/to/global-package/folder2/subfolder',
		'path/to/global-package/folder2/subfolder/file.js',
		'path/to/global-package/folder3',
		'path/to/global-package/folder3/file.scss',
		'path/to/global-package/folder3/file.js'
	],
	failIsRequired: [
		'path/to/global-package/folder1',
		'path/to/global-package/folder1/file.scss',
		'path/to/global-package/folder1/file.css',
		'path/to/global-package/folder2',
		'path/to/global-package/folder2/file.js',
		'path/to/global-package/folder2/file.json',
		'path/to/global-package/folder2/subfolder',
		'path/to/global-package/folder2/subfolder/file.js'
	],
	failIsFolder: [
		'path/to/global-package/required.md',
		'path/to/global-package/folderfail',
		'path/to/global-package/folderfail/file.md',
		'path/to/global-package/folder2',
		'path/to/global-package/folder2/file.js',
		'path/to/global-package/folder2/file.json',
		'path/to/global-package/folder2/subfolder',
		'path/to/global-package/folder2/subfolder/file.js'
	],
	failIsFileType: [
		'path/to/global-package/required.md',
		'path/to/global-package/folder1',
		'path/to/global-package/folder1/file.scss',
		'path/to/global-package/folder1/file.js',
		'path/to/global-package/folder2',
		'path/to/global-package/folder2/file.js',
		'path/to/global-package/folder2/file.json',
		'path/to/global-package/folder2/subfolder',
		'path/to/global-package/folder2/subfolder/file.js'
	],
	failIsTopLevelFile: [
		'path/to/global-package/required.md',
		'path/to/global-package/fail.md',
		'path/to/global-package/folder1',
		'path/to/global-package/folder1/file.scss',
		'path/to/global-package/folder1/file.css',
		'path/to/global-package/folder2',
		'path/to/global-package/folder2/file.js',
		'path/to/global-package/folder2/file.json',
		'path/to/global-package/folder2/subfolder',
		'path/to/global-package/folder2/subfolder/file.js'
	]
};

const glob = (path, type, cb) => {
	cb(
		(type === 'error') ? 'error thrown' : null,
		(type === 'error') ? [] : results[type]
	);
};

module.exports = glob;
