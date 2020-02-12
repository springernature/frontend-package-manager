/**
 * _check-reserved-keys.js
 * Check a config for any reserved values
 * Throw if trying to redefine
 */
'use strict';

const reservedKeys = [
	'contextDirectory',
	'toolkitsDirectory',
	'packagesDirectory'
];

/**
 * @async
 * @function checkReservedKeys
 * @param {Object} config config to check
 * @return {Promise}
 */
async function checkReservedKeys(config) {
	reservedKeys.forEach(key => {
		if (config && config[key]) {
			throw new Error(`the \`${key}\` key is reserved and cannot be set`);
		}
	});
}

module.exports = checkReservedKeys;
