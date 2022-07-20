import { computed, defineComponent, h, PropType, ref, watch } from 'vue'
import { Classes, Data, MiniColumn, MiniConfig } from '~/types'
import { getClassName, rank, sort } from '~/utils'

export const MiniTable = defineComponent({
  props: {
    /* required */
    data: { type: Array as PropType<Data[]>, required: true },
    columns: { type: Array as PropType<MiniColumn[]>, required: true },
    config: { type: Object as PropType<MiniConfig>, required: true },
    visibleKey: { type: String, required: true },

    /* optional */
    classes: { type: Object as PropType<Classes>, required: false, default: () => ({}) },
    headless: { type: Boolean, required: false, default: false },
    length: { type: Number, required: false, default: 0 },
    filter: {
      type: Object as PropType<[string, string]>,
      required: false,
      default: () => []
    }
  },

  emits: ['row-click'],

  setup(props, { emit }) {
    const { columns, config, headless, classes } = props
    const headClasses = classes.head
    const bodyClasses = classes.body

    const permCols = columns.filter(({ permanent }) => permanent)
    const tempCols = columns.filter(({ permanent }) => !permanent)
    const visibleCols = computed(() => {
      const currentCol = tempCols.find(({ key }) => key === props.visibleKey)!
      return [...permCols, currentCol]
    })
    const nCols = computed(() => visibleCols.value.reduce((a, col) => a + col.width, 0))

    const data = ref(props.data)
    const sortKey = ref(props.visibleKey)
    const rankKey = ref(props.visibleKey)

    const column = computed(() => columns.find((c) => c.key === sortKey.value)!)
    const shouldRank = computed(() => column.value.rankable)
    const shouldSortAsc = computed(() => column.value.sortOrder === 'asc')
    const isSortingAsc = ref(shouldSortAsc.value)

    const backup = computed(() => {
      const backupKey = Object.keys(config.backups).includes(sortKey.value)
        ? config.backups[sortKey.value]
        : config.backups['DEFAULT']

      const backupColumn = columns.find(({ key }) => key === backupKey)!

      return [backupKey, backupColumn.sortOrder === 'asc'] as [string, boolean]
    })

    const filteredData = computed(() => {
      const [key, value] = props.filter

      if (!key || !value) {
        return data.value
      }

      return data.value.filter((item) =>
        String(item[key] ?? '')
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    })

    function onHeaderClick(key: string) {
      if (key === sortKey.value) {
        data.value = data.value.reverse()
        isSortingAsc.value = !isSortingAsc.value
      } else {
        sortKey.value = key
        isSortingAsc.value = shouldSortAsc.value
      }
    }

    function onRowClick(row: Data) {
      emit('row-click', row)
    }

    // ---

    watch(
      () => props.visibleKey,
      (key) => (sortKey.value = key)
    )

    watch(
      sortKey,
      (newKey) => {
        let newData = sort(data.value, {
          by: newKey,
          backup: backup.value,
          ignore: props.config.ignore,
          asc: isSortingAsc.value
        })

        if (shouldRank.value) {
          rankKey.value = newKey

          if (props.config.tieRanks) {
            newData = rank(newData, newKey)
          } else {
            newData = rank(newData)
          }
        }

        data.value = newData
        isSortingAsc.value = shouldSortAsc.value
      },
      { immediate: true }
    )

    // ---

    return () => {
      const thead = headless
        ? null
        : h(
            'thead',
            { class: headClasses?.thead },
            h(
              'tr',
              {
                style: `display: grid; grid-template-columns: repeat(${nCols}, minmax(0, ${nCols}fr));`,
                class: headClasses?.tr
              },
              visibleCols.value.map((col) => {
                const isRankingBy = col.key === rankKey.value
                const isSortingBy = col.key === sortKey.value

                const className = getClassName('th', {
                  classes: headClasses,
                  isRankingBy,
                  isSortingBy
                })

                return h(
                  'th',
                  {
                    style: `grid-column: span ${col.width} / span ${col.width};`,
                    class: className,
                    onClick: col?.sortable ? () => onHeaderClick(col.key) : null,
                    'sort-asc': isSortingBy ? isSortingAsc.value : null
                  },
                  [col.title, h('span', { class: classes.indicator })]
                )
              })
            )
          )

      const tbody = h(
        'tbody',
        { class: bodyClasses?.tbody },
        filteredData.value.map((row, idx) => {
          return h(
            'tr',
            {
              class: bodyClasses?.tr,
              style: [
                props.length && idx >= props.length ? 'display:none' : null,
                `display: grid; grid-template-columns: repeat(${nCols}, minmax(0, ${nCols}fr));`
              ],
              onClick: () => onRowClick(row)
            },
            visibleCols.value.map((col) => {
              const value = row[col.key] ?? '-'

              const isRankingBy = col.key === rankKey.value
              const isSortingBy = col.key === sortKey.value

              const className = getClassName('td', {
                classes: bodyClasses,
                isRankingBy,
                isSortingBy
              })

              return h(
                'td',
                {
                  style: `grid-column: span ${col.width} / span ${col.width};`,
                  class: className
                },
                col.format(value, h)
              )
            })
          )
        })
      )
      return h('table', { class: classes.table }, [thead, tbody])
    }
  }
})
