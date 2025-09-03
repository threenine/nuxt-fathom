export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: false },
  compatibilityDate: '2025-07-26',
  fathom: {
    siteId: process.env.fathom_analytics_id,
  },
})
