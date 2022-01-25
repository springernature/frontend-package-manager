# History

# 8.0.1 (2022-01-25)
    * BUG: Update util-package-renderer to fix image rendering bug

# 8.0.0 (2022-01-11)
    * BREAKING: util-package-renderer switches to dart sass

# 7.5.1 (2022-01-06)
    * Update util-package-renderer

# 7.5.0 (2022-01-06)
    * FEATURE: allow the blocking of new packages. Only updates to existing allowed.
    * Refactor how configuration is handled

# 7.4.2 (2021-11-26)
    * BUG: `util-package-renderer` fails when it hits a hyperlink

# 7.4.1 (2021-11-26)
    * BUG: dependency issue with `util-package-renderer`

# 7.4.0 (2021-11-26)
    * FEATURE: Images in demo folder support from `util-package-renderer`

# 7.3.0 (2021-10-26)
    * FEATURE: Dynamic handlebars template support from `util-package-renderer`

# 7.2.0 (2021-09-13)
    * FEATURE: Minification options for demo CSS/JS from `util-package-renderer`

# 7.1.0 (2021-09-10)
    * FEATURE: Major release of `util-package-renderer` with new features and bugfixes

# 7.0.0 (2021-05-27)
    * BREAKING: Validates against 'CSSDirectoryStructure' if it is present in the config
    * This will break any packages that didn't previously conform to this structure

# 6.1.3 (2020-11-18)
    * BUG: NPX command failed when being run from a project using a private registry
    * Updated to specify the use of the default registry for NPX

## 6.1.2 (2020-10-06)
    * BUG: demo generation could not be run from the root
    * Changed behaviour to pass package name instead of running from package folder

## 6.1.1 (2020-10-05)
    * Update util-package-renderer
    * BUG: Mismatching lockfile

## 6.1.0 (2020-10-05)
    * FEATURE: Add `sn-package-demo` endpoint to generate static demo locally

## 6.0.0 (2020-10-05)
    * FEATURE: Publish static component example from demo folder
    * BREAKING: Now validates existing demo folder code

## 5.1.3 (2020-06-10)
    * BUG: race condition creating folders when running `create` script

## 5.1.2 (2020-06-02)
    * BUG: missing argument from publish function

## 5.1.1 (2020-05-14)
    * BUG: npx command causing issues when version not explicitly stated

## 5.1.0 (2020-05-04)
	* FEATURE: Allow brand level README files within context
		* required: 'brand-context/README.md'
		* optional: 'brand-context/brand/README.md'

## 5.0.0 (2020-04-15)
	* Major new release for new toolkit architecture
	* BREAKING: Single context package, in its own location
	* BREAKING: Remove package extension
	* Refactor existing code

## 4.0.3 (2019-11-19)
	* BUG: globby pattern fails as NPM module

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