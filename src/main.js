import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import Popper from 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import router from './router'
import store from './store'
import JQuery from 'jquery'
//global registration
import VueFormWizard from 'vue-form-wizard'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

window.$ = JQuery;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueFormWizard);

Vue.use(Vuex);

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;

const _store = new Vuex.Store(store);

new Vue({
  router,
  store: _store,
  render: h => h(App)
}).$mount('#app');
