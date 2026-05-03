import {MetricsDatasetInterval} from '@imgwire/node'

export function beginningOfUtcDay(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0))
}

export function endOfUtcDay(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999))
}

export function parseDateFlag(value: string | undefined, fallback: Date): Date {
  if (!value) {
    return fallback
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Invalid date: ${value}`)
  }

  return date
}

export function parseMetricsInterval(value: string): MetricsDatasetInterval {
  return MetricsDatasetInterval[value.toUpperCase() as keyof typeof MetricsDatasetInterval]
}
