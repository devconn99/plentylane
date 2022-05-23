import BootstrapVue from "bootstrap-vue";
import JQuery from "jquery";
import Popper from "popper.js";
import _ from "lodash";
import moment from 'moment';
import Vue from "vue";
import Vuex from "vuex";
import { directive as onClickaway } from "vue-clickaway";
import VueClipboard from "vue-clipboard2";
import VueFormWizard from "vue-form-wizard";
import Loading from "vue-loading-overlay";
import vSelect from "vue-select";

//global registration
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import "vue-loading-overlay/dist/vue-loading.css";
import "vue-select/dist/vue-select.css";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import Deselect from "./components/vue-select/Deselect";
import OpenIndicator from "./components/vue-select/OpenIndicator";

Object.defineProperty(Vue.prototype, "_", { value: _ });

import PreLoader from "./components/PreLoader";

window.$ = JQuery;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueFormWizard);

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

Vue.component("pre-loader", PreLoader);

vSelect.props.components.default = () => ({ Deselect, OpenIndicator });
Vue.component("v-select", vSelect);

Vue.use(
  Loading,
  {
    isFullPage: true,
    opacity: 1,
    zIndex: 999,
  },
  {
    default: new Vue().$createElement("pre-loader"),
  }
);

Vue.filter("kebabToTitleCase", (value) => {
  return value
    ? value
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
    : value;
});

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
});

Vue.directive("onClickaway", onClickaway);

Vue.use(Vuex);

// Required to enable animations on dropdowns/tooltips/popovers
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false;

const _store = new Vuex.Store(store);

Vue.prototype.$eventHub = new Vue(); // Global event bus

new Vue({
  router,
  store: _store,
  render: (h) => h(App),
}).$mount("#app");
