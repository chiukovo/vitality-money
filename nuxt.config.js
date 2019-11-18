require('dotenv').config()
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  mode: 'universal',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' }
    ],
    link: [
    ],
    script: [
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
    {src: '~plugins/highcharts.js', ssr: false},
    {src: '~plugins/element-ui', ssr: true },
    '@/static/js/el-dialogdrag'
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
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',
    'cookie-universal-nuxt',
    ['vue-currency-filter/nuxt', {
      thousandsSeparator: ',',
      symbolPosition: 'front',
      symbolSpacing: true
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
    transpile: [/^vuetify/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.plugins.push(
        new VuetifyLoaderPlugin()
      )
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
    '/api': {
      target: process.env.NUXT_ENV_API_URL,
      changeOrigin: true,
      pathRewrite: {
        '^/api' : ''
        }
      }
  },
  router: {
    middleware: ["device"],
  },
  chainWebpack: config => {
    //close eslint
    config.module.rules.delete("eslint");
  },
  build: {
    transpile: [/^element-ui/],
  }
}
