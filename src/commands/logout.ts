import {Command} from '@oclif/core'

import {deleteStoredApiKey} from '../lib/credentials.js'

export default class Logout extends Command {
  static override description = 'Remove the stored imgwire Server API Key'
  static override examples = [
    `<%= config.bin %> <%= command.id %>
`,
  ]
  static override flags = {}

  public async run(): Promise<void> {
    await this.parse(Logout)

    let deleted
    try {
      deleted = await deleteStoredApiKey()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.error(`Could not remove the stored Server API Key: ${message}`, {exit: 1})
    }

    this.log(deleted ? 'Removed the stored imgwire Server API Key.' : 'No stored imgwire Server API Key found.')

    if (process.env.IMGWIRE_API_KEY?.trim()) {
      this.warn('IMGWIRE_API_KEY is still set in the environment and will continue to be used.')
    }
  }
}
