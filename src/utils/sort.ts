import { Data } from '~/types'
import { partition } from './partition'

interface SortOptions<K> {
  by: K
  backup: [string, boolean]
  ignore: (string | number | boolean)[]
  asc: boolean
}

export function sort(
  data: Data[],
  { by, backup, ignore, asc }: SortOptions<keyof typeof data[0]>
) {
  const [items, ignoredItems] = ignore.length
    ? partition((val) => ignore.includes(val[by]), data)
    : [data, []]

  const sortedItems = _sort(items, by, backup)
  const sortedIgnoredItems = _sort(ignoredItems, by, backup)

  return asc
    ? [...sortedItems, ...sortedIgnoredItems]
    : [...sortedIgnoredItems, ...sortedItems].reverse()
}

function _sort<T>(items: T[], by: keyof T, backup: [keyof T, boolean]): T[] {
  const [backupKey, backupAsc] = backup
  return items.sort((a, b) => {
    if (a[by] === b[by]) {
      if (a[backupKey] < b[backupKey]) {
        return backupAsc ? 1 : -1
      } else if (a[backupKey] > b[backupKey]) {
        return backupAsc ? -1 : 1
      } else {
        return 0
      }
    } else if (a[by] < b[by]) {
      return -1
    } else {
      return 1
    }
  })
}
