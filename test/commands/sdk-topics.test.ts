/* eslint-disable camelcase */
import type {AddressInfo} from 'node:net'

import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import {spawn} from 'node:child_process'
import {mkdtemp, writeFile} from 'node:fs/promises'
import {createServer, type IncomingMessage, type ServerResponse} from 'node:http'
import os from 'node:os'
import path from 'node:path'

const API_KEY = 'sk_test_123456789'

type CapturedRequest = {
  body: string
  method: string | undefined
  url: string | undefined
}

type TestServer = {
  baseUrl: string
  close(): Promise<void>
  requests: CapturedRequest[]
}

type CliResult = {
  code: null | number
  stderr: string
  stdout: string
}

async function createImgwireApiServer(): Promise<TestServer> {
  const requests: CapturedRequest[] = []
  let baseUrl = ''

  const server = createServer((request, response) => {
    handleRequest(request, response, requests, () => baseUrl).catch((error: unknown) => {
      writeJson(response, 500, {detail: error instanceof Error ? error.message : String(error)})
    })
  })

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve)
  })

  const address = server.address() as AddressInfo
  baseUrl = `http://127.0.0.1:${address.port}`

  return {
    baseUrl,
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

async function runCliWithStdin(args: string[], input: string, env: NodeJS.ProcessEnv): Promise<CliResult> {
  const child = spawn(path.join(process.cwd(), 'bin/dev.js'), args, {
    cwd: process.cwd(),
    env: {...process.env, NODE_NO_WARNINGS: '1', ...env},
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  let stderr = ''
  let stdout = ''

  child.stderr.setEncoding('utf8')
  child.stdout.setEncoding('utf8')
  child.stderr.on('data', (chunk: string) => {
    stderr += chunk
  })
  child.stdout.on('data', (chunk: string) => {
    stdout += chunk
  })
  child.stdin.end(input)

  const code = await new Promise<null | number>((resolve, reject) => {
    child.on('error', reject)
    child.on('close', resolve)
  })

  return {code, stderr, stdout}
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  requests: CapturedRequest[],
  getBaseUrl: () => string,
): Promise<void> {
  const body = await readRequestBody(request)
  requests.push({body, method: request.method, url: request.url})

  if (request.url === '/upload' && request.method === 'PUT') {
    response.writeHead(200)
    response.end()
    return
  }

  if (request.headers.authorization !== `Bearer ${API_KEY}`) {
    writeJson(response, 401, {detail: 'invalid api key'})
    return
  }

  const url = new URL(request.url ?? '/', getBaseUrl())

  if (request.method === 'GET' && url.pathname === '/api/v1/images/') {
    writeJson(response, 200, [image()], {'x-limit': '25', 'x-page': '1', 'x-total-count': '1'})
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/images/img_123') {
    writeJson(response, 200, image())
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/images/standard_upload') {
    writeJson(response, 200, {
      image: image(),
      upload_url: `${getBaseUrl()}/upload`,
    })
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/cors_origins/') {
    writeJson(response, 200, [corsOrigin()], {'x-limit': '25', 'x-page': '1', 'x-total-count': '1'})
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/custom_domain/') {
    writeJson(response, 200, customDomain())
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/metrics/stats') {
    writeJson(response, 200, metricsStats())
    return
  }

  writeJson(response, 404, {detail: 'not found'})
}

function writeJson(
  response: ServerResponse,
  statusCode: number,
  body: unknown,
  headers: Record<string, string> = {},
): void {
  response.writeHead(statusCode, {'content-type': 'application/json', ...headers})
  response.end(JSON.stringify(body))
}

async function readRequestBody(request: IncomingMessage): Promise<string> {
  let body = ''

  for await (const chunk of request) {
    body += chunk
  }

  return body
}

function image(): Record<string, unknown> {
  return {
    can_upload: true,
    cdn_url: 'https://cdn.imgwire.dev/env/img_123/original.png',
    created_at: '2026-05-03T00:00:00.000Z',
    custom_metadata: {},
    deleted_at: null,
    environment_id: 'env_123',
    exif_data: {},
    extension: 'png',
    hash_sha256: null,
    height: 1,
    id: 'img_123',
    idempotency_key: null,
    is_directly_deliverable: true,
    mime_type: 'image/png',
    original_filename: 'hero.png',
    processed_metadata_at: null,
    purpose: null,
    size_bytes: 4,
    status: 'READY',
    updated_at: '2026-05-03T00:00:00.000Z',
    upload_token_id: null,
    width: 1,
  }
}

function corsOrigin(): Record<string, unknown> {
  return {
    created_at: '2026-05-03T00:00:00.000Z',
    environment_id: 'env_123',
    id: 'cor_123',
    pattern: 'https://example.com',
    updated_at: '2026-05-03T00:00:00.000Z',
  }
}

function customDomain(): Record<string, unknown> {
  return {
    certificate_status: 'ACTIVE',
    cname_record: 'images.example.com',
    cname_value: 'example.imgwire.dev',
    created_at: '2026-05-03T00:00:00.000Z',
    dcv_cname_record: '_dcv.images.example.com',
    dcv_cname_value: 'dcv.example.imgwire.dev',
    environment_id: 'env_123',
    hostname: 'images.example.com',
    id: 'dom_123',
    last_verified_at: null,
    status: 'CONNECTED',
    updated_at: '2026-05-03T00:00:00.000Z',
  }
}

function metricsStats(): Record<string, unknown> {
  const value = {pct_change: null, prev: 0, value: 1}

  return {
    cache_hit_ratio: value,
    requests: value,
    storage_bytes: value,
    transfer_bytes: value,
    transformations: value,
    uploads: value,
  }
}

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name]
    return
  }

  process.env[name] = value
}

describe('SDK topic commands', () => {
  const originalApiKey = process.env.IMGWIRE_API_KEY
  const originalBaseUrl = process.env.IMGWIRE_API_BASE_URL

  afterEach(() => {
    restoreEnv('IMGWIRE_API_KEY', originalApiKey)
    restoreEnv('IMGWIRE_API_BASE_URL', originalBaseUrl)
  })

  beforeEach(() => {
    process.env.IMGWIRE_API_KEY = API_KEY
  })

  it('lists images through the SDK', async () => {
    const server = await createImgwireApiServer()
    process.env.IMGWIRE_API_BASE_URL = server.baseUrl

    try {
      const {error, stdout} = await runCommand('images list --limit 25 --page 1')
      const result = JSON.parse(stdout) as {data: Array<{id: string}>}

      expect(error).to.equal(undefined)
      expect(result.data[0]?.id).to.equal('img_123')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/?limit=25&page=1')
    } finally {
      await server.close()
    }
  })

  it('uploads an image and pipes the ID into url generation', async () => {
    const server = await createImgwireApiServer()
    const directory = await mkdtemp(path.join(os.tmpdir(), 'imgwire-cli-'))
    const filePath = path.join(directory, 'hero.png')
    process.env.IMGWIRE_API_BASE_URL = server.baseUrl
    await writeFile(filePath, Buffer.from([0x89, 0x50, 0x4e, 0x47]))

    try {
      const upload = await runCommand(`images upload ${filePath}`)
      expect(upload.error).to.equal(undefined)
      expect(upload.stdout.trim()).to.equal('img_123')

      const generatedUrl = await runCliWithStdin(['image', 'url', '--width', '500', '--height', '500'], upload.stdout, {
        IMGWIRE_API_BASE_URL: server.baseUrl,
        IMGWIRE_API_KEY: API_KEY,
      })

      expect(generatedUrl.code).to.equal(0)
      expect(generatedUrl.stderr).to.equal('')
      expect(generatedUrl.stdout.trim()).to.contain('https://cdn.imgwire.dev')
      expect(generatedUrl.stdout.trim()).to.contain('width=500')
      expect(generatedUrl.stdout.trim()).to.contain('height=500')
    } finally {
      await server.close()
    }
  })

  it('wraps CORS origin, custom domain, and metrics SDK resources', async () => {
    const server = await createImgwireApiServer()
    process.env.IMGWIRE_API_BASE_URL = server.baseUrl

    try {
      const cors = await runCommand('cors-origin list')
      const domain = await runCommand('custom-domain create images.example.com')
      const metrics = await runCommand('metrics get-stats --interval hourly --tz UTC')

      expect(cors.error).to.equal(undefined)
      expect(domain.error).to.equal(undefined)
      expect(metrics.error).to.equal(undefined)
      expect((JSON.parse(cors.stdout) as {data: Array<{id: string}>}).data[0]?.id).to.equal('cor_123')
      expect((JSON.parse(domain.stdout) as {hostname: string}).hostname).to.equal('images.example.com')
      expect((JSON.parse(metrics.stdout) as {requests: {value: number}}).requests.value).to.equal(1)
    } finally {
      await server.close()
    }
  })
})
