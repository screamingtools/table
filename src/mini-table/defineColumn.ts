import { h as _h, type VNode } from 'vue'
import { MiniColumn } from '~/types'

interface DefineColumnOptions {
  title: string
  width?: number
  sortOrder?: 'asc' | 'desc'
  permanent?: true
  sortable?: boolean
  rankable?: boolean
  format?: (value: any, h?: typeof _h) => VNode | string
}

export function defineColumn(key: string, options: DefineColumnOptions): MiniColumn {
  const isSortable = options.sortable ?? true

  return {
    key,
    title: options.title,
    format: options.format || ((v) => v),
    width: options.width ?? 1,
    sortOrder: options.sortOrder || 'desc',
    permanent: options.permanent ?? false,
    sortable: isSortable,
    rankable: isSortable ? options.rankable ?? true : false
  }
}
