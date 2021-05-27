/**
 * __mocks__/glob-results.js
 * Mock filsystem results when globbing
 * Object keys refer to glob search terms
 */
'use strict';

const toolkitFiles = {
	'toolkits/*': [
		'toolkits/toolkit1',
		'toolkits/toolkit2',
		'toolkits/toolkit3',
		'toolkits/toolkit4'
	],
	'toolkits/toolkit2': [
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
	'toolkits/toolkit1/packages/toolkit1-package': [
		'toolkits/toolkit1/packages/toolkit1-package'
	],
	'toolkits/toolkit5': [],
	'toolkits/(toolkit5|toolkit6)': [],
	'toolkits/*/packages/toolkit5-package': [],
	'toolkits/toolkit3/packages/toolkit3-package': []
};

const packageFiles = {
	'packages/package/pass/**/*': [
		'packages/package/pass/required.md',
		'packages/package/pass/folder1',
		'packages/package/pass/folder1/file.scss',
		'packages/package/pass/folder1/file.css',
		'packages/package/pass/folder2',
		'packages/package/pass/folder2/file.js',
		'packages/package/pass/folder2/file.spec.js',
		'packages/package/pass/folder2/file.json',
		'packages/package/pass/folder2/subfolder',
		'packages/package/pass/folder2/subfolder/file.js'
	],
	'packages/package/passWithChangelog/**/*': [
		'packages/package/passWithChangelog/required.md',
		'packages/package/passWithChangelog/HISTORY.md',
		'packages/package/passWithChangelog/folder1',
		'packages/package/passWithChangelog/folder1/file.scss',
		'packages/package/passWithChangelog/folder1/file.css',
		'packages/package/passWithChangelog/folder2',
		'packages/package/passWithChangelog/folder2/file.js',
		'packages/package/passWithChangelog/folder2/file.spec.js',
		'packages/package/passWithChangelog/folder2/file.json',
		'packages/package/passWithChangelog/folder2/subfolder',
		'packages/package/passWithChangelog/folder2/subfolder/file.js'
	],
	'packages/package/passGitIgnore/**/*': [
		'packages/package/passGitIgnore/required.md',
		'packages/package/passGitIgnore/folder1',
		'packages/package/passGitIgnore/folder1/file.scss',
		'packages/package/passGitIgnore/folder1/file.css',
		'packages/package/passGitIgnore/folder2',
		'packages/package/passGitIgnore/folder2/file.js',
		'packages/package/passGitIgnore/folder2/file.json',
		'packages/package/passGitIgnore/folder2/subfolder',
		'packages/package/passGitIgnore/folder2/subfolder/file.js',
		'packages/package/passGitIgnore/folder3',
		'packages/package/passGitIgnore/folder3/file.scss',
		'packages/package/passGitIgnore/folder3/file.js'
	],
	'packages/package/passWithBuildFiles/**/*': [
		'packages/package/passWithBuildFiles/required.md',
		'packages/package/passWithBuildFiles/package-lock.json',
		'packages/package/passWithBuildFiles/folder1',
		'packages/package/passWithBuildFiles/folder1/file.scss',
		'packages/package/passWithBuildFiles/folder1/file.css',
		'packages/package/passWithBuildFiles/folder2',
		'packages/package/passWithBuildFiles/folder2/file.js',
		'packages/package/passWithBuildFiles/folder2/file.json',
		'packages/package/passWithBuildFiles/folder2/subfolder',
		'packages/package/passWithBuildFiles/folder2/subfolder/file.js',
		'packages/package/passWithBuildFiles/folder3',
		'packages/package/passWithBuildFiles/folder3/file.scss',
		'packages/package/passWithBuildFiles/folder3/file.js'
	],
	'packages/package/passDotfiles/**/*': [
		'packages/package/passDotfiles/required.md',
		'packages/package/passDotfiles/.adotfile',
		'packages/package/passDotfiles/folder1',
		'packages/package/passDotfiles/folder1/.anotherdotfile'
	],
	'packages/package/failIsRequired/**/*': [
		'packages/package/failIsRequired/folder1',
		'packages/package/failIsRequired/folder1/file.scss',
		'packages/package/failIsRequired/folder1/file.css',
		'packages/package/failIsRequired/folder2',
		'packages/package/failIsRequired/folder2/file.js',
		'packages/package/failIsRequired/folder2/file.json',
		'packages/package/failIsRequired/folder2/subfolder',
		'packages/package/failIsRequired/folder2/subfolder/file.js'
	],
	'packages/package/failIsFolder/**/*': [
		'packages/package/failIsFolder/required.md',
		'packages/package/failIsFolder/folderfail',
		'packages/package/failIsFolder/folderfail/file.md',
		'packages/package/failIsFolder/folder2',
		'packages/package/failIsFolder/folder2/file.js',
		'packages/package/failIsFolder/folder2/file.json',
		'packages/package/failIsFolder/folder2/subfolder',
		'packages/package/failIsFolder/folder2/subfolder/file.js'
	],
	'packages/package/failIsFileType/**/*': [
		'packages/package/failIsFileType/required.md',
		'packages/package/failIsFileType/folder1',
		'packages/package/failIsFileType/folder1/file.scss',
		'packages/package/failIsFileType/folder1/file.js',
		'packages/package/failIsFileType/folder2',
		'packages/package/failIsFileType/folder2/file.js',
		'packages/package/failIsFileType/folder2/file.json',
		'packages/package/failIsFileType/folder2/subfolder',
		'packages/package/failIsFileType/folder2/subfolder/file.js'
	],
	'packages/package/failIsTopLevelFile/**/*': [
		'packages/package/failIsTopLevelFile/required.md',
		'packages/package/failIsTopLevelFile/fail.md',
		'packages/package/failIsTopLevelFile/folder1',
		'packages/package/failIsTopLevelFile/folder1/file.scss',
		'packages/package/failIsTopLevelFile/folder1/file.css',
		'packages/package/failIsTopLevelFile/folder2',
		'packages/package/failIsTopLevelFile/folder2/file.js',
		'packages/package/failIsTopLevelFile/folder2/file.json',
		'packages/package/failIsTopLevelFile/folder2/subfolder',
		'packages/package/failIsTopLevelFile/folder2/subfolder/file.js'
	],
	'packages/package/passContext/*': [
		'packages/package/passContext/required.md',
		'packages/package/passContext/HISTORY.md'
	],
	'packages/package/passContext/brandA/**/*': [
		'packages/package/passContext/brandA/folder1',
		'packages/package/passContext/brandA/folder1/file.scss',
		'packages/package/passContext/brandA/folder1/file.css',
		'packages/package/passContext/brandA/folder2',
		'packages/package/passContext/brandA/folder2/file.js',
		'packages/package/passContext/brandA/folder2/file.spec.js',
		'packages/package/passContext/brandA/folder2/file.json',
		'packages/package/passContext/brandA/folder2/subfolder',
		'packages/package/passContext/brandA/folder2/subfolder/file.js'
	],
	'packages/package/passContextWithReadme/*': [
		'packages/package/passContextWithReadme/required.md',
		'packages/package/passContextWithReadme/HISTORY.md'
	],
	'packages/package/passContextWithReadme/brandA/**/*': [
		'packages/package/passContextWithReadme/brandA/README.md',
		'packages/package/passContextWithReadme/brandA/folder1',
		'packages/package/passContextWithReadme/brandA/folder1/file.scss',
		'packages/package/passContextWithReadme/brandA/folder1/file.css',
		'packages/package/passContextWithReadme/brandA/folder2',
		'packages/package/passContextWithReadme/brandA/folder2/file.js',
		'packages/package/passContextWithReadme/brandA/folder2/file.spec.js',
		'packages/package/passContextWithReadme/brandA/folder2/file.json',
		'packages/package/passContextWithReadme/brandA/folder2/subfolder',
		'packages/package/passContextWithReadme/brandA/folder2/subfolder/file.js'
	],
	'packages/package/passWithCss/**/*': [
		'packages/package/passWithCss/required.md',
		'packages/package/passWithCss/folder1',
		'packages/package/passWithCss/folder1/a',
		'packages/package/passWithCss/folder1/b',
		'packages/package/passWithCss/folder1/c',
		'packages/package/passWithCss/folder1/a/fileA.scss',
		'packages/package/passWithCss/folder1/b/fileB.scss',
		'packages/package/passWithCss/folder1/c/fileC.css'
	],
	'packages/package/failIsCssFolder/**/*': [
		'packages/package/failIsCssFolder/required.md',
		'packages/package/failIsCssFolder/folder1',
		'packages/package/failIsCssFolder/folder1/a',
		'packages/package/failIsCssFolder/folder1/b',
		'packages/package/failIsCssFolder/folder1/d',
		'packages/package/failIsCssFolder/folder1/a/fileA.scss',
		'packages/package/failIsCssFolder/folder1/b/fileB.scss',
		'packages/package/failIsCssFolder/folder1/d/fileD.css'
	]
};

const folderFiles = {
	'package/valid-folder': [
		'nature.scss',
		'_springer.scss'
	],
	'package/valid-other-folder': [
		'_nature.scss',
		'springer.scss'
	]
};

module.exports = {
	toolkitFiles,
	packageFiles,
	folderFiles
};
