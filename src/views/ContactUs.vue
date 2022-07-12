<template>
  <div class="contact-us-page-wrapper">
    <div class="dashboard-hero dashboard-contact-us-bg">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 text-center">
            <div class="title-size1 titleDarkColor">Contact Us</div>
            <div class="font-weight-bold">
              We’d love to answer any questions you have, and value great customer service.
            </div>
            <div>
              There is only one person who can answer questions right now, and sometimes she needs to sleep or attempt a personal life. So please have a little patience if we don’t get back to you right away. Thanks for understanding our human limitations! At least
              you won’t get a bot. &#128578;
            </div>
          </div>
        </div>
      </div>
      <HeroWave />
    </div>
    <div class="dashboard-content">
      <div class="container-fluid position-relative">
        <loading :active.sync="isLoading" :is-full-page="loaderOptions.IS_FULL_PAGE" :color="loaderOptions.COLOR" :background-color="loaderOptions.BACKGROUND_COLOR" />
        <b-alert @dismiss-count-down="countDownChanged" @dismissed="alert.show = 0" :show="alert.show" :variant="alert.variant" dismissible fade class="d-alert">
          <p>{{ alert.msg }}</p>
        </b-alert>
        <contact-us @on-contact-us="contactUs" />
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import api from "../api";
import HeroWave from '../components/HeroWave';
import ContactUs from '../components/ContactUs.vue';
import config from "../config";

export default {
  name: "ContactUsView",
  components: { HeroWave, ContactUs, Loading },
  data: () => ({
    isLoading: false,
    loaderOptions: { ...config.LOADER_OPTIONS },
    alert: {
      msg: "",
      variant: "success",
      show: 0
    }
  }),
  methods: {
    countDownChanged(dismissCountDown) {
      this.alert.show = dismissCountDown;
    },
    contactUs(data) {
      this.isLoading = true;
      api.dashboard.contactUs.contactUs(data).then(res => {
        this.alert = {
          msg: "Email sent successfully",
          variant: "success",
          show: 5
        }
      }).catch(err => {
        this.alert = {
          msg: "Email sent failed",
          variant: "danger",
          show: 5
        }
      }).finally(() => {
        this.isLoading = false;
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.contact-us-page-wrapper {
  .dashboard-content {
    padding-top: 80px !important;
    padding-bottom: 0 !important;
    @media screen and (max-width: $tableMinWidth) {
      padding-top: 40px !important;
    }
  }
}

.d-alert {
  width: calc(100%);
  z-index: 4;
}
</style>
