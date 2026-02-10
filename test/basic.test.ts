import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('ssr', async () => {
  await setup({
    rootDir: new URL('./fixtures/basic', import.meta.url).pathname,
  })

  it('Contains meta charset utf-8', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
    const headContent = head ? head[1] : ''
    expect(headContent).toContain('<meta charset="utf-8">')
  })

  it.skip('Head contains Fathom script tag (SSR)', async () => {
    const html = await $fetch('/')
    // Check for the presence of the script. Nuxt might mangle attributes or order.
    expect(html).toContain('cdn.usefathom.com/script.js')
    expect(html).toContain('123456')
  })

  it('SSR HTML is defined', async () => {
    const html = await $fetch('/')
    // console.log(html)
    expect(html).toBeDefined()
  })
})
