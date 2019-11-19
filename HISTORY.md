# History

## 4.0.2 (2019-11-06)
	* BUG: package level package-lock.json files not being ignored during validation

## 4.0.1 (2019-11-05)
	* BUG: null being passed for token access instead of NPM_TOKEN

## 4.0.0 (2019-10-31)
	* BREAKING: Major rewrite that requires a change to repo structures
		* Handles multiple toolkits per repo
	* BREAKING: Remove the ability to configure the `packagesDirectory`
	* Switches from Promise to Async/Await

## 3.0.0 (2019-09-26)
	* Move some functionality into reuseable utility modules
		* Package extension
		* CLI reporting

## 2.1.0 (2019-08-07)
	* Feature: Allow multiple retries on CDN requests

## 2.0.2 (2019-07-30)
	* Switch CDN from unpkg to jsDelivr
	* Hopefully fixes bug with reliability

## 2.0.1 (2019-07-29)
	* BUG: handling unpkg redirects
	* unpkg now redirects to /browse for directories

## 2.0.0 (2019-07-03)
	* .dotfiles anywhere in a package now valid
	
## 1.0.1 (2019-07-03)
	* Update package validation to allow .spec.js files

## 1.0.0 (2019-05-21)
	* Removes dependency on npm-utils
	* Stable version

## 0.2.0 (2018-10-18)
	* Creates subdirectory structure

## 0.1.3 (2018-10-01)
	* Fixes a bug when checking extended packages
	* Was failing for packages that were not extended

## 0.1.2 (2018-09-20)
	* More informative error messaging for 'incorrect syntax' when specifying an extended package

## 0.1.1 (2018-08-20)
	* Move `gitignore-globs` from devDependencies to dependencies

## 0.1.0 (2018-08-20)
	* Move from `frontend-global-toolkit` and refactor
    * https://github.com/springernature/frontend-global-toolkit/pull/76