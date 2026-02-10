import { defineNuxtPlugin, useHead } from '#app'
import { useRuntimeConfig, useRoute, watch } from '#imports'
import type { ModuleOptions } from '../module'
import { useFathom } from './composables/useFathom'

export default defineNuxtPlugin(() => {
  const {
    fathom: { siteId, config },
  } = useRuntimeConfig().public as {
    fathom: ModuleOptions
  }

  if (!siteId) return

  useHead({
    script: [
      {
        'id': 'fathom-script',
        'src': config?.url || 'https://cdn.usefathom.com/script.js',
        'data-site': siteId,
        'defer': config?.defer !== false,
      },
    ],
  })

  if (!config?.manual && import.meta.client) {
    const { trackPageview } = useFathom()
    const route = useRoute()

    watch(
      () => route.path,
      () => {
        trackPageview()
      },
    )
  }
})
