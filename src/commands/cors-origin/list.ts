import {Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'
import {paginationFlags} from '../../lib/flags.js'

export default class CorsOriginList extends Command {
  static override description = 'List CORS origins'
  static override examples = [
    `<%= config.bin %> <%= command.id %> --limit 25 --page 1
`,
  ]
  static override flags = paginationFlags

  public async run(): Promise<void> {
    const {flags} = await this.parse(CorsOriginList)
    const result = await runSdkCommand(this, (client) =>
      client.corsOrigins.list({limit: flags.limit, page: flags.page}),
    )

    writeJson(this, result)
  }
}
