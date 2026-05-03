import {Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class CustomDomainTestConnection extends Command {
  static override description = 'Test the custom domain connection'
  static override examples = [
    `<%= config.bin %> <%= command.id %>
`,
  ]
  static override flags = {}

  public async run(): Promise<void> {
    await this.parse(CustomDomainTestConnection)

    const result = await runSdkCommand(this, (client) => client.customDomain.testConnection())

    writeJson(this, result)
  }
}
