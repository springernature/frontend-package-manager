#! /usr/bin/env node
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const error = require('../lib/js/_utils/_error');
const generateConfig = require('../lib/js/_utils/_generate-config');
const getToolkitLocations = require('../lib/js/_utils/_get-toolkit-locations');
const publishPackages = require('../lib/js/_publish');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

reporter.title('package publication');
reporter.info('searching for toolkits', '');

(async () => {
	try {
		const toolkitInfoObject = await getToolkitLocations({}, 'toolkits');
		const configs = await generateConfig(packageJsonPath, toolkitInfoObject);
		publishPackages(configs);
	} catch (err) {
		error(err);
	}
})();
