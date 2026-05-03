import {Args, Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class CorsOriginDelete extends Command {
  static override args = {
    id: Args.string({description: 'CORS origin ID', required: true}),
  }
  static override description = 'Delete a CORS origin'
  static override examples = [
    `<%= config.bin %> <%= command.id %> cor_123
`,
  ]
  static override flags = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(CorsOriginDelete)
    const result = await runSdkCommand(this, (client) => client.corsOrigins.delete(args.id))

    writeJson(this, result)
  }
}
