import type {StandardUploadCreateSchema} from '@imgwire/node'

import {Command, Flags} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

const CONTENT_LENGTH_FIELD = 'content_length'
const FILE_NAME_FIELD = 'file_name'
const MIME_TYPE_FIELD = 'mime_type'

export default class ImagesCreateImage extends Command {
  static override description = 'Create a standard upload intent'
  static override examples = [
    `<%= config.bin %> <%= command.id %> --filename hero.png --mimetype image/png --contentlength 1024
`,
  ]
  static override flags = {
    contentlength: Flags.integer({
      description: 'Content length in bytes',
      min: 0,
    }),
    filename: Flags.string({
      description: 'Original file name',
      required: true,
    }),
    mimetype: Flags.string({
      description: 'Image MIME type',
    }),
    'upload-token': Flags.string({
      description: 'Optional upload token',
    }),
  }
  static override hiddenAliases = ['image create-image']

  public async run(): Promise<void> {
    const {flags} = await this.parse(ImagesCreateImage)
    const input = {
      [CONTENT_LENGTH_FIELD]: flags.contentlength,
      [FILE_NAME_FIELD]: flags.filename,
      [MIME_TYPE_FIELD]: flags.mimetype as StandardUploadCreateSchema['mime_type'] | undefined,
    } as StandardUploadCreateSchema
    const result = await runSdkCommand(this, (client) =>
      client.images.create(input, {uploadToken: flags['upload-token']}),
    )

    writeJson(this, result)
  }
}
