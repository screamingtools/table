import { Backups, Config } from '~/types'

interface DefineConfigOptions {
  backups: Backups
  initKey: string
  tieRanks?: boolean
  ignore?: (string | number | boolean)[]
}

export function defineConfig(options: DefineConfigOptions): Config {
  return {
    backups: options.backups,
    initKey: options.initKey,
    tieRanks: options.tieRanks || false,
    ignore: options.ignore || []
  }
}
