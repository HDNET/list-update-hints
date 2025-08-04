# HDNET list-update-hints

This npm package lists custom update hints to updatable npm packages in your repo.
In a custom `package.json.md` file you can define some information about updatable
dependencies. You can use it for i.e.

- information about updates that are not made too easily
- hints about steps to apply when updating a dependency
- notes to fixed package versions
- important notes about a custom update routine
- ...

The entries must appear after a title `Update Hints` and follow the syntax:

```markdown
- `<package>` some info about the update of the package
```

If you then run `hdnet-list-update-hints`, the script will list available updates using `npm outdated`
and join the in information hints you provided within a simple table.


## Getting started

1. Install the dependency in your repository
```bash
$ npm i -D @hdnet/list-update-hints
```

2. Create a package.json.md file and append a section called `Update Hints` with the following format at the end of the file:
```markdown
# Update Hints
- `nuxt` v2 is EOL - plan the migration in the next sprints!
- `eslint` run tests for custom plugins before updating! @https://some-ticket-system/MYTICKET-1234
- `stylelint` we have to update to at least node@18.12.0 to update to stylelint@16
- `hdnet-list-update-hints` issue feature is missing @https://github.com/HDNET/list-update-hints/issues/1
```

3. Run script
```bash
$ hdnet-list-update-hints

# use option --without-hints to display updatable packages only
$ hdnet-list-update-hints --without-hints
```


## Contribute

To setup current node version, you can use [nvm](https://github.com/nvm-sh/nvm)
(in this project a [.nvmrc](./.nvmrc) file is maintained).
