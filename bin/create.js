#! /usr/bin/env node
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const createPackage = require('../lib/js/_create');
const exitWithError = require('../lib/js/_utils/_error');
const generateConfig = require('../lib/js/_utils/_generate-config');

(async () => {
	// Suppress CLI reporting
	reporter.init('none');

	try {
		const config = await generateConfig();
		createPackage(config);
	} catch (error) {
		exitWithError(error);
	}
})();
