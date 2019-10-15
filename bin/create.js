#! /usr/bin/env node
'use strict';

const path = require('path');
const reporter = require('@springernature/util-cli-reporter');

const error = require('../lib/js/_utils/_error');
const getToolkitLocations = require('../lib/js/_utils/_get-toolkit-locations');
const createPackage = require('../lib/js/_create');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');

(async () => {
	// Suppress CLI reporting
	reporter.init('none');

	try {
		const toolkitInfoObject = await getToolkitLocations('', 'toolkits');
		reporter.title('create a new package');
		createPackage(packageJsonPath, toolkitInfoObject);
	} catch (err) {
		error(err);
	}
})();
