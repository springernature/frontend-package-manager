#! /usr/bin/env node
'use strict';

const reporter = require('@springernature/util-cli-reporter');

const exitWithError = require('../lib/js/_utils/_error');
const generateConfig = require('../lib/js/_utils/_generate-config');
const publishPackages = require('../lib/js/_publish');

reporter.title('package publication');
reporter.info('searching for toolkits');

(async () => {
	try {
		await generateConfig();
		// publishPackages(allConfigs, currentWorkingDirectory);
		publishPackages();
	} catch (error) {
		exitWithError(error);
	}
})();
