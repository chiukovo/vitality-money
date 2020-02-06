require('dotenv').config()
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

module.exports = {
  mode: 'spa',
  head: {
    title: process.env.NUXT_ENV_WEB_TITLE || '',
    meta: [
      { charset: 'utf-8' }
    ],
    link: [
    ],
    script: [
      { src: '/js/charting_library/charting_library.min.js', type: 'text/javascript' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: false,
  /*
  ** Global CSS
  */
  css: [
    '@/assets/sass/default.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/global',
    {src: '~plugins/websocket.js', ssr: false},
    {src: '~plugins/auth.js', ssr: false},
    {src: '~plugins/element-ui', ssr: true},
    {src: '~plugins/vue-table', ssr: false},
    {src: '~plugins/version', ssr: false},
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/device',
    '@nuxtjs/axios',
    '@nuxtjs/component-cache',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
    ['vue-currency-filter/nuxt', {
      thousandsSeparator: ',',
      symbolSpacing: false
    }],
    ['nuxt-vuex-localstorage', {
      sessionStorage: ['sessionStorage'],
      localStorage: ['localStorage'],
    }]
  ],
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    transpile: [/^element-ui/],
    extend(config, ctx) {
      config.plugins.unshift(new LodashModuleReplacementPlugin)
      config.module.rules[2].use[0].options.plugins = ['lodash']
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  },
  proxy: {
  },
  router: {
  },
  chainWebpack: config => {
    //close eslint
    config.module.rules.delete("eslint");
  }
}
