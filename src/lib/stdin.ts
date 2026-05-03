import {stdin} from 'node:process'
import {Readable} from 'node:stream'

export async function readStdin(input: Readable = stdin): Promise<string> {
  input.setEncoding('utf8')

  let value = ''
  for await (const chunk of input) {
    value += chunk
  }

  return value
}
