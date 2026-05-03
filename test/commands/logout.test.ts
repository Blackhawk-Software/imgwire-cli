import {runCommand} from '@oclif/test'
import {expect} from 'chai'

import {clearMemoryCredentialStore, getStoredApiKey, storeApiKey} from '../../src/lib/credentials.js'

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name]
    return
  }

  process.env[name] = value
}

describe('logout', () => {
  const originalApiKey = process.env.IMGWIRE_API_KEY
  const originalCredentialStore = process.env.IMGWIRE_TEST_CREDENTIAL_STORE

  afterEach(() => {
    clearMemoryCredentialStore()
    restoreEnv('IMGWIRE_API_KEY', originalApiKey)
    restoreEnv('IMGWIRE_TEST_CREDENTIAL_STORE', originalCredentialStore)
  })

  beforeEach(() => {
    clearMemoryCredentialStore()
    delete process.env.IMGWIRE_API_KEY
    process.env.IMGWIRE_TEST_CREDENTIAL_STORE = 'memory'
  })

  it('removes a stored API key', async () => {
    await storeApiKey('sk_test_123456789')

    const {error, stdout} = await runCommand('logout')

    expect(error).to.equal(undefined)
    expect(stdout).to.contain('Removed the stored imgwire Server API Key.')
    expect(await getStoredApiKey()).to.equal(null)
  })

  it('reports when no API key is stored', async () => {
    const {error, stdout} = await runCommand('logout')

    expect(error).to.equal(undefined)
    expect(stdout).to.contain('No stored imgwire Server API Key found.')
  })

  it('warns when IMGWIRE_API_KEY is still set', async () => {
    await storeApiKey('sk_test_123456789')
    process.env.IMGWIRE_API_KEY = 'sk_env_123456789'

    const {error, stderr, stdout} = await runCommand('logout')

    expect(error).to.equal(undefined)
    expect(stdout).to.contain('Removed the stored imgwire Server API Key.')
    expect(stderr).to.contain('IMGWIRE_API_KEY is still set')
  })
})
