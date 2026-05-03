import {Args, Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class ImagesDelete extends Command {
  static override args = {
    id: Args.string({description: 'Image ID to delete', required: true}),
  }
  static override description = 'Delete an image'
  static override examples = [
    `<%= config.bin %> <%= command.id %> img_123
`,
  ]
  static override flags = {}
  static override hiddenAliases = ['image delete']

  public async run(): Promise<void> {
    const {args} = await this.parse(ImagesDelete)
    const result = await runSdkCommand(this, (client) => client.images.delete(args.id))

    writeJson(this, result)
  }
}
