import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Popper from 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
Vue.use(BootstrapVue)

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
