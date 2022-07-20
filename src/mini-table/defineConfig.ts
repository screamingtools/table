import { Backups, MiniConfig } from '~/types'

interface DefineConfigOptions {
  backups: Backups
  tieRanks?: boolean
  ignore?: (string | number | boolean)[]
}

export function defineConfig(options: DefineConfigOptions): MiniConfig {
  return {
    backups: options.backups,
    tieRanks: options.tieRanks || false,
    ignore: options.ignore || []
  }
}
