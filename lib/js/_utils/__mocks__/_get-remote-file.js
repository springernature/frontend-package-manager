/**
 * __mocks__/_get-remote-file.js
 * Mock a remote file response
 */
'use strict';

const results = '{"path":"/","type":"directory","files":[{"path":"/topLevelFileA.ext","type":"file"},{"path":"/topLevelFileB.ext","type":"file"},{"path":"/topLevelDirA","type":"directory","files":[{"path":"/topLevelDirA/secondLevelDirA","type":"directory","files":[{"path":"/topLevelDirA/secondLevelDirA/fileA.ext","type":"file"},{"path":"/topLevelDirA/secondLevelDirA/fileB.ext","type":"file"}]},{"path":"/topLevelDirA/fileA.ext","type":"file"},{"path":"/topLevelDirA/secondLevelDirB","type":"directory","files":[{"path":"/topLevelDirA/secondLevelDirB/fileA.ext","type":"file"}]}]},{"path":"/topLevelDirB","type":"directory","files":[{"path":"/topLevelDirB/fileA.ext","type":"file"}]},{"path":"/topLevelFileC.ext","type":"file"}]}';

function getRemoteFile(url, name) {
	return new Promise((resolve, reject) => {
		if (name === 'success') {
			resolve(results);
		}
		reject(reject(new Error('error')));
	});
}

module.exports = getRemoteFile;
