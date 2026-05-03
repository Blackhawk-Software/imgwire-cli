import {Args, Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class CorsOriginUpdate extends Command {
  static override args = {
    id: Args.string({description: 'CORS origin ID', required: true}),
    pattern: Args.string({description: 'Updated CORS origin pattern', required: true}),
  }
  static override description = 'Update a CORS origin'
  static override examples = [
    `<%= config.bin %> <%= command.id %> cor_123 https://example.com
`,
  ]
  static override flags = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(CorsOriginUpdate)
    const result = await runSdkCommand(this, (client) => client.corsOrigins.update(args.id, {pattern: args.pattern}))

    writeJson(this, result)
  }
}
