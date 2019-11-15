require('dotenv').config()

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
    '~/plugins/global',
    {src: '~plugins/websocket.js', ssr: false},
    {src: '~plugins/auth.js', ssr: false},
    {src: '~plugins/highcharts.js', ssr: true},
    {src: '~plugins/element-ui', ssr: true },
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

  },
  vender: [
    'element-ui'
  ],
  babel: {
    "plugins": [["component", [
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-default"
      },
      'transform-async-to-generator',
      'transform-runtime'
    ]]],
    comments: true
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
