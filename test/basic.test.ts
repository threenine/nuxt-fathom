import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('Contains meta charset utf-8', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
    const headContent = head ? head[1] : null
    expect(headContent).toContain('<meta charset="utf-8">')
  })

  it('Contains fathom script', async () => {

    const html = await $fetch('/')
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    const bodyContent = body ? body[1] : null
    expect(bodyContent).toContain('<script>window.__NUXT__={};window.__NUXT__.config={public:{fathom:{siteId:"123456",config:{manual:false}}},app:{baseURL:"/",buildId:"test",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script>')
  })
})
