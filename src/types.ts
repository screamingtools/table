import { h as _h, type VNode } from 'vue'

export interface Backups {
  DEFAULT: string
  [key: string]: string
}

export interface Classes {
  table?: string
  head?: {
    thead?: string
    tr?: string
    th?: string
    thSorted?: string
    thRanked?: string
  }
  body?: {
    tbody?: string
    tr?: string
    td?: string
    tdSorted?: string
    tdRanked?: string
  }
  indicator?: string
}

export interface Data {
  [k: string]: string | number | boolean
}

// ---

export interface Column {
  key: string
  title: string
  width: number
  sortOrder: 'asc' | 'desc'
  sortable: boolean
  rankable: boolean
  format: (value: any, h: typeof _h) => VNode | string
}

export interface MiniColumn extends Column {
  permanent: boolean
}

// ---

export interface Config {
  backups: Backups
  initKey: string
  tieRanks: boolean
  ignore: (string | number | boolean)[]
}

export interface MiniConfig {
  backups: Backups
  tieRanks: boolean
  ignore: (string | number | boolean)[]
}
