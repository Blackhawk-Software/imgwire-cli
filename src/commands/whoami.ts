import {Command} from '@oclif/core'

import type {ApiKeyCredential} from '../lib/auth.js'

import {apiKeySourceLabel, formatApiError, maskApiKey, resolveApiKey, validateApiKey} from '../lib/auth.js'

export default class Whoami extends Command {
  static override description = 'Show the current imgwire authentication status'
  static override examples = [
    `<%= config.bin %> <%= command.id %>
`,
  ]
  static override flags = {}

  public async run(): Promise<void> {
    await this.parse(Whoami)

    let credential: ApiKeyCredential | null
    try {
      credential = await resolveApiKey()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.error(`Could not read the stored Server API Key: ${message}`, {exit: 1})
    }

    if (!credential) {
      this.error('Not logged in. Run `imgwire login` or set IMGWIRE_API_KEY.', {exit: 1})
    }

    try {
      await validateApiKey(credential.apiKey)
    } catch (error) {
      this.error(formatApiError(error), {exit: 1})
    }

    this.log('Authenticated with imgwire.')
    this.log(`Source: ${apiKeySourceLabel(credential.source)}`)
    this.log(`API key: ${maskApiKey(credential.apiKey)}`)
  }
}
