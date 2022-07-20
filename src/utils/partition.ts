export function partition<T>(
  filter: (x: T, idx: number, a: readonly T[]) => boolean,
  array: readonly T[]
): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    ([passed, failed], item, idx, arr) => {
      if (filter(item, idx, arr)) {
        return [[...passed, item], failed]
      }

      return [passed, [...failed, item]]
    },
    [[], []]
  )
}
