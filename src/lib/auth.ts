import {HttpError, ImgwireClient} from '@imgwire/node'

import {getStoredApiKey} from './credentials.js'

const API_BASE_URL_ENV = 'IMGWIRE_API_BASE_URL'
const API_KEY_ENV = 'IMGWIRE_API_KEY'

export type ApiKeyCredential = {
  apiKey: string
  source: 'environment' | 'keyring'
}

export function normalizeApiKey(apiKey: string): string {
  return apiKey.trim()
}

export function maskApiKey(apiKey: string): string {
  const normalized = normalizeApiKey(apiKey)

  if (normalized.length <= 10) {
    return '********'
  }

  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`
}

export function getImgwireBaseUrl(): string | undefined {
  const baseUrl = process.env[API_BASE_URL_ENV]?.trim()

  return baseUrl || undefined
}

export async function resolveApiKey(): Promise<ApiKeyCredential | null> {
  const envApiKey = process.env[API_KEY_ENV]?.trim()

  if (envApiKey) {
    return {apiKey: envApiKey, source: 'environment'}
  }

  const storedApiKey = await getStoredApiKey()

  if (storedApiKey) {
    return {apiKey: storedApiKey, source: 'keyring'}
  }

  return null
}

export function createImgwireClient(apiKey: string): ImgwireClient {
  return new ImgwireClient({
    apiKey,
    baseUrl: getImgwireBaseUrl(),
    timeoutMs: 10_000,
  })
}

export async function validateApiKey(apiKey: string): Promise<void> {
  const client = createImgwireClient(apiKey)

  await client.images.list({limit: 1, page: 1})
}

export function formatApiError(error: unknown): string {
  if (error instanceof HttpError) {
    const statusCode = error.statusCode ?? error.response.statusCode

    if (statusCode === 401 || statusCode === 403) {
      return 'The Server API Key was rejected by imgwire.'
    }

    return `imgwire API request failed${statusCode ? ` with HTTP ${statusCode}` : ''}.`
  }

  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

export function apiKeySourceLabel(source: ApiKeyCredential['source']): string {
  return source === 'environment' ? API_KEY_ENV : 'operating system credential store'
}
