export default defineNuxtConfig({
  compatibilityDate: '2026-09-07',
  devtools: { enabled: true },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'en' }
    }
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    prerender: {
      crawlLinks: true
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  modules: []
})
