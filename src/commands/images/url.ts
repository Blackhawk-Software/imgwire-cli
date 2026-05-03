import {Args, Command} from '@oclif/core'
import {stdin} from 'node:process'

import {runSdkCommand} from '../../lib/command.js'
import {buildImageUrlOptions, imageUrlFlags} from '../../lib/image-url-options.js'
import {readStdin} from '../../lib/stdin.js'

export default class ImagesUrl extends Command {
  static override args = {
    id: Args.string({description: 'Image ID. Reads from stdin when omitted.', required: false}),
  }
  static override description = 'Generate a CDN URL for an image'
  static override examples = [
    `<%= config.bin %> <%= command.id %> img_123 --width 500 --height 500 --resizing-type cover
`,
    `<%= config.bin %> images upload ./hero.png | <%= config.bin %> <%= command.id %> --width 500
`,
  ]
  static override flags = imageUrlFlags
  static override hiddenAliases = ['image url']

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ImagesUrl)
    const imageId = args.id ?? (stdin.isTTY ? '' : (await readStdin()).trim())

    if (!imageId) {
      this.error('An image ID is required as an argument or through stdin.', {exit: 1})
    }

    let options
    try {
      options = buildImageUrlOptions(flags)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.error(`Invalid image URL transform value: ${message}`, {exit: 1})
    }

    const image = await runSdkCommand(this, (client) => client.images.retrieve(imageId))

    this.log(image.url(options))
  }
}
