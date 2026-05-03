import {Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class CustomDomainGetCustomDomain extends Command {
  static override description = 'Retrieve the custom domain'
  static override examples = [
    `<%= config.bin %> <%= command.id %>
`,
  ]
  static override flags = {}

  public async run(): Promise<void> {
    await this.parse(CustomDomainGetCustomDomain)

    const result = await runSdkCommand(this, (client) => client.customDomain.retrieve())

    writeJson(this, result)
  }
}
