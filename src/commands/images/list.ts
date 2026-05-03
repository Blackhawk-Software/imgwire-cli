import {Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'
import {paginationFlags} from '../../lib/flags.js'

export default class ImagesList extends Command {
  static override description = 'List images'
  static override examples = [
    `<%= config.bin %> <%= command.id %> --limit 25 --page 1
`,
  ]
  static override flags = paginationFlags
  static override hiddenAliases = ['image list']

  public async run(): Promise<void> {
    const {flags} = await this.parse(ImagesList)
    const result = await runSdkCommand(this, (client) => client.images.list({limit: flags.limit, page: flags.page}))

    writeJson(this, result)
  }
}
