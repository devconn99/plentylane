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
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { directive as onClickaway } from 'vue-clickaway';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import _ from 'lodash';
import Deselect from './components/vue-select/Deselect';
import OpenIndicator from './components/vue-select/OpenIndicator';
import VueClipboard from 'vue-clipboard2';

Object.defineProperty(Vue.prototype, '_', { value: _ });

import PreLoader from './components/PreLoader';

window.$ = JQuery;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueFormWizard);

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

Vue.component('pre-loader', PreLoader);

vSelect.props.components.default = () => ({ Deselect, OpenIndicator });
Vue.component('v-select', vSelect);

Vue.use(Loading, {
    isFullPage: true,
    opacity: 1,
    zIndex: 999
}, {
    default: (new Vue()).$createElement('pre-loader')
});

Vue.directive('onClickaway', onClickaway);

Vue.use(Vuex);

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;

const _store = new Vuex.Store(store);

Vue.prototype.$eventHub = new Vue(); // Global event bus

new Vue({
  router,
  store: _store,
  render: h => h(App)
}).$mount('#app');
