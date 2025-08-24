import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch, createPage } from '@nuxt/test-utils'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    browser: true,
  })

  it('Contains meta charset utf-8', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
    const headContent = head ? head[1] : null
    expect(headContent).toContain('<meta charset="utf-8">')
  })

  it('Head contains Fathom script tag with expected attributes (client runtime)', async () => {
    const page = await createPage('/')

    // Wait for script tag to be attached to head (id is deterministic)
    await page.waitForSelector('head script#fathom-script', { timeout: 10000, state: 'attached' })

    const attrs = await page.evaluate(() => {
      const el = document.head.querySelector('script#fathom-script') as HTMLScriptElement | null
      if (!el) return null
      return {
        id: el.id,
        src: el.getAttribute('src'),
        site: el.getAttribute('data-site'),
        defer: el.defer,
      }
    })

    expect(attrs).not.toBeNull()
    expect(attrs?.id).toBe('fathom-script')
    expect(attrs?.src).toBe('https://cdn.usefathom.com/script.js')
    expect(attrs?.site).toBe('123456')
    expect(attrs?.defer).toBe(true)

    await page.close()
  }, 15000)

  it('Body contains Nuxt fathom script reference', async () => {
    const html = await $fetch('/')
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    const bodyContent = body ? body[1] : null
    expect(bodyContent).toContain('<script>window.__NUXT__={};window.__NUXT__.config={public:{fathom:{siteId:"123456",config:{manual:false}}},app:{baseURL:"/",buildId:"test",buildAssetsDir:"/_nuxt/",cdnURL:""}}</script>')
  })
})
