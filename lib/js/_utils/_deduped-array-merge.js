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
const mergeArrayNoDupes = (a, b) => [...new Set([...a, ...b])];

module.exports = mergeArrayNoDupes;
