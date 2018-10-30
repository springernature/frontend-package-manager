'use strict';

const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;

const handlebars = require('handlebars');
const sass = require('node-sass');

const hbs =
	`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<link rel="stylesheet" href="style.css">
</head>
<body>
	{{{partial}}}
<script type="module">
import init from '../js/index.js';
init();
</script>
</body>
</html>`;

async function makeHTML(filename, context) {
		try {
		const source = await fsp.readFile(filename, 'utf8');
		const template = handlebars.compile(source.toString());
		const templated = template(context);
		return templated;
		}
		catch(err) {
			console.log(err);
		}
}

function makeDemoDir(path) {
	return fsp.access(`${path}/demo`, fs.constants.F_OK)
	.catch(() => fsp.mkdir(`${path}/demo`));
}

async function writeImportStatement(filepath) {
try {
	let content = '';
	const files = await fsp.readdir(`${filepath}/scss`);

	for (const file of files) {
		const stats = fs.statSync(`${filepath}/scss/${file}`);
		if (stats.isDirectory()) {
			const scssFiles = fs.readdirSync(`${filepath}/scss/${file}`);
			scssFiles.forEach(scssfile => {
				content += `@import "${filepath}/scss/${file}/${scssfile}"; \n`;
			});
		}
	}
	return content;
}
catch(err) {
	console.log(err);
} 
}

function makeStylesheet(path) {
	sass.render({
		file: `${path}/demo/main.scss`
	}, function (err, result) {
		if (err) {
			console.error(err);
		}
		else {
			console.log(result);
			fsp.writeFile(`${path}/demo/style.css`, result.css);
		}
	});
}

function munge(path) {
	makeDemoDir(path)
		.catch(err => console.log(err))
		.then(() => fsp.writeFile(`${path}/demo/index.hbs`, hbs))
		.then(() => makeHTML(`${path}/view/index.hbs`, {}))
		.then(partial => makeHTML(`${path}/demo/index.hbs`, {partial: partial}))
		.then(html => fsp.writeFile(`${path}/demo/index.html`, html))
		.then(() => writeImportStatement(path))
		.then(content => fsp.writeFile(`${path}/demo/main.scss`, content))
		.then(() => makeStylesheet(path))
		.catch(error => console.error(error));
}

module.exports = munge;
