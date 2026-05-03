import {Command} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'

export default class ImagesCreateUploadToken extends Command {
  static override description = 'Create an upload token'
  static override examples = [
    `<%= config.bin %> <%= command.id %>
`,
  ]
  static override flags = {}
  static override hiddenAliases = ['image create-upload-token']

  public async run(): Promise<void> {
    const result = await runSdkCommand(this, (client) => client.images.createUploadToken())

    writeJson(this, result)
  }
}
