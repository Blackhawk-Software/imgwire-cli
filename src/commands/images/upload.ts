import {Args, Command} from '@oclif/core'

import {runSdkCommand} from '../../lib/command.js'
import {resolveUploadFile} from '../../lib/files.js'

export default class ImagesUpload extends Command {
  static override args = {
    path: Args.string({description: 'Path to an image file to upload', required: true}),
  }
  static override description = 'Upload an image and print the image ID'
  static override examples = [
    `<%= config.bin %> <%= command.id %> ./hero.png
`,
    `<%= config.bin %> <%= command.id %> ./hero.png | <%= config.bin %> images url --width 500 --height 500
`,
  ]
  static override flags = {}
  static override hiddenAliases = ['image upload']

  public async run(): Promise<void> {
    const {args} = await this.parse(ImagesUpload)
    let uploadInput

    try {
      uploadInput = await resolveUploadFile(args.path)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.error(message, {exit: 1})
    }

    const image = await runSdkCommand(this, (client) => client.images.upload(uploadInput))

    this.log(image.id)
  }
}
