import type {UploadViaUrlInput} from '@imgwire/node'

import {Args, Command, Flags} from '@oclif/core'

import {runSdkCommand} from '../../lib/command.js'

export default class ImagesUploadViaUrl extends Command {
  static override args = {
    url: Args.string({description: 'Remote image URL to upload', required: true}),
  }
  static override description = 'Upload an image from a remote URL and print the image ID'
  static override examples = [
    `<%= config.bin %> <%= command.id %> https://assets.example.com/hero.jpg
`,
    `<%= config.bin %> <%= command.id %> https://assets.example.com/hero.jpg --filename hero.jpg --mimetype image/jpeg
`,
  ]
  static override flags = {
    filename: Flags.string({
      description: 'Original file name',
    }),
    'idempotency-key': Flags.string({
      description: 'Idempotency key for the upload request',
    }),
    mimetype: Flags.string({
      description: 'Image MIME type',
    }),
    purpose: Flags.string({
      description: 'Optional upload purpose',
    }),
  }
  static override hiddenAliases = ['image upload-via-url']

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(ImagesUploadViaUrl)
    const input: UploadViaUrlInput = {
      fileName: flags.filename,
      idempotencyKey: flags['idempotency-key'],
      mimeType: flags.mimetype as undefined | UploadViaUrlInput['mimeType'],
      purpose: flags.purpose,
      url: args.url,
    }

    const image = await runSdkCommand(this, (client) => client.images.uploadViaUrl(input))

    this.log(image.id)
  }
}
