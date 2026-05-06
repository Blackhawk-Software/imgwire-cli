import {stdin} from 'node:process'
import {Readable} from 'node:stream'

const STDIN_OVERRIDE_KEY = '__imgwireCliStdinOverride__'

type StdinGlobal = typeof globalThis & {
  [STDIN_OVERRIDE_KEY]?: Readable
}

export function hasReadableStdin(): boolean {
  return getStdinOverride() !== undefined || !stdin.isTTY
}

export async function readStdin(input: Readable = getStdinOverride() ?? stdin): Promise<string> {
  input.setEncoding('utf8')

  let value = ''
  for await (const chunk of input) {
    value += chunk
  }

  return value
}

export function setStdinForTesting(input: Readable | undefined): void {
  const stdinGlobal = globalThis as StdinGlobal

  if (input === undefined) {
    delete stdinGlobal[STDIN_OVERRIDE_KEY]
    return
  }

  stdinGlobal[STDIN_OVERRIDE_KEY] = input
}

function getStdinOverride(): Readable | undefined {
  return (globalThis as StdinGlobal)[STDIN_OVERRIDE_KEY]
}
