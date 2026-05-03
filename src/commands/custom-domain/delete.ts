import {Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class CustomDomainDelete extends Command {
  static override description = 'Delete the custom domain'
  static override examples = [
    `<%= config.bin %> <%= command.id %>
`,
  ]
  static override flags = {}

  public async run(): Promise<void> {
    await this.parse(CustomDomainDelete)

    const result = await runSdkCommand(this, (client) => client.customDomain.delete())

    writeJson(this, result)
  }
}
