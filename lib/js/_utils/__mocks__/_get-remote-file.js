/**
 * __mocks__/_get-remote-file.js
 * Mock a remote file response
 */
'use strict';

const results = '{"default":null,"files":[{"name":"topLevelFileA.ext","type":"file"},{"name":"topLevelFileB.ext","type":"file"},{"name":"topLevelDirA","type":"directory","files":[{"name":"secondLevelDirA","type":"directory","files":[{"name":"fileA.ext","type":"file"},{"name":"fileB.ext","type":"file"}]},{"name":"fileA.ext","type":"file"},{"name":"secondLevelDirB","type":"directory","files":[{"name":"fileA.ext","type":"file"}]}]},{"name":"topLevelDirB","type":"directory","files":[{"name":"fileA.ext","type":"file"}]},{"name":"topLevelFileC.ext","type":"file"}]}';

function getRemoteFile(url) {
	return new Promise((resolve, reject) => {
		if (url.includes('success')) {
			resolve(results);
		}
		reject(reject(new Error('error')));
	});
}

module.exports = getRemoteFile;
