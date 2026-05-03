/* eslint-disable camelcase, complexity */
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

async function withApiServer<T>(action: (server: TestServer) => Promise<T>): Promise<T> {
  const server = await createImgwireApiServer()
  process.env.IMGWIRE_API_BASE_URL = server.baseUrl

  try {
    return await action(server)
  } finally {
    await server.close()
  }
}

async function runCliWithStdin(args: string[], input: string, env: NodeJS.ProcessEnv): Promise<CliResult> {
  const child = spawn(process.execPath, ['--loader', 'ts-node/esm', path.join(process.cwd(), 'bin/dev.js'), ...args], {
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

  if (request.method === 'DELETE' && url.pathname === '/api/v1/images/img_123') {
    writeJson(response, 200, {id: 'img_123'})
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/images/standard_upload') {
    writeJson(response, 200, {
      image: image(),
      upload_url: `${getBaseUrl()}/upload`,
    })
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/images/token') {
    writeJson(response, 200, uploadToken())
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/images/downloads') {
    writeJson(response, 200, bulkDownloadJob())
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/images/downloads/job_123') {
    writeJson(response, 200, bulkDownloadJob())
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/images/bulk_delete') {
    writeJson(response, 200, {img_123: null, img_456: null})
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/cors_origins/') {
    writeJson(response, 200, [corsOrigin()], {'x-limit': '25', 'x-page': '1', 'x-total-count': '1'})
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/cors_origins/') {
    writeJson(response, 200, corsOrigin())
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/cors_origins/cor_123') {
    writeJson(response, 200, corsOrigin())
    return
  }

  if (request.method === 'PATCH' && url.pathname === '/api/v1/cors_origins/cor_123') {
    writeJson(response, 200, corsOrigin('https://updated.example.com'))
    return
  }

  if (request.method === 'DELETE' && url.pathname === '/api/v1/cors_origins/cor_123') {
    writeJson(response, 200, {id: 'cor_123'})
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/custom_domain/') {
    writeJson(response, 200, customDomain())
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/custom_domain/') {
    writeJson(response, 200, customDomain())
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/v1/custom_domain/test_connection') {
    writeJson(response, 200, customDomain())
    return
  }

  if (request.method === 'DELETE' && url.pathname === '/api/v1/custom_domain/') {
    writeJson(response, 200, {id: 'dom_123'})
    return
  }

  if (request.method === 'GET' && url.pathname === '/api/v1/metrics/datasets') {
    writeJson(response, 200, metricsDatasets())
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

function uploadToken(): Record<string, unknown> {
  return {
    created_at: '2026-05-03T00:00:00.000Z',
    environment_id: 'env_123',
    expires_at: '2026-05-04T00:00:00.000Z',
    id: 'upt_123',
    token: 'upload_token_123',
    updated_at: '2026-05-03T00:00:00.000Z',
    used_at: null,
  }
}

function bulkDownloadJob(): Record<string, unknown> {
  return {
    created_at: '2026-05-03T00:00:00.000Z',
    download_url: 'https://downloads.imgwire.dev/job_123.zip',
    environment_id: 'env_123',
    id: 'job_123',
    image_ids: ['img_123', 'img_456'],
    status: 'READY',
    updated_at: '2026-05-03T00:00:00.000Z',
  }
}

function corsOrigin(pattern = 'https://example.com'): Record<string, unknown> {
  return {
    created_at: '2026-05-03T00:00:00.000Z',
    environment_id: 'env_123',
    id: 'cor_123',
    pattern,
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

function metricsDatasets(): Record<string, unknown> {
  const timestamp = '2026-05-03T00:00:00.000Z'

  return {
    cache_hit_ratio: [{label: timestamp, value: 0.75}],
    requests: [{requests: 10, timestamp}],
    storage_bytes: [{storage_bytes_added: 4, storage_bytes_current: 100, timestamp}],
    transfer_bytes: [{timestamp, transfer_bytes: 200}],
    transformations: [{timestamp, transformations: 3}],
    uploads: [{timestamp, uploads: 1}],
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

function parseJson<T>(stdout: string): T {
  return JSON.parse(stdout) as T
}

function requestBody<T>(request: CapturedRequest): T {
  return JSON.parse(request.body) as T
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

  it('images list lists images', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['images', 'list', '--limit', '25', '--page', '1'])
      const result = parseJson<{data: Array<{id: string}>}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.data[0]?.id).to.equal('img_123')
      expect(server.requests[0]?.method).to.equal('GET')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/?limit=25&page=1')
    })
  })

  it('images get-image retrieves an image', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['images', 'get-image', 'img_123'])
      const result = parseJson<{id: string}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('img_123')
      expect(server.requests[0]?.method).to.equal('GET')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/img_123')
    })
  })

  it('images create-image creates an upload intent', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand([
        'images',
        'create-image',
        '--filename',
        'hero.png',
        '--mimetype',
        'image/png',
        '--contentlength',
        '1024',
        '--upload-token',
        'upload_token_123',
      ])
      const result = parseJson<{image: {id: string}; upload_url: string}>(stdout)
      const body = requestBody<{content_length: number; file_name: string; mime_type: string}>(server.requests[0]!)

      expect(error).to.equal(undefined)
      expect(result.image.id).to.equal('img_123')
      expect(result.upload_url).to.equal(`${server.baseUrl}/upload`)
      expect(server.requests[0]?.method).to.equal('POST')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/standard_upload?upload_token=upload_token_123')
      expect(body).to.deep.equal({content_length: 1024, file_name: 'hero.png', mime_type: 'image/png'})
    })
  })

  it('images upload uploads a file and prints the image ID', async () => {
    await withApiServer(async (server) => {
      const directory = await mkdtemp(path.join(os.tmpdir(), 'imgwire-cli-'))
      const filePath = path.join(directory, 'hero.png')
      await writeFile(filePath, Buffer.from([0x89, 0x50, 0x4e, 0x47]))

      const {error, stdout} = await runCommand(['images', 'upload', filePath])
      const body = requestBody<{content_length: number; file_name: string; mime_type: string}>(server.requests[0]!)

      expect(error).to.equal(undefined)
      expect(stdout.trim()).to.equal('img_123')
      expect(server.requests[0]?.method).to.equal('POST')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/standard_upload')
      expect(body).to.deep.equal({content_length: 4, file_name: 'hero.png', mime_type: 'image/png'})
      expect(server.requests[1]?.method).to.equal('PUT')
      expect(server.requests[1]?.url).to.equal('/upload')
    })
  })

  it('images create-upload-token creates an upload token', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['images', 'create-upload-token'])
      const result = parseJson<{id: string; token: string}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('upt_123')
      expect(result.token).to.equal('upload_token_123')
      expect(server.requests[0]?.method).to.equal('POST')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/token')
    })
  })

  it('images create-bulk-download-job creates a job', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['images', 'create-bulk-download-job', '--image-ids', 'img_123,img_456'])
      const result = parseJson<{id: string}>(stdout)
      const body = requestBody<{image_ids: string[]}>(server.requests[0]!)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('job_123')
      expect(server.requests[0]?.method).to.equal('POST')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/downloads')
      expect(body.image_ids).to.deep.equal(['img_123', 'img_456'])
    })
  })

  it('images get-bulk-download-job retrieves a job', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['images', 'get-bulk-download-job', 'job_123'])
      const result = parseJson<{download_url: string; id: string}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('job_123')
      expect(result.download_url).to.contain('job_123.zip')
      expect(server.requests[0]?.method).to.equal('GET')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/downloads/job_123')
    })
  })

  it('images bulk-delete deletes multiple images', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['images', 'bulk-delete', '--image-ids', 'img_123,img_456'])
      const result = parseJson<Record<string, null | string>>(stdout)
      const body = requestBody<{image_ids: string[]}>(server.requests[0]!)

      expect(error).to.equal(undefined)
      expect(result).to.deep.equal({img_123: null, img_456: null})
      expect(server.requests[0]?.method).to.equal('POST')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/bulk_delete')
      expect(body.image_ids).to.deep.equal(['img_123', 'img_456'])
    })
  })

  it('images delete deletes an image', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['images', 'delete', 'img_123'])
      const result = parseJson<{id: string}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('img_123')
      expect(server.requests[0]?.method).to.equal('DELETE')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/img_123')
    })
  })

  it('images url generates a transformed CDN URL from an image ID', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand([
        'images',
        'url',
        'img_123',
        '--width',
        '500',
        '--height',
        '500',
        '--resizing-type',
        'cover',
      ])

      expect(error).to.equal(undefined)
      expect(stdout.trim()).to.contain('https://cdn.imgwire.dev')
      expect(stdout.trim()).to.contain('height=500')
      expect(stdout.trim()).to.contain('resizing_type=cover')
      expect(stdout.trim()).to.contain('width=500')
      expect(server.requests[0]?.method).to.equal('GET')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/img_123')
    })
  })

  it('image url reads an uploaded image ID from stdin', async () => {
    await withApiServer(async (server) => {
      const generatedUrl = await runCliWithStdin(['image', 'url', '--width', '500', '--height', '500'], 'img_123\n', {
        IMGWIRE_API_BASE_URL: server.baseUrl,
        IMGWIRE_API_KEY: API_KEY,
      })

      expect(generatedUrl.code).to.equal(0)
      expect(generatedUrl.stderr).to.equal('')
      expect(generatedUrl.stdout.trim()).to.contain('https://cdn.imgwire.dev')
      expect(generatedUrl.stdout.trim()).to.contain('width=500')
      expect(generatedUrl.stdout.trim()).to.contain('height=500')
      expect(server.requests[0]?.method).to.equal('GET')
      expect(server.requests[0]?.url).to.equal('/api/v1/images/img_123')
    })
  })

  it('custom-domain create creates the custom domain', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['custom-domain', 'create', 'images.example.com'])
      const result = parseJson<{hostname: string}>(stdout)
      const body = requestBody<{hostname: string}>(server.requests[0]!)

      expect(error).to.equal(undefined)
      expect(result.hostname).to.equal('images.example.com')
      expect(server.requests[0]?.method).to.equal('POST')
      expect(server.requests[0]?.url).to.equal('/api/v1/custom_domain/')
      expect(body.hostname).to.equal('images.example.com')
    })
  })

  it('custom-domain get-custom-domain retrieves the custom domain', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['custom-domain', 'get-custom-domain'])
      const result = parseJson<{id: string}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('dom_123')
      expect(server.requests[0]?.method).to.equal('GET')
      expect(server.requests[0]?.url).to.equal('/api/v1/custom_domain/')
    })
  })

  it('custom-domain test-connection tests the custom domain connection', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['custom-domain', 'test-connection'])
      const result = parseJson<{status: string}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.status).to.equal('CONNECTED')
      expect(server.requests[0]?.method).to.equal('POST')
      expect(server.requests[0]?.url).to.equal('/api/v1/custom_domain/test_connection')
    })
  })

  it('custom-domain delete deletes the custom domain', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['custom-domain', 'delete'])
      const result = parseJson<{id: string}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('dom_123')
      expect(server.requests[0]?.method).to.equal('DELETE')
      expect(server.requests[0]?.url).to.equal('/api/v1/custom_domain/')
    })
  })

  it('cors-origin list lists CORS origins', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['cors-origin', 'list'])
      const result = parseJson<{data: Array<{id: string}>}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.data[0]?.id).to.equal('cor_123')
      expect(server.requests[0]?.method).to.equal('GET')
      expect(server.requests[0]?.url).to.equal('/api/v1/cors_origins/?limit=25&page=1')
    })
  })

  it('cors-origin create creates a CORS origin', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['cors-origin', 'create', 'https://example.com'])
      const result = parseJson<{id: string}>(stdout)
      const body = requestBody<{pattern: string}>(server.requests[0]!)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('cor_123')
      expect(server.requests[0]?.method).to.equal('POST')
      expect(server.requests[0]?.url).to.equal('/api/v1/cors_origins/')
      expect(body.pattern).to.equal('https://example.com')
    })
  })

  it('cors-origin get-cors-origin retrieves a CORS origin', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['cors-origin', 'get-cors-origin', 'cor_123'])
      const result = parseJson<{id: string}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('cor_123')
      expect(server.requests[0]?.method).to.equal('GET')
      expect(server.requests[0]?.url).to.equal('/api/v1/cors_origins/cor_123')
    })
  })

  it('cors-origin update updates a CORS origin', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['cors-origin', 'update', 'cor_123', 'https://updated.example.com'])
      const result = parseJson<{pattern: string}>(stdout)
      const body = requestBody<{pattern: string}>(server.requests[0]!)

      expect(error).to.equal(undefined)
      expect(result.pattern).to.equal('https://updated.example.com')
      expect(server.requests[0]?.method).to.equal('PATCH')
      expect(server.requests[0]?.url).to.equal('/api/v1/cors_origins/cor_123')
      expect(body.pattern).to.equal('https://updated.example.com')
    })
  })

  it('cors-origin delete deletes a CORS origin', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand(['cors-origin', 'delete', 'cor_123'])
      const result = parseJson<{id: string}>(stdout)

      expect(error).to.equal(undefined)
      expect(result.id).to.equal('cor_123')
      expect(server.requests[0]?.method).to.equal('DELETE')
      expect(server.requests[0]?.url).to.equal('/api/v1/cors_origins/cor_123')
    })
  })

  it('metrics get-datasets retrieves metrics datasets', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand([
        'metrics',
        'get-datasets',
        '--date-start',
        '2026-05-03T00:00:00.000Z',
        '--date-end',
        '2026-05-03T23:59:59.999Z',
        '--interval',
        'hourly',
        '--tz',
        'UTC',
      ])
      const result = parseJson<{requests: Array<{requests: number}>}>(stdout)
      const requestUrl = new URL(server.requests[0]?.url ?? '/', server.baseUrl)

      expect(error).to.equal(undefined)
      expect(result.requests[0]?.requests).to.equal(10)
      expect(server.requests[0]?.method).to.equal('GET')
      expect(requestUrl.pathname).to.equal('/api/v1/metrics/datasets')
      expect(requestUrl.searchParams.get('interval')).to.equal('HOURLY')
      expect(requestUrl.searchParams.get('tz')).to.equal('UTC')
    })
  })

  it('metrics get-stats retrieves metrics stats', async () => {
    await withApiServer(async (server) => {
      const {error, stdout} = await runCommand([
        'metrics',
        'get-stats',
        '--date-start',
        '2026-05-03T00:00:00.000Z',
        '--date-end',
        '2026-05-03T23:59:59.999Z',
        '--interval',
        'hourly',
        '--tz',
        'UTC',
      ])
      const result = parseJson<{requests: {value: number}}>(stdout)
      const requestUrl = new URL(server.requests[0]?.url ?? '/', server.baseUrl)

      expect(error).to.equal(undefined)
      expect(result.requests.value).to.equal(1)
      expect(server.requests[0]?.method).to.equal('GET')
      expect(requestUrl.pathname).to.equal('/api/v1/metrics/stats')
      expect(requestUrl.searchParams.get('interval')).to.equal('HOURLY')
      expect(requestUrl.searchParams.get('tz')).to.equal('UTC')
    })
  })
})
