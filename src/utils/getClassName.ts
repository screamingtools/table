interface Options {
  classes?: { [key: string]: string }
  isRankingBy: boolean
  isSortingBy: boolean
}

export function getClassName(
  tag: 'th' | 'td',
  { classes, isRankingBy, isSortingBy }: Options
) {
  const base = classes?.[tag] ?? ''
  const rank = isRankingBy ? classes?.[`${tag}Ranked`] ?? '' : ''
  const sort = isSortingBy ? classes?.[`${tag}Sorted`] ?? '' : ''

  return `${base} ${rank} ${sort}`.trim() || null
}
