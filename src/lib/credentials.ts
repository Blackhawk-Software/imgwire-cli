const CREDENTIAL_ACCOUNT = 'server-api-key'
const CREDENTIAL_SERVICE = 'imgwire'
const TEST_CREDENTIAL_STORE_ENV = 'IMGWIRE_TEST_CREDENTIAL_STORE'

export type CredentialStore = {
  deleteApiKey(): Promise<boolean>
  getApiKey(): Promise<null | string>
  setApiKey(apiKey: string): Promise<void>
}

const memoryCredentials = new Map<string, string>()

class KeyringCredentialStore implements CredentialStore {
  async deleteApiKey(): Promise<boolean> {
    const {Entry} = await import('@napi-rs/keyring')
    const entry = new Entry(CREDENTIAL_SERVICE, CREDENTIAL_ACCOUNT)

    try {
      return entry.deletePassword()
    } catch (error) {
      if (isNoEntryError(error)) {
        return false
      }

      throw error
    }
  }

  async getApiKey(): Promise<null | string> {
    const {Entry} = await import('@napi-rs/keyring')
    const entry = new Entry(CREDENTIAL_SERVICE, CREDENTIAL_ACCOUNT)

    try {
      return entry.getPassword()
    } catch (error) {
      if (isNoEntryError(error)) {
        return null
      }

      throw error
    }
  }

  async setApiKey(apiKey: string): Promise<void> {
    const {Entry} = await import('@napi-rs/keyring')
    const entry = new Entry(CREDENTIAL_SERVICE, CREDENTIAL_ACCOUNT)

    entry.setPassword(apiKey)
  }
}

class MemoryCredentialStore implements CredentialStore {
  async deleteApiKey(): Promise<boolean> {
    return memoryCredentials.delete(CREDENTIAL_ACCOUNT)
  }

  async getApiKey(): Promise<null | string> {
    return memoryCredentials.get(CREDENTIAL_ACCOUNT) ?? null
  }

  async setApiKey(apiKey: string): Promise<void> {
    memoryCredentials.set(CREDENTIAL_ACCOUNT, apiKey)
  }
}

export function clearMemoryCredentialStore(): void {
  memoryCredentials.clear()
}

export function createCredentialStore(): CredentialStore {
  if (process.env[TEST_CREDENTIAL_STORE_ENV] === 'memory') {
    return new MemoryCredentialStore()
  }

  return new KeyringCredentialStore()
}

export async function deleteStoredApiKey(store = createCredentialStore()): Promise<boolean> {
  return store.deleteApiKey()
}

export async function getStoredApiKey(store = createCredentialStore()): Promise<null | string> {
  return store.getApiKey()
}

export async function storeApiKey(apiKey: string, store = createCredentialStore()): Promise<void> {
  await store.setApiKey(apiKey)
}

function isNoEntryError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  return `${error.name} ${error.message}`.toLowerCase().includes('noentry')
}
