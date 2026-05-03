import {Command, Flags} from '@oclif/core'

import {runSdkCommand, writeJson} from '../../lib/command.js'
import {beginningOfUtcDay, endOfUtcDay, parseDateFlag, parseMetricsInterval} from '../../lib/dates.js'

export default class MetricsGetStats extends Command {
  static override description = 'Retrieve metrics stats'
  static override examples = [
    `<%= config.bin %> <%= command.id %> --interval hourly --tz UTC
`,
  ]
  static override flags = {
    'date-end': Flags.string({
      description: 'End date/time. Defaults to the end of the current UTC day.',
    }),
    'date-start': Flags.string({
      description: 'Start date/time. Defaults to the beginning of the current UTC day.',
    }),
    interval: Flags.string({
      default: 'hourly',
      description: 'Stats interval',
      options: ['hourly', 'daily', 'weekly', 'monthly'],
    }),
    tz: Flags.string({
      default: 'UTC',
      description: 'IANA timezone',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(MetricsGetStats)
    const result = await runSdkCommand(this, (client) =>
      client.metrics.getStats({
        dateEnd: parseDateFlag(flags['date-end'], endOfUtcDay()),
        dateStart: parseDateFlag(flags['date-start'], beginningOfUtcDay()),
        interval: parseMetricsInterval(flags.interval),
        tz: flags.tz,
      }),
    )

    writeJson(this, result)
  }
}
