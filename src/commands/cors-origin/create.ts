import {Args, Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class CorsOriginCreate extends Command {
  static override args = {
    pattern: Args.string({description: 'CORS origin pattern', required: true}),
  }
  static override description = 'Create a CORS origin'
  static override examples = [
    `<%= config.bin %> <%= command.id %> https://example.com
`,
  ]
  static override flags = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(CorsOriginCreate)
    const result = await runSdkCommand(this, (client) => client.corsOrigins.create({pattern: args.pattern}))

    writeJson(this, result)
  }
}
