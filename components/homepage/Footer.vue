<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-9">
          <div class="footer-box">
            <div class="footer-box-part1">
              <div class="logo-block">
                <nuxt-link to="/">
                  <img src="../../assets/images/logo/logo_red.svg" alt="" class="img-fluid">
                </nuxt-link>
              </div>
              <nav class="footer-nav">
                <ul class="footer-nav-menu-landing">
                  <li>
                    <nuxt-link to="/pricing">Pricing</nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/faqs">FAQs</nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/food-safety">Food Safety FAQs</nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/terms">Terms</nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/privacy">Privacy</nuxt-link>
                  </li>
                </ul>
              </nav>
            </div>
            <div class="copyright">
              &copy;2022
              <a href="https://www.plentylane.com" target="_blank">PlentyLane.com</a>. <span>All Rights Reserved.</span>
            </div>
          </div>
        </div>
        <div class="col-lg-3 d-none d-lg-block ml-auto" v-if="!token">
          <div class="footer-login">
            <div class="footer-login-btn">
              <nuxt-link to="/sign-up" class="btnLightRed btnNormalSize btn100 hover-slide-left">
                <span>Sign Up Today!</span>
              </nuxt-link>
            </div>
            <div class="footer-login-text titleLightColor">
              Already have an account?
            </div>
            <div class="footer-login-link">
              <nuxt-link to="login">
                <SvgIcon icon="lock"></SvgIcon>
                Login
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import SvgIcon from '../SvgIcon';
export default {
  name: "Footer",
  components: {SvgIcon},
  data() {
    return {
      tokn: null,
    }
  },
  computed:{
    token() {
      return !!this.tokn
    }
  },
  mounted() {
    this.tokn = localStorage.getItem("plAccessToken");
  }
}
</script>

<style scoped lang="scss">

</style>
