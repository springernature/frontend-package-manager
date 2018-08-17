# Contributing to `frontend-package-manager`

When contributing to the front-end package manager, work should:

- Always be done in a branch
- Always follow the best practices in the [front-end playbook](https://github.com/springernature/frontend-playbook/)
- Always involve updating or adding to the relevant parts of the documentation
- Always be linted
- **May** include any versioning information (see separate [versioning guidelines](#versioning))
- Always be submitted via a pull request in the [`#frontend-pr`](https://springernature.slack.com/messages/C0GJK53TQ/) slack room

### Pull requests

- Good pull requests - patches, improvements, new features - should remain focused in scope and avoid containing unrelated commits. You should follow the guidelines in the [front-end playbook](https://github.com/springernature/frontend-playbook/blob/master/practices/code-review.md)
- Please adhere to the coding conventions used throughout a project (indentation, accurate comments, etc.) and any other requirements (such as test coverage)
- Merging pull requests should be done via [squash and merge](https://help.github.com/articles/about-pull-request-merges/#squash-and-merge-your-pull-request-commits)
- Once your pull request has been merged back to the master branch, you can follow the [versioning guidelines](#versioning) below to publish your changes. **Note**: you do not have to create a new version after every merge. Related merges can be bundled into one new version

### Linting

Whenever you make changes to this repo, you should run the linter locally before you commit your work. The following command is available to do this:

```
$ npm run lint
```

### Versioning

All packages are versioned individually using [semver](http://semver.org/). You should read through the semver documentation, and the guidelines in the [front-end playbook](https://github.com/springernature/frontend-playbook/blob/master/practices/semver.md).

To publish a new version of this repo to NPM:

1. Create a new branch for the version bump
2. Increment either the major, minor, or patch version in the `package.json`. If you're unsure which, have a chat about it or re-read the semver docs
    * Development versions of a package should start at version `0.1.0` as per the [semver documentation](https://semver.org/#spec-item-4)
3. Add an entry to the relevant `HISTORY.md` file outlining the changes in the new version. Take your time, this log should be useful to developers – it should help them make decisions about whether they can upgrade
4. Commit your changes with a message formatted as `Version 1.2.3` – this helps people find version commits in the log
5. Open a pull request, and perform a standard merge upon approval
6. Tag the merge commit with the version number, e.g. `git tag 1.2.3`, then push the new tag to origin: `git push && git push --tags`
7. Publish the new version to NPM