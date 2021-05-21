/**
 * _deduped-array-merge.js
 * Merge two arrays and dedupe
 */
'use strict';

/**
 * @function mergeArrayNoDupes
 * @param {Array} a first array to merge
 * @param {Array} b second array to merge
 * @return {Array}
 */
const mergeArrayNoDupes = (a, b) => {
	if (!Array.isArray(a) || !Array.isArray(b)) {
		return;
	}

	return [...new Set([...a, ...b])];
};

module.exports = mergeArrayNoDupes;
