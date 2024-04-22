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
const REGEXP_PACKAGE_ENTRY_TPL = `Update Hints[\\s\\S]*[*-] \`{PACKAGE_NAME}(@.*)?\` (.*)\n`

const evaluate = (outdated, mdContents) => {
  Object.entries(outdated).forEach(([outdatedName, outdatedVersions]) => {
    const versionHints = mdContents.match(new RegExp(REGEXP_PACKAGE_ENTRY_TPL.replace('{PACKAGE_NAME}', outdatedName)))
    const hint = versionHints && versionHints.length > 1 ? versionHints[versionHints.length - 1] : ''
    outdated[outdatedName].hint = hint.length > 60 ? `${hint.substring(0, 55)}[...]` : hint
  })
  console.table(outdated, ['current', 'wanted', 'latest', 'hint'])
}

let mdContents = ''
try {
  mdContents = fs.readFileSync(FILE_PACKAGE_JSON_MD, 'utf-8')
} catch (error) {
  console.error(`error: ${error?.message}`)
  process.exit()
}

exec(CMD_NPM_OUTDATED, (error, stdout, stderr) => {
  if (stdout) {
    evaluate(JSON.parse(stdout), mdContents)
  } else {
    console.error(`error: ${error?.message}`)
    console.error(`stderr: ${stderr}`)
    process.exit()
  }
})
