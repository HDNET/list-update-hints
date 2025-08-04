#!/usr/bin/env node

/**
 * This script executes `npm outdated` and enriches outdated packages with
 * information possibly documented in the package.json.md file. To get the
 * information grepped from the package.json.md file, an entry must match the
 * RegExp `REGEXP_PACKAGE_ENTRY_TPL`.
 */

import fs from 'node:fs'
import { exec } from 'node:child_process'

const CMD_NPM_OUTDATED = 'npm outdated --json'
const FILE_PACKAGE_JSON_MD = './package.json.md'
const REGEXP_PACKAGE_ENTRY_TPL = `Update Hints[\\s\\S]*[*-] \`{PACKAGE_NAME}(@.*)?\` ((?:(?!@http).)+)?(@http.*)?\n`

const readPackageJsonMd = () => {
  try {
    return fs.readFileSync(FILE_PACKAGE_JSON_MD, 'utf-8')
  } catch (error) {
    console.error(`error: ${error?.message}`)
    process.exit()
  }
}

const addHintsFromPackageJsonMd = (outdated) => {
  const mdContents = readPackageJsonMd()

  Object.entries(outdated).forEach(([outdatedName, outdatedVersions]) => {
    const versionHints = mdContents.match(new RegExp(REGEXP_PACKAGE_ENTRY_TPL.replace('{PACKAGE_NAME}', outdatedName)))
    const hint = versionHints && versionHints.length > 2 && versionHints[2] ? versionHints[2] : ''
    const issue = versionHints && versionHints.length > 3 && versionHints[3] ? versionHints[3] : ''
    outdated[outdatedName].hint = hint.length > 60 ? `${hint.substring(0, 55)}[...]` : hint
    outdated[outdatedName].issue = issue?.length ? issue.match(/([^\/]+)\/?$/)[0] : issue
  })

  return outdated
}

const show = (all, withoutHints = false) => {
  const output = withoutHints
    ? Object.entries(all).reduce((acc, [key, value]) => {
      if (!value.hint) {
        acc[key] = value
      }
      return acc
    }, {})
    : all

  console.table(output, ['current', 'wanted', 'latest', 'hint', 'issue'])
}

exec(CMD_NPM_OUTDATED, (error, stdout, stderr) => {
  if (stdout) {
    const result = addHintsFromPackageJsonMd(JSON.parse(stdout))
    show(result, process.argv.length > 2 && process.argv[2] === '--without-hints')
  } else {
    console.error(`error: ${error?.message}`)
    console.error(`stderr: ${stderr}`)
    process.exit()
  }
})
