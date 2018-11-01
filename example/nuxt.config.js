const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    ['~/../src/index.js', {

      globalScopes: [
        'globals/cart'
      ],

      dynamicScopes: [
        {
          routeName: 'user',
          scopeId: 'users/:user'
        }
      ],



      defaultLocale: 'en-GB',
      
      locales: [
        {
          iso: 'en-gb',
          domain: 'example.co.uk'
        },
        {
          iso: 'nl-nl',
          domain: 'example.nl'
        },
        {
          iso: 'fr-fr',
          domain: 'example.fr'
        },
      ]
    }]
  ],

  watch: [
    '~/../src/*.js'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  }
}
