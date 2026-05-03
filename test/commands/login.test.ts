import type {AddressInfo} from 'node:net'

import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {createServer, type IncomingMessage} from 'node:http'

import {clearMemoryCredentialStore} from '../../src/lib/credentials.js'

const API_KEY = 'sk_test_123456789'

type TestServer = {
  baseUrl: string
  close(): Promise<void>
  requests: IncomingMessage[]
}

async function createImgwireApiServer(): Promise<TestServer> {
  const requests: IncomingMessage[] = []
  const server = createServer((request, response) => {
    requests.push(request)

    if (request.headers.authorization !== `Bearer ${API_KEY}`) {
      response.writeHead(401, {'content-type': 'application/json'})
      response.end(JSON.stringify({detail: 'invalid api key'}))
      return
    }

    if (request.method === 'GET' && request.url?.startsWith('/api/v1/images/')) {
      response.writeHead(200, {
        'content-type': 'application/json',
        'x-limit': '1',
        'x-page': '1',
        'x-total-count': '0',
      })
      response.end(JSON.stringify([]))
      return
    }

    response.writeHead(404, {'content-type': 'application/json'})
    response.end(JSON.stringify({detail: 'not found'}))
  })

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve)
  })

  const address = server.address() as AddressInfo

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error)
            return
          }

          resolve()
        })
      }),
    requests,
  }
}

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name]
    return
  }

  process.env[name] = value
}

describe('login', () => {
  const originalApiKey = process.env.IMGWIRE_API_KEY
  const originalBaseUrl = process.env.IMGWIRE_API_BASE_URL
  const originalCredentialStore = process.env.IMGWIRE_TEST_CREDENTIAL_STORE

  afterEach(() => {
    clearMemoryCredentialStore()
    restoreEnv('IMGWIRE_API_KEY', originalApiKey)
    restoreEnv('IMGWIRE_API_BASE_URL', originalBaseUrl)
    restoreEnv('IMGWIRE_TEST_CREDENTIAL_STORE', originalCredentialStore)
  })

  beforeEach(() => {
    clearMemoryCredentialStore()
    process.env.IMGWIRE_API_KEY = API_KEY
    process.env.IMGWIRE_TEST_CREDENTIAL_STORE = 'memory'
  })

  it('validates and stores an API key using the SDK', async () => {
    const server = await createImgwireApiServer()
    process.env.IMGWIRE_API_BASE_URL = server.baseUrl

    try {
      const {error, stdout} = await runCommand('login')
      expect(error).to.equal(undefined)
      expect(stdout).to.contain('Validating Server API Key...')
      expect(stdout).to.contain('Logged in to imgwire with sk_tes...6789.')
      expect(stdout).to.contain('Stored Server API Key in the operating system credential store.')
      expect(server.requests).to.have.length(1)

      delete process.env.IMGWIRE_API_KEY

      const whoami = await runCommand('whoami')
      expect(whoami.error).to.equal(undefined)
      expect(whoami.stdout).to.contain('Source: operating system credential store')
    } finally {
      await server.close()
    }
  })
})
