#! /usr/bin/env node
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const exitWithError = require('../lib/js/_utils/_error');
const generateConfigs = require('../lib/js/_utils/_generate-toolkit-config');
const getToolkitLocations = require('../lib/js/_utils/_get-toolkit-locations');
const publishPackages = require('../lib/js/_publish');

const rootPath = process.cwd();
const packageJsonPath = path.resolve(rootPath, 'package.json');

reporter.title('package publication');
reporter.info('searching for toolkits');

(async () => {
	try {
		const allToolkitsInfo = await getToolkitLocations();
		const configs = await generateConfigs(packageJsonPath, allToolkitsInfo);
		publishPackages(configs, rootPath);
	} catch (error) {
		exitWithError(error);
	}
})();
