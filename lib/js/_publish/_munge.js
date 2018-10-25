'use strict';

const {promisify} = require('util');

const fs = require('fs');
const writeFileAsync = promisify(fs.writeFile);

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

function makeHTML(filename, context) {
		return new Promise((resolve, reject) => {
		const source   = fs.readFileSync(filename,'utf8').toString();
		const template = handlebars.compile(source);
		const templated = template(context);
		resolve(templated);
		})
  }

  function makeDemoDir(path) {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(`${path}/demo`)) {
			fs.mkdir(`${path}/demo`, (err) => {if(err) {
				console.error(err);
			}});
		}
		resolve();
	})
  }

  function makeHbs(path) {
	return new Promise((resolve, reject) => {
		writeFileAsync(`${path}/demo/index.hbs`, hbs)
		.then(() => {resolve()});
	}) 
  }

function writeImportStatement(filepath) {
	return new Promise((resolve, reject) => {
		let content = '';
		const files = fs.readdirSync(`${filepath}/scss`)
			  files.forEach((file) => {
				  const stats = fs.statSync(`${filepath}/scss/${file}`)
						  if (stats.isDirectory()) {
							const scssFiles = fs.readdirSync(`${filepath}/scss/${file}`)
								  scssFiles.forEach((scssfile) => {
									  content += `@import "${filepath}/scss/${file}/${scssfile}"; \n`;
									  console.log("content inside loop is " + content);
								  });
						  }
			  });
			  console.log("content is: " + content);
			  resolve(content);
	});
	}

  function makeMainScss(path, content) {
		return new Promise((resolve, reject) => {
			writeFileAsync(`${path}/demo/main.scss`, content)
			.then(() => {resolve()});
		});
  }

  function makeStylesheet(path) {
	sass.render({
		file: `${path}/demo/main.scss`
	  }, function(err, result) { if (err) {
			console.error(err);
	  } 
	  fs.writeFile(`${path}/demo/style.css`, result.css, (err) => {
		  if (err) {
			  console.error(err);
		  }
	});
	});
}

  function munge(path) {
	makeDemoDir(path)
	.catch(err => console.log(err))
	.then(() => makeHbs(path))
	.then(() => makeHTML(`${path}/view/index.hbs`, {}))
	.then(partial => makeHTML(`${path}/demo/index.hbs`, {partial: partial}))
	.then(html =>  writeFileAsync(`${path}/demo/index.html`, html))
	.then(() => writeImportStatement(path))
	.then((content) => {makeMainScss(path, content)})
	.then(makeStylesheet(path))
	.catch((error) => console.error(error));
  }

  module.exports = munge;
