<template>
  <b-modal
    id="payment-method-modal"
    ref="shippingInfoModal"
    hide-footer size="lg"
    centered
    modal-class="payment-method-modal"
    :return-focus="{}"
  >
    <div slot="default">
      <div class="title-size3 titleGreenNavyColor mb-4 text-center">
        Edit Pament Method
      </div>
      <b-form class="form">
        <StripeElementCard
          class="mt-2"
          ref="elementRef"
          @element-ready="enableSaveButton=true"
          :testMode="true"
          :hidePostalCode="true"
          :pk="publishableKey" @token="tokenCreated"
        />
        <div class="btn-box mt-2">
          <b-button
            :disabled="!enableSaveButton"
            @click="savePaymentMethod"
            class="btnGreen btnBigSize btn100 text-uppercase hover-slide-left"
          >
            <span>Save</span>
          </b-button>
        </div>
      </b-form>
    </div>
    <div slot="modal-title"></div>
    <div slot="modal-header-close">
      <div class="modal-popup-title-icon">
        <SvgIcon icon="closeModalIcon"></SvgIcon>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { StripeElementCard } from "@vue-stripe/vue-stripe";
import SvgIcon from '../SvgIcon';
import config from '../../config';
export default {
  name: "PaymentMethodModal",
  components: { SvgIcon,StripeElementCard},
  data:() => {
    return {
      publishableKey: config.STRIPE_INFO.PUBLISHABLE_KEY,
      enableSaveButton:false
    }
  },
  methods: {
    savePaymentMethod() {
      this.$refs.elementRef.submit();
    },
    tokenCreated(token) {
      if(token.card) {
        this.$emit("onSavePaymentMethod", token.id)
      }
    },
  }
}
</script>

<style scoped>
</style>
