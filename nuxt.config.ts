/* eslint-disable object-curly-newline */
import { Configuration as NuxtConfiguration } from '@nuxt/types';
import { ProcessEnv } from './types/modules';
import ValidateEnv from './validateEnv';

ValidateEnv();

const nuxtConfig: NuxtConfiguration = {
  mode: 'universal',
  /*
  ** Hosts at 0.0.0.0 to be accessible by other devices in the same network
  */
  server: {
    host: (process.env as ProcessEnv).HOST,
    port: (process.env as ProcessEnv).PORT,
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Luftcare',
    titleTemplate: (base) => `${base} - Painel de gestão`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      {
        rel: 'stylesheet',
        href: 'https://rsms.me/inter/inter.css',
      },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    './assets/css/element-overrides.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: './plugins/element-ui/index', mode: 'all' },
    { src: './plugins/velocity/velocity', mode: 'client' },
    { src: './errorHandling/apollo/clientErrorHandler', mode: 'client' },
    { src: './plugins/vuex-persist/vuexLocalStorage', mode: 'client' },
    { src: './plugins/vuex-persist/vuexSecureLocalStorage', mode: 'client' },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    'nuxt-typed-vuex',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/apollo',
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
  ],
  /*
  ** Apollo configuration
  */
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: (process.env as ProcessEnv).APOLLO_ENDPOINT,
      },
    },
  },
  /*
  ** Proxy configuration
  */
  proxy: {
    '/api': {
      target: (process.env as ProcessEnv).API_URL,
      pathRewrite: { '^/api': '/' },
    },
  },
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      plugins: {
        'postcss-import': {},
        'postcss-simple-vars': {},
        'postcss-nested': {},
      },
    },
    transpile: [/^element-ui/, /typed-vuex/],
  },
};

export default nuxtConfig;
