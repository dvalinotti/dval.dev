export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  telemetry: false,

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    '@nuxtjs/plausible',
    '@vite-pwa/nuxt'
  ],

  app: {
    head: {
      titleTemplate: '%s | Dan Valinotti',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
    }
  },

  css: ['~/assets/css/index.css'],

  site: {
    url: 'https://dval.dev'
  },

  plausible: {
    domain: 'dval.dev',
    ignoredHostnames: ['localhost']
  },

  pwa: {
    devOptions: {
      enabled: false
    },
    registerType: 'autoUpdate',
    manifest: {
      name: 'dval.dev',
      short_name: 'dval.dev',
      description: "Dan Valinotti's personal website",
      theme_color: '#0078c0'
    }
  },

  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/djrhjpihn/image/upload/'
    }
  },

  content: {},

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables" as *;'
        }
      }
    }
  }
})
