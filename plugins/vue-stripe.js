import Vue from 'vue';
import {
  StripeCheckout,
  StripeElementCard,
  StripeElementPayment,
} from '@vue-stripe/vue-stripe';

Vue.component('StripeCheckout', StripeCheckout);
Vue.component('StripeElementCard', StripeElementCard);
Vue.component('StripeElementPayment', StripeElementPayment);
