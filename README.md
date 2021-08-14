# NPM Publish

Publish package to NPM registry. Support YARN workspaces.

# Author

[onichandame](https://onichandame.com)

# Usage

```yaml
name: deploy
on:
  push:
    branches:
      - master
      - main
jobs:
  npm-publish:
    name: Publish Package
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@master
      - name: Set up Node.js
        uses: actions/setup-node@master
        with:
          node-version: 14.x
      - name: Build distribution files
        runs: yarn && yarn build
      - name: Publish
        uses: onichandame/github-action-npm-publish:0.0.0
        env:
          NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }} # set this in github secrets
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # leave as it is. auto generated

        with:
          packages: 'lib1 lib2' # workspaces to publish separated by space
          mode: 'all' # fail the CI if any package fails publishing
          tag_package: 'lib1' # create tag based on package
```

Environmental variables:

- packages: to publish packages in the monorepo, specify the package names here. multiple packages should be separated by space. If left blank, it is assumed that the entire repository is the package.
- mode: `all` | `at_least_one`
  - all: all packages must succeed publishing
  - at_least_one: at least one package must succeed publishing
- tag_package: the name of the package being tracked in the git tag names.

Note:

1. Before entering the CI/CD pipeline, the version must have been already bumped. Otherwise the publish will fail due to conflict of version
2. For private packages, the flag `--access restricted` will be used. For public packages, the flag `--access public` will be used

## YARN v2

For yarn v2 users, some tweaks in the project are neccessary:

1. add to the `publishConfig` entry of `package.json`: `{"registry": "https://registry.npmjs.org"}`
2. add line to the `.yarnrc.yml`: `npmAuthToken: "${NPM_AUTH_TOKEN}"`
