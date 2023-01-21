import Vue from 'vue';
import { StripeCheckout, StripeElementCard } from "@vue-stripe/vue-stripe";
Vue.component('stripe-checkout', StripeCheckout)
Vue.component('stripe-checkout', StripeElementCard)