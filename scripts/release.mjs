import {readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'

const packageJsonPath = resolve(process.cwd(), 'package.json')

const exitCode = run()

if (exitCode !== 0) {
  process.exitCode = exitCode
}

function run() {
  const command = process.argv[2]

  if (!command) {
    return printUsage()
  }

  if (command === 'prepare') {
    const version = process.argv[3]
    return prepareRelease(version)
  }

  if (command === 'verify-tag') {
    const tag = process.argv[3]
    return verifyTag(tag)
  }

  return printUsage()
}

function prepareRelease(version) {
  if (!isValidSemver(version)) {
    return fail(`Invalid version "${version}". Expected semver like 0.2.0 or 1.0.0-beta.1.`)
  }

  const packageJson = readJson(packageJsonPath)
  packageJson.version = version
  writeJson(packageJsonPath, packageJson)

  console.log(`Updated package.json to version ${version}.`)
  console.log('Next steps:')
  console.log('1. Run yarn ci.')
  console.log('2. Review the diff.')
  console.log('3. Commit and push the version bump.')
  console.log(`4. Publish a GitHub release for v${version}.`)

  return 0
}

function verifyTag(tag) {
  if (!tag) {
    return fail('Missing release tag. Usage: yarn release:verify-tag v0.1.0')
  }

  const packageJson = readJson(packageJsonPath)
  const expectedTag = `v${packageJson.version}`

  if (tag !== expectedTag) {
    return fail(
      `Release tag ${tag} does not match package.json version ${packageJson.version}. Expected ${expectedTag}.`,
    )
  }

  console.log(`Release tag ${tag} matches package.json version ${packageJson.version}.`)

  return 0
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function isValidSemver(version) {
  return /^\d+\.\d+\.\d+(?:-[\dA-Za-z.-]+)?(?:\+[\dA-Za-z.-]+)?$/.test(version)
}

function printUsage() {
  console.error('Usage:')
  console.error('  yarn release:prepare <version>')
  console.error('  yarn release:verify-tag <tag>')
  return 1
}

function fail(message) {
  console.error(message)
  return 1
}
