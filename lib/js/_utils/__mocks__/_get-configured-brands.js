/**
 * __mocks__/_get-configured-brands.js
 * Mock returning an array of brands set up in brand-context
 */
'use strict';

/**
 * Mock getConfiguredBrands function
 * Return a list of example brands
 * @function getConfiguredBrands
 * @param {String} _path location of the brand-context
 * @return {Array}
 */
const getConfiguredBrands = _path => ['brandA', 'brandB'];

module.exports = getConfiguredBrands;
