export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | Dan Valinotti',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/css/index.css'],

  styleResources: {
    scss: ['~/assets/scss/variables.scss']
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/fontawesome',
    '@nuxtjs/imagemin',
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/style-resources',
    'vue-plausible'
  ],

  pwa: {
    meta: {
      name: "dval.dev",
      description: "Dan Valinotti's personal website",
      theme_color: "#0078c0"
    },
    manifest: {
      name: "dval.dev",
      short_name: "dval.dev",
      description: "Dan Valinotti's personal website",
      theme_color: "#0078c0"
    }
  },

  // https://image.nuxtjs.org/
  image: {},

  sitemap: {
    hostname: 'https://dval.dev',
    gzip: true,
    routes: [
      '/blog/hello-world',
      '/blog/node-cli-tutorial',
      '/blog/rebuilding-ecommerce-from-scratch',
      '/blog/lit-web-components-tutorial'
    ]
  },

  // Plausible Analytics module config: https://github.com/moritzsternemann/vue-plausible
  plausible: {
    domain: 'dval.dev',
    trackLocalhost: false
    // trackLocalhost: true
  },

  // TailwindCSS Module config
  tailwindcss: {
    config: {
      darkMode: 'class',
      plugins: [require('@tailwindcss/typography')]
    }
  },

  // Fontawesome module config
  fontawesome: {
    component: 'Fa',
    suffix: false,
    icons: {
      regular: ['faEnvelope'],
      brands: [
        'faAngular',
        'faAws',
        'faBitbucket',
        'faCss3',
        'faGithub',
        'faGoogle',
        'faGrunt',
        'faGulp',
        'faHackerrank',
        'faHtml5',
        'faJava',
        'faJsSquare',
        'faLinkedin',
        'faNode',
        'faPhp',
        'faPython',
        'faReact',
        'faShopify',
        'faTwitter',
        'faVuejs',
        'faWordpressSimple'
      ]
    },
    proIcons: {
      regular: ['faAd', 'faEggFried'],
      light: [
        'faBars',
        'faMoonStars',
        'faRabbitFast',
        'faSun',
        'faTimes',
        'faUniversalAccess',
        'faUserShield'
      ],
      duotone: [
        'faChevronDoubleRight',
        'faSpinnerThird',
        'faDoorOpen',
        'faDoorClosed'
      ]
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-vsc-dark-plus.css'
      }
    }
  },

  // Hooks used for adding reading time to blog posts
  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const readingTime = require('reading-time')(document.text)

        document.readingTime = readingTime
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]]
    }
  }
}
