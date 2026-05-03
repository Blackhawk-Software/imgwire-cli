import type {ImageDownloadJobCreateSchema} from '@imgwire/node'

import {Command, Flags} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'
import {parseCommaSeparatedList} from '../../lib/flags.js'

const IMAGE_IDS_FIELD = 'image_ids'

export default class ImagesCreateBulkDownloadJob extends Command {
  static override description = 'Create a bulk image download job'
  static override examples = [
    `<%= config.bin %> <%= command.id %> --image-ids img_123,img_456
`,
  ]
  static override flags = {
    'image-ids': Flags.string({
      description: 'Comma-separated image IDs',
      required: true,
    }),
  }
  static override hiddenAliases = ['image create-bulk-download-job']

  public async run(): Promise<void> {
    const {flags} = await this.parse(ImagesCreateBulkDownloadJob)
    const imageIds = parseCommaSeparatedList(flags['image-ids'])
    const input = {[IMAGE_IDS_FIELD]: imageIds} as ImageDownloadJobCreateSchema
    const result = await runSdkCommand(this, (client) => client.images.createBulkDownloadJob(input))

    writeJson(this, result)
  }
}
