import { h as _h, type VNode } from 'vue'
import { Column } from '~/types'

interface DefineColumnOptions {
  title: string
  width?: number
  sortOrder?: 'asc' | 'desc'
  sortable?: boolean
  rankable?: boolean
  format?: (value: any, h?: typeof _h) => VNode | string
}

export function defineColumn(key: string, options: DefineColumnOptions): Column {
  const isSortable = options.sortable ?? true

  return {
    key,
    title: options.title,
    format: options.format || ((v) => v),
    width: options.width ?? 1,
    sortOrder: options.sortOrder || 'desc',
    sortable: isSortable,
    rankable: isSortable ? options.rankable ?? true : false
  }
}
