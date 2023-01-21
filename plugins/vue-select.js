import Vue from 'vue';
import "vue-select/dist/vue-select.css";
import Deselect from "../components/vue-select/Deselect";
import OpenIndicator from "../components/vue-select/OpenIndicator";
import vSelect from "vue-select";
vSelect.props.components.default = () => ({ Deselect, OpenIndicator });
Vue.component("v-select", vSelect);