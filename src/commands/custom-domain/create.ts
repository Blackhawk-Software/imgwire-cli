import {Args, Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class CustomDomainCreate extends Command {
  static override args = {
    hostname: Args.string({description: 'Hostname to configure', required: true}),
  }
  static override description = 'Create the custom domain'
  static override examples = [
    `<%= config.bin %> <%= command.id %> images.example.com
`,
  ]
  static override flags = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(CustomDomainCreate)
    const result = await runSdkCommand(this, (client) => client.customDomain.create({hostname: args.hostname}))

    writeJson(this, result)
  }
}
