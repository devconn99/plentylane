<template>
  <div class="row">
    <!-- TODO: temp message -->
    <div class="col-12 mx-auto">
      <p class="mb-4">
        Please email us at
        <a class="href-mailto" href="mailto:info@plentylane.com">info@plentylane.com</a>
        if you need to purchase additional containers.
      </p>
    </div>

    <div class="col-12 col-lg-10 mx-auto position-relative" v-if="!isBasketEmpty">
      <loading
        :active.sync="isLoading"
        :is-full-page="loaderOptions.IS_FULL_PAGE"
        :color="loaderOptions.COLOR"
        :background-color="loaderOptions.BACKGROUND_COLOR"
      />
      <router-link :to="{ path: '/dashboard/shop/basket' }" class="shop-back d-inline-flex align-items-center">
        <SvgIcon icon="arrowLeft"></SvgIcon>
        <span class="ml-2">Basket</span>
      </router-link>
      <div class="row mt-5">
        <div class="col-12 col-sm-12 col-xl-8 pr-xl-5" v-if="isShippingLoaded">
          <div class="
            checkout-shipping
            d-flex
            justify-content-between
            align-items-center
            mb-3
          ">
            <div class="title-size3 titleGreenNavyColor">Shipping Info</div>
            <EditBtn @on-clicked="editShippingInfo"></EditBtn>
          </div>
          <div class="checkout-shipping-box">
            <div class="checkout-shipping-box-field">
              <div class="checkout-shipping-box-field-icon">
                <SvgIcon icon="user"></SvgIcon>
              </div>
              <div class="checkout-shipping-box-field-text">
                {{ shippingInfo.fullName }}
              </div>
            </div>
            <div class="checkout-shipping-box-field">
              <div class="checkout-shipping-box-field-icon">
                <SvgIcon icon="location2"></SvgIcon>
              </div>
              <!-- TODO: use correct data to display -->
              <div class="checkout-shipping-box-field-text">
                {{ completeAddress || "-" }}
              </div>
            </div>
            <div class="checkout-shipping-box-field">
              <div class="checkout-shipping-box-field-icon">
                <SvgIcon icon="phone"></SvgIcon>
              </div>
              <div class="checkout-shipping-box-field-text">
                {{ shippingInfo.phoneNumber || "-" }}
              </div>
            </div>
          </div>

          <div class="
            checkout-payment
            d-flex
            justify-content-between
            align-items-center
            mt-5
            mb-3
          ">
            <div class="title-size3 titleGreenNavyColor">Payment Method</div>
            <EditBtn @on-clicked="editPaymentMethod"></EditBtn>
          </div>
          <div class="checkout-payment-box">
            <div class="checkout-payment-box-field">
              <div class="checkout-payment-box-field-icon">
                <SvgIcon icon="creditCard"></SvgIcon>
              </div>
              <div class="checkout-payment-box-field-text">
                {{ getCurrentUsedCardPlaceHolder }}
              </div>
            </div>
            <div class="checkout-payment-box-field">
              <div class="checkout-payment-box-field-icon">
                <b-form-checkbox class="checkbox-icon-size-24 cursor-pointer" v-model="paymentMethod.useShippingAddress"
                  name="check"></b-form-checkbox>
              </div>
              <div
                class="checkout-payment-box-field-text cursor-pointer user-select-none"
                @click="paymentMethod.useShippingAddress = !paymentMethod.useShippingAddress"
              >
                Use Shipping Address
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-12 col-xl-4 mt-5 mt-xl-0 checkout-price-wrapper" v-if="isPriceLoaded">
          <div class="shop-price-box">
            <div class="shop-price-subtotal mb-3">
              <div class="shop-price-subtotal-title">Subtotal</div>
              <div class="shop-price-subtotal-price">
                {{ priceInfo.subTotal.text }}
              </div>
            </div>
            <div class="shop-price-tax mb-3">
              <div class="shop-price-tax-title">Tax</div>
              <div class="shop-price-tax-price">{{ priceInfo.tax.text }}</div>
            </div>
            <div class="shop-price-subtotal mb-3">
              <div class="shop-price-subtotal-title">Shipping</div>
              <div class="shop-price-subtotal-price">
                {{ priceInfo.shipping.text }}
              </div>
            </div>
            <div class="shop-price-total mb-3">
              <div class="shop-price-total-title">Total</div>
              <div class="shop-price-total-price">
                {{ priceInfo.total.text }}
              </div>
            </div>
          </div>

          <div class="clear-line"></div>

          <div class="box-btn">
            <b-btn
              class="btnGreen btnNormalSize btnUpper btn100 hover-slide-left"
              :disabled="isSubmitting"
              @click.stop.prevent="postOrder()"
            >
              <span>Place order</span>
            </b-btn>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 col-sm-8 col-md-10 col-lg-9 col-xl-8 mx-auto text-center" v-else>
      <div class="dashboard-title-box mb-3">
        <div class="title-size3 titleGreenNavyColor">Your basket is empty.</div>
      </div>

      <div class="box-btn mt-5">
        <router-link :to="{ path: '/dashboard/shop' }" class="btnGreenTransparent btnHugeSize btn100 hover-slide-left">
          <span>Go to Shop</span>
        </router-link>
      </div>
    </div>
    <stripe-checkout
      ref="checkoutRef"
      :pk="publishableKey"
      :session-id="sessionId"
      @loading="v => loading = v"
    />

    <!-- Modals -->
    <ShippingInfoModal
      :prev-values="modalShippingInfo"
      @shipping-info-saved="onShippingInfoSaved"
    />
    <PaymentMethodModal @onSavePaymentMethod="savePaymentMethod" />
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon';
import ShippingInfoModal from '../../components/modals/ShippingInfoModal';
import PaymentMethodModal from '../../components/modals/PaymentMethodModal.vue';
import helpers from '../../helpers';
import Loading from 'vue-loading-overlay';
import config from '../../config';
import api from '../../api';
import EditBtn from '../../components/EditBtn';
import { mapGetters } from 'vuex';
import { StripeCheckout } from "@vue-stripe/vue-stripe";

export default {
  name: "Checkout",
  components: { SvgIcon,Loading,ShippingInfoModal,EditBtn,PaymentMethodModal, StripeCheckout},
  data: () => ({
    publishableKey: config.STRIPE_INFO.PUBLISHABLE_KEY,
    loaderOptions: { ...config.LOADER_OPTIONS },
    isLoading: false,
    stripeLoading: false,
    userIdToUpdate: 0,
    shippingInfo: {
      fullName: '',
      address: {
        id: 0,
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "USA"
      },
      phoneNumber: "",
    },
    paymentMethod: {
      cardToken: {
        placeholder: '**** **** **** 5555',
        data: null
      },
      useShippingAddress: true
    },
    priceInfo: {
      subTotal: { value: 0,text: '$0' },
      tax: { value: 0,text: '$0' },
      shipping: { value: 0,text: '$0' },
      total: { value: 0,text: '$0' }
    },
    sessionId:"",
    isBasketEmpty: false,
    basketItems: [],
    shippingPrice: 5,
    isPriceLoaded: false,
    isSubmitting: false,
    isShippingLoaded: false,
    modalShippingInfo: {
      fullName: "",
      address: {
        id: 0,
        line1: "",
        line2: "",
        city: "",
        postalCode: "",
        state: "",
        country: "USA"
      },
      phone: "",
    }
  }),
  created() {
    this.prepareData();
  },
  computed: {
    ...mapGetters({
      currentPaymentMethod: 'getPaymentMethod'
    }),
    getCurrentUsedCardPlaceHolder() {
      let currentCard = this.currentPaymentMethod
      if (currentCard) {
        return `**** **** **** ${currentCard.last4}`
      } else {
        return '**** **** **** ****'
      }
    },
    completeAddress() {
      const address = this.shippingInfo.address
      if (address) {
        const { line1, line2, city, state, postalCode, country } = address;
        return `${line1}, ${line2}, ${city} ${state} ${postalCode} ${country}`;
      } else {
        return ""
      }
    },
     successURL(){
      return config.STRIPE_INFO.SHOP_SUCCESS_URL
    },
     cancelURL(){
      return config.STRIPE_INFO.SHOP_CANCEL_URL
    },
  },
  methods: {
    async prepareData() {
      this.isLoading = true;
      const _basket = this.$store.getters.basket;
      if (!_basket || !_basket.length) {
        this.isBasketEmpty = true;
        this.isLoading = false;
        return;
      }
      this.basketItems = _basket.map(item => item);
      this.calculatePrice();
      const _shippingInfo = this.$store.getters.shippingInfo;
      if (_shippingInfo && _shippingInfo.fullName && Object.keys(_shippingInfo).length) {
        this.shippingInfo.fullName = _shippingInfo.fullName;
        this.shippingInfo.address = _shippingInfo.address;
        this.shippingInfo.phoneNumber = _shippingInfo.phoneNumber;
        this.isLoading = false;
        this.isShippingLoaded = true;
        // return;
      }
      const _user = { ...this.$store.getters.userInfo };
      this.userIdToUpdate = _user.id;
      if (!_user || !_user.fullName) {
        api.dashboard.profile.userInfo()
          .then(async (data) => {
            this.$store.commit('userInfo',{ ...data });
            this.shippingInfo.fullName = data.fullName;
            this.shippingInfo.phoneNumber = data.phone || '';
            this.shippingInfo.address = data.shippingAddress
            this.userIdToUpdate = data.id;
            this.$store.commit('shippingInfo',{ ...this.shippingInfo });
            await this.getPaymentMethod(data)
            this.isLoading = false;
            this.isShippingLoaded = true;
          })
          .catch((err) => {
            this.isLoading = false;
            this.isShippingLoaded = true;
          });
      } else {
        this.shippingInfo.fullName = _user.fullName;
        this.shippingInfo.phoneNumber = _user.phone || '';
        this.shippingInfo.address = _user.shippingAddress
        this.$store.commit('shippingInfo',{ ...this.shippingInfo });
        await this.getPaymentMethod(_user)
        this.isLoading = false;
        this.isShippingLoaded = true;
      }
    },
    calculatePrice() {
      if (!this.basketItems || !this.basketItems.length) return;
      const koeff = 11.49;
      let _price = 0;
      let _tax = 0;
      let _total = 0;
      this.basketItems.forEach(item => {
        _price += Number(item.count) * Number(item.price);
      });
      _tax = _price / koeff;
      _total = _price + _tax + this.shippingPrice;

      this.priceInfo.subTotal.value = _price;
      this.priceInfo.subTotal.text = helpers.convertCurrency(_price);
      this.priceInfo.tax.value = _tax;
      this.priceInfo.tax.text = helpers.convertCurrency(_tax);
      this.priceInfo.shipping.value = this.shippingPrice;
      this.priceInfo.shipping.text = helpers.convertCurrency(this.shippingPrice);
      this.priceInfo.total.value = _total;
      this.priceInfo.total.text = helpers.convertCurrency(_total);
      this.isPriceLoaded = true;
    },
    editShippingInfo() {
      this.modalShippingInfo.fullName = this.shippingInfo.fullName;
      this.modalShippingInfo.address = this.shippingInfo.address;
      this.modalShippingInfo.phone = this.shippingInfo.phoneNumber;
      this.$bvModal.show('shipping-info-modal');
    },
    editPaymentMethod() {
      this.$bvModal.show('payment-method-modal');
    },
   async postOrder() {
    // TODO: use api when ready
    // temp
    const lineItems = this.basketItems.length
      ? this.basketItems.map(res => {
          return {
            price:res.productId,
            quantity:res.count,
            tax_rates: res.tax_rates
          }
        })
      : [];

      const _user = { ...this.$store.getters.userInfo };
      const data = {
        success_url: this.successURL,
        cancel_url: this.cancelURL,
        line_items: lineItems,
        mode: "payment",
        customer_email: _user?.email || '',
        allow_promotion_codes: true,
        billing_address_collection:'required',
        customer_creation:'if_required',
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 500,
                currency: 'usd',
              },
              display_name: 'Shipping cost',
            },
          },
        ]
      }
      try {
        const session = await api.payment.createCheckoutSession(data);
        this.sessionId = session?.id;
        this.$refs.checkoutRef.redirectToCheckout(); 
      } catch (error) {
        console.log(error)
      }

      this.isLoading = true;
      this.isSubmitting = true;
      setTimeout(() => {
        this.isLoading = false;
        this.isSubmitting = false;
        this.$store.commit('clearBasket');
        this.$store.commit('clearShippingInfo');
        this.$eventHub.$emit('basket-reset');
        this.$router.push({ path: '/dashboard/shop/success' });
      }, 3000);
    },
    async onShippingInfoSaved(data) {
      if (data.fullName && data.fullName.length) {
        this.shippingInfo.fullName = data.fullName;
      }
      if (data.phone) {
        this.shippingInfo.phoneNumber = data.phone;
      }
      if (data.address && data.address.line1 && data.address.line1.length) {
        this.shippingInfo.address = data.address;
        try {
          await api.dashboard.profile.updateShippingAddress({
            userId: this.userIdToUpdate,
            address: data.address
          })
          data.address["phone"] = data.phone || "";
          data.address["fullName"] = data.fullName || "";
          this.$store.commit('updateShippingAddress',data.address);
        } catch (error) {
          console.log(error)
        }
      }
    },
    async getPaymentMethod(user) {
      const { stripeCustomerId } = user;
      if (stripeCustomerId) {
        const data = { customerId: stripeCustomerId }
        const paymentMethod = await api.payment.getPaymentMethod(data);
        this.$store.commit('updatePaymentMethod',paymentMethod);
      }
    },
    async savePaymentMethod(token) {
      const user = { ...this.$store.getters.userInfo };
      const data = { id: user.id,token: token }
      await api.payment.updatePaymentMethod(data);
      this.$bvModal.hide('payment-method-modal');
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";

.checkout-shipping-box,
.checkout-payment-box {
  background-color: $whiteColor;
  box-shadow: 0 4px 16px rgba(69, 53, 38, 0.15);
  padding: 34px;
  border-radius: 4px;
}

.checkout-payment-box-field,
.checkout-shipping-box-field {
  display: flex;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .checkout-shipping-box-field-icon,
  .checkout-payment-box-field-icon {
    margin-right: 16px;
    flex: none;
  }
}

.checkout-price-wrapper {
  .box-btn {
    margin-top: 10px;
  }

  @media screen and (max-width: 1199px) {
    .shop-price-box {
      width: 50%;
      float: right;
      margin-bottom: 10px;
    }

    .clear-line {
      float: right;
    }

    .box-btn {
      float: none;
      clear: both;
      margin-top: 0;
    }
  }
}
</style>
