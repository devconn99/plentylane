<template>
  <div class="row">
    <div class="col-12 col-sm-8 col-md-10 col-lg-9 col-xl-8 mx-auto text-center">
      <div class="dashboard-title-box mb-3">
        <div class="title-size3 titleGreenNavyColor">Your order is complete!</div>
      </div>
      <p>You’ll be receiving a confirmation email shortly with you order details.</p>

      <div class="title-size3 titleGreenNavyColor mt-5 mb-3">Now what?</div>
      <div class="box-btn">
        <nuxt-link
            :to="{ path: '/dashboard/shop' }"
            class="btnGreenTransparent btnHugeSize btn100 hover-slide-left"
        >
          <span>Continue Shopping</span>
        </nuxt-link>
      </div>

      <div class="title-size3 titleGreenNavyColor mt-5 mb-3">or</div>
      <div class="box-btn d-md-flex">
        <nuxt-link
            :to="{ path: '/dashboard/eat' }"
            tag="button"
            class="btnLightGreen btnHugeSize btn100 hover-slide-left mr-3 mr-lg-4 mb-3 mb-md-0"
        >
          <span>
            <SvgIcon icon="eat" :params="{ fill: '#FEF8E6' }"></SvgIcon>
            Eat
          </span>
        </nuxt-link>
        <nuxt-link
            :to="{ path: '/dashboard/cook' }"
            tag="button"
            class="btnGreen btnHugeSize btn100 hover-slide-left">
          <span>
            <SvgIcon icon="cook" :params="{ fill: '#FEF8E6' }"></SvgIcon>
            Cook
          </span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon';
export default {
  name: "Success",
  components: {SvgIcon}
}
</script>

<style scoped>

</style>
