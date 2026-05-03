import {Flags} from '@oclif/core'

export const paginationFlags = {
  limit: Flags.integer({
    default: 25,
    description: 'Number of records to return',
    min: 1,
  }),
  page: Flags.integer({
    default: 1,
    description: 'Page number to return',
    min: 1,
  }),
}

export function parseCommaSeparatedList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}
