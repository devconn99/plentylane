export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Plentylane',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAP_KEY}&libraries=places,geometry&callback=Function.prototype`,
      },
      {
        src: "https://cdn.sobekrepository.org/includes/gmaps-markerwithlabel/1.9.1/gmaps-markerwithlabel-1.9.1.min.js",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/scss/style.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/jquery.js', ssr: false, mode: 'client' },
    { src: '~/plugins/popper.js', ssr: false, mode: 'client' },
    { src: '~/plugins/lodash.js', ssr: false, mode: 'client' },
    { src: '~/plugins/moment.js', ssr: false, mode: 'client' },
    { src: '~/plugins/vue-click-away.js', ssr: false, mode: 'client' },
    { src: '~/plugins/vue-clipboard2.js', ssr: false, mode: 'client' },
    { src: '~/plugins/vue-form-wizard.js', ssr: false, mode: 'client' },
    { src: '~/plugins/vue-loading-overlay.js', ssr: false, mode: 'client' },
    { src: '~/plugins/vue-select.js', ssr: false, mode: 'client' },
    { src: '~/plugins/filters.js', ssr: false, mode: 'client' },
    { src: '~/plugins/vue-owl-carousel.js', ssr: false, mode: 'client' },
    { src: '~/plugins/pre-loader.js', ssr: false, mode: 'client' },
    { src: '~/plugins/bootstrap-vue.js', ssr: false, mode: 'client' },
    { src: '~/plugins/event-bus.js', ssr: false, mode: 'client' },
    { src: '~/plugins/vue-stripe.js', ssr: false, mode: 'client' },
    { src: '~/plugins/chip-input.js', ssr: false, mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/style-resources',
  ],

  styleResources: {
    scss: [
      '~/scss/style.scss',
    ],
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  router: {
    middleware: 'stats'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: ['jquery'],
    publicPath: '/dist/',
  },

  // Environment variables
  env: {
    API_ORIGIN: process.env.API_ORIGIN,
    PWD_MIN_LENGTH: 8,
    PWD_MAX_LENGTH: 20,
    USER_NAME_MIN_LENGTH: 6,
    USER_NAME_MAX_LENGTH: 15,
    MEAL_INFO: {
      DESCRIPTION_MAX_LENGTH: 4000,
      QUANTITY_MIN: 1,
      QUANTITY_MAX: 1000,
    },
    DINE_NOTES_MAX_LENGTH: 4000,
    TEXT_AREA_MAX_LENGTH: 4000,
    SEARCH: {
      AVAILABLE_SERVINGS_MIN: 1,
      AVAILABLE_SERVINGS_MAX: 1000,
    },
    LOADER_OPTIONS: {
      COLOR: "#009C90",
      BACKGROUND_COLOR: "#FEF8E6",
      IS_FULL_PAGE: false,
    },
    DIETARY_NOTES: {
      DAIRY: "Contains dairy",
      EGGS: "Contains eggs",
      PEANUTS: "Contains peanuts",
      TREE_NUTS: "Contains tree nuts",
      FISH: "Contains fish",
      SHELLFISH: "Contains shellfish",
      SOY: "Contains soy",
      VEGETARIAN: "Vegetarian",
      VEGAN: "Vegan",
      GLUTEN_FREE: "Gluten free",
      GLUTEN_FREE_KITCHEN: "Gluten free kitchen",
    },
    STRIPE_INFO: {
      SUCCESS_URL:"https://www.plentylane.com/plan-success",
      CANCEL_URL:"https://www.plentylane.com/choose-plan",
      SHOP_SUCCESS_URL:"https://www.plentylane.com/dashboard/shop/success",
      SHOP_CANCEL_URL:"https://www.plentylane.com/dashboard/shop",
      PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY,
      PRICE: {
        'starter-monthly': { price: 0, id: process.env.STARTER_MONTHLY_ID },
        'starter-annual': { price: 0, id: process.env.STARTER_ANNUAL_ID },
        'casual-monthly': { price: 4.95, id: process.env.CASUAL_MONTHLY_ID },
        'casual-annual': { price: 49.5, id: process.env.CASUAL_ANNUAL_ID },
        'unlimited-monthly': { price: 8.95, id: process.env.UNLIMITED_MONTHLY_ID },
        'unlimited-annual': { price: 89.5, id: process.env.UNLIMITED_ANNUAL_ID },
        'initial-fee': { price: 29.5, id: process.env.INITIAL_FEE },
        'container-fee':{ price:35, id: process.env.CONTAINER_FEE },
      },
      TAX: {
        'container-tax': { rate: 11.49, id: process.env.CONTAINER_TAX }
      }
    },
    RATINGS: {
      TAGS: [ "tastes great", "ready on time", "plenty to eat" ]
    }
  }
}
