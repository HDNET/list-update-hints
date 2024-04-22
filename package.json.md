# [package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

> This document serves as a replacement for comments in `package.json`, since it includes a lot of configuration often
> requiring explanation.

- [scripts](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#scripts)
  - `prepare` Installs git hooks with husky. In production and CI, it omits an error
    (i.e. husky can not be found when installed with `npm install --omit=dev`)
    through husky's suggested disabled ci settings
    (see: [ci-server-and-docker](https://typicode.github.io/husky/how-to.html#ci-server-and-docker).

## Update Hints

no important hints yet...
