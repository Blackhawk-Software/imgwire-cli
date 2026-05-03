import {stdin} from 'node:process'
import {Readable} from 'node:stream'

let stdinOverride: Readable | undefined

export function hasReadableStdin(): boolean {
  return stdinOverride !== undefined || !stdin.isTTY
}

export async function readStdin(input: Readable = stdinOverride ?? stdin): Promise<string> {
  input.setEncoding('utf8')

  let value = ''
  for await (const chunk of input) {
    value += chunk
  }

  return value
}

export function setStdinForTesting(input: Readable | undefined): void {
  stdinOverride = input
}
