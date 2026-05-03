import {Args, Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class ImagesGetImage extends Command {
  static override args = {
    'image-id': Args.string({description: 'Image ID to retrieve', required: true}),
  }
  static override description = 'Retrieve an image'
  static override examples = [
    `<%= config.bin %> <%= command.id %> img_123
`,
  ]
  static override flags = {}
  static override hiddenAliases = ['image get-image']

  public async run(): Promise<void> {
    const {args} = await this.parse(ImagesGetImage)
    const result = await runSdkCommand(this, (client) => client.images.retrieve(args['image-id']))

    writeJson(this, result)
  }
}
