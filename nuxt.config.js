require('dotenv').config()

module.exports = {
  mode: 'universal',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
    ],
    script: [
      {src: '/assets/js/jquery.min.js'},
      {src: '/assets/js/bootstrap-table.min.js'},
      {src: '/assets/js/bootstrap.js'},
      {src: '/assets/js/jquery.slimscroll.js'},
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
    '@/static/dist/css/style.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/global',
    {src: '~plugins/websocket.js', ssr: false},
    {src: '~plugins/trading.js', ssr: false},
    {src: '~plugins/auth.js', ssr: false},
    {src: '~plugins/vueSlimScroll.js'},
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
    ['vue-currency-filter/nuxt', {
      thousandsSeparator: ',',
      symbolPosition: 'front',
      symbolSpacing: true
    }],
    ['nuxt-vuex-localstorage', {
      sessionStorage: ['sessionStorage']
    }]
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
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
  },
  chainWebpack: config => {
    //close eslint
    config.module.rules.delete("eslint");
  }
}
