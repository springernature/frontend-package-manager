/**
 * __mocks__/glob-results.js
 * Mock filsystem results when globbing
 */
'use strict';

const toolkitFiles = () => {
	return {
		'toolkits/*': [
			'toolkits/toolkit1',
			'toolkits/toolkit2',
			'toolkits/toolkit3',
			'toolkits/toolkit4'
		],
		'toolkits/(toolkit2)': [
			'toolkits/toolkit2'
		],
		'toolkits/(toolkit2|toolkit3)': [
			'toolkits/toolkit2',
			'toolkits/toolkit3'
		],
		'toolkits/(toolkit2|toolkit5|toolkit6)': [
			'toolkits/toolkit2'
		],
		'toolkits/*/packages/toolkit1-package': [
			'toolkits/toolkit1/packages/toolkit1-package'
		],
		'toolkits/(toolkit1)/packages/toolkit1-package': [
			'toolkits/toolkit1/packages/toolkit1-package'
		],
		'toolkits/(toolkit5)': [],
		'toolkits/(toolkit5|toolkit6)': [],
		'toolkits/*/packages/toolkit5-package': [],
		'toolkits/(toolkit3)/packages/toolkit3-package': []
	};
};

const packageFiles = () => {
	return {
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
		passDotfiles: [
			'path/to/global-package/required.md',
			'path/to/global-package/.adotfile',
			'path/to/global-package/folder1',
			'path/to/global-package/folder1/.anotherdotfile'
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
};

module.exports = {
	toolkitFiles,
	packageFiles
};
