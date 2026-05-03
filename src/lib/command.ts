import type {ImgwireClient} from '@imgwire/node'
import type {Command} from '@oclif/core'

import {createImgwireClient, formatApiError, resolveApiKey} from './auth.js'

export async function getClient(command: Command): Promise<ImgwireClient> {
  let credential

  try {
    credential = await resolveApiKey()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    command.error(`Could not read the stored Server API Key: ${message}`, {exit: 1})
  }

  if (!credential) {
    command.error('Not logged in. Run `imgwire login` or set IMGWIRE_API_KEY.', {exit: 1})
  }

  return createImgwireClient(credential.apiKey)
}

export async function runSdkCommand<T>(command: Command, action: (client: ImgwireClient) => Promise<T>): Promise<T> {
  const client = await getClient(command)

  try {
    return await action(client)
  } catch (error) {
    command.error(formatApiError(error), {exit: 1})
  }
}

export function writeJson(command: Command, value: unknown): void {
  command.log(JSON.stringify(value, null, 2))
}
