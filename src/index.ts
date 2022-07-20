import { defineComponent, h, onMounted, PropType, ref } from 'vue'
import { Metadata, Platform } from '~/types'
import { getPlatformHref, renderPlatformIcon } from '~/utils'

const LINK_STUBS: Record<Platform, string> = {
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
  twitter: 'https://twitter.com/intent/tweet?url=',
  linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url='
}

// ensure duplicate platforms have unique ids
const UNIQUE_IDS: Record<Platform, number> = {
  facebook: 0,
  twitter: 0,
  linkedin: 0
}

export const ShareButton = defineComponent({
  props: {
    platform: { type: String as PropType<Platform>, required: true },
    linkClass: { type: String, required: false, default: '' },
    svgClass: { type: String, required: false, default: '' }
  },

  setup(props) {
    const aRef = ref<HTMLAnchorElement | null>(null)

    onMounted(() => {
      const ELS = {
        url: document.querySelector('[property="og:url"]'),
        desc: document.querySelector('[property="og:description"]'),
        handle: document.querySelector('[name="twitter:site"]')
      }

      const metadata = Object.entries(ELS).reduce((metadata, [key, el]) => {
        const content = el?.getAttribute('content')

        if (content) {
          const uriComponent = content.startsWith('@') ? content.slice(1) : content
          return { ...metadata, [key]: encodeURIComponent(uriComponent) }
        }

        return metadata
      }, {} as Metadata)

      const baseUrl = `${LINK_STUBS[props.platform]}${metadata.url || ''}`
      const href = getPlatformHref(props.platform, baseUrl, metadata)

      aRef.value?.setAttribute('href', href)
    })

    // ---

    return () =>
      h(
        'a',
        {
          ref: aRef,
          class: props?.linkClass || null,
          rel: 'nofollow noopener noreferrer',
          target: '_blank'
        },
        renderPlatformIcon(props.platform, props.svgClass, UNIQUE_IDS[props.platform]++)
      )
  }
})
