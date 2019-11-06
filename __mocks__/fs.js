/**
 * __mocks__/fs.js
 * Mock the filesystem for tests
 */
'use strict';

const fs = require('mock-fs');

const defaultPackageContents = {
	'required.md': 'file content',
	'fail.md': 'file content',
	'.adotfile': 'file content',
	folder1: {
		'file.scss': 'file content',
		'file.css': 'file content',
		'file.js': 'file content',
		'.anotherdotfile': 'nested dotfile content'
	},
	folder2: {
		'file.js': 'file content',
		'file.spec.js': 'file content',
		'file.json': 'file content',
		subfolder: {
			'file.js': 'file content'
		}
	},
	folder3: {
		'file.scss': 'file content',
		'file.js': 'file content'
	},
	folderfail: {
		'file.md': 'file content'
	}
};

const __fsMockFiles = () => {
	return {
		'packages/package/pass': defaultPackageContents,
		'packages/package/passWithBuildFiles': {...defaultPackageContents, ...{'package-lock.json': 'file content'}},
		'packages/package/passGitIgnore': defaultPackageContents,
		'packages/package/passDotfiles': defaultPackageContents,
		'packages/package/failIsRequired': defaultPackageContents,
		'packages/package/failIsFolder': defaultPackageContents,
		'packages/package/failIsFileType': defaultPackageContents,
		'packages/package/failIsTopLevelFile': defaultPackageContents,
		'path/to/global-package': defaultPackageContents,
		'path/to/global-package-b': {
			'some-file.txt': 'file content here',
			'empty-dir': {/** empty directory */}
		},
		'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
		'some/other/path': {/** another empty directory */},
		'home/user/.npmrc': '//mock-registry.npmjs.org/:_authToken=xyz',
		'home/user-b/.npmrc': `//registry.npmjs.org/:_authToken=$\{NPM_TOKEN}`,
		'home/user-c/.npmrc': `//registry.npmjs.org/:_authToken=$\{OTHER_NPM_TOKEN}`
	};
};

const __fsMockFilesEmpty = () => {
	return {
		'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
		'some/other/path': {/** another empty directory */}
	};
};

const __fsMkdir = (path, callback) => {
	if (path.includes('package-error') || path.includes('package-css-folders/scss/A')) {
		callback('mkdir error');
	} else {
		callback();
	}
};

const __fsWriteFile = (path, _contents, callback) => {
	if (path.includes('package-error') || path.includes('package-file-error')) {
		callback('writefile error');
	} else {
		callback();
	}
};

fs.__fsMockFiles = __fsMockFiles;
fs.__fsMockFilesEmpty = __fsMockFilesEmpty;
fs.mkdir = __fsMkdir;
fs.writeFile = __fsWriteFile;

module.exports = fs;
