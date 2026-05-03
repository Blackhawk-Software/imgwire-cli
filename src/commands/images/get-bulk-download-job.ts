import {Args, Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class ImagesGetBulkDownloadJob extends Command {
  static override args = {
    id: Args.string({description: 'Bulk download job ID', required: true}),
  }
  static override description = 'Retrieve a bulk image download job'
  static override examples = [
    `<%= config.bin %> <%= command.id %> job_123
`,
  ]
  static override flags = {}
  static override hiddenAliases = ['image get-bulk-download-job']

  public async run(): Promise<void> {
    const {args} = await this.parse(ImagesGetBulkDownloadJob)
    const result = await runSdkCommand(this, (client) => client.images.retrieveBulkDownloadJob(args.id))

    writeJson(this, result)
  }
}
