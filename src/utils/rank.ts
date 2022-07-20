import { Data } from '~/types'

export function rank(data: Data[], tieKey = '') {
  if (!tieKey) {
    return data.map((item, idx) => ({ ...item, rank: idx + 1 }))
  }

  let currentRank = 1
  let ranksToSkip = 1

  return data.map((item, idx, arr) => {
    if (idx === 0) {
      const isTied = item[tieKey] === arr[1][tieKey]
      return { ...item, rank: isTied ? `=${currentRank}` : currentRank }
    }

    if (idx === arr.length - 1) {
      const isTied = item[tieKey] === arr[idx - 1][tieKey]
      return {
        ...item,
        rank: isTied ? `=${currentRank}` : currentRank + ranksToSkip
      }
    }

    const isTiedBehind = item[tieKey] === arr[idx - 1][tieKey]
    const isTiedAhead = item[tieKey] === arr[idx + 1][tieKey]

    if (isTiedBehind) {
      ranksToSkip++
      return { ...item, rank: `=${currentRank}` }
    } else if (isTiedAhead) {
      currentRank = currentRank + ranksToSkip
      ranksToSkip = 1
      return { ...item, rank: `=${currentRank}` }
    } else {
      currentRank = currentRank + ranksToSkip
      ranksToSkip = 1
      return { ...item, rank: currentRank }
    }
  })
}
