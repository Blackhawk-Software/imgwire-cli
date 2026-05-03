import {password} from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'

import {formatApiError, maskApiKey, normalizeApiKey, validateApiKey} from '../lib/auth.js'
import {storeApiKey} from '../lib/credentials.js'
import {readStdin} from '../lib/stdin.js'

export default class Login extends Command {
  static override description = 'Authenticate with an imgwire Server API Key'
  static override examples = [
    `<%= config.bin %> <%= command.id %>
`,
    `printf '%s' "$IMGWIRE_API_KEY" | <%= config.bin %> <%= command.id %> --api-key-stdin
`,
  ]
  static override flags = {
    'api-key-stdin': Flags.boolean({
      description: 'Read the Server API Key from stdin instead of prompting',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Login)
    const apiKey = await this.readApiKey(flags['api-key-stdin'])

    if (!apiKey) {
      this.error('A Server API Key is required.', {exit: 1})
    }

    this.log('Validating Server API Key...')

    try {
      await validateApiKey(apiKey)
    } catch (error) {
      this.error(formatApiError(error), {exit: 1})
    }

    try {
      await storeApiKey(apiKey)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.error(`Could not store the Server API Key in the operating system credential store: ${message}`, {exit: 1})
    }

    this.log(`Logged in to imgwire with ${maskApiKey(apiKey)}.`)
    this.log('Stored Server API Key in the operating system credential store.')
  }

  private async readApiKey(readFromStdin: boolean | undefined): Promise<string> {
    if (readFromStdin) {
      return normalizeApiKey(await readStdin())
    }

    const envApiKey = process.env.IMGWIRE_API_KEY?.trim()
    if (envApiKey) {
      return envApiKey
    }

    return normalizeApiKey(
      await password({
        mask: '*',
        message: 'Server API Key:',
        validate(value) {
          return normalizeApiKey(value) ? true : 'Server API Key is required'
        },
      }),
    )
  }
}
