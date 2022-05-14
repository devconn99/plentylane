<template>
  <div id="home-page">
    <!-- <Header isGreenColor></Header> -->

    <main>
      <section class="hero green-bg">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-7 col-md-10 mx-auto text-center">
              <h1 class="title-size1 titleLightColor mb-4">Choose a Plan</h1>
            </div>
          </div>
        </div>
        <HeroWave></HeroWave>
      </section>

      <section class="plan pad-70">
        <div class="container">
          <h2 class="text-left mb-3">Choose your plan:</h2>
          <div class="row align-items-center mb-2">
            <div class="col-3"></div>
            <div class="col-3 text-nowrap">Swap with</div>
            <div class="col-6" v-if="isMobile">
              <span style="border-bottom: 1px black solid"> Monthly</span>
              <br />Annual
            </div>
            <div class="col-6" v-else>Monthly / Annual</div>
          </div>
          <div class="row align-items-center mb-3 toggle-plan-radio-group">
            <div class="col-3 text-left">Starter</div>
            <div class="col-3 text-nowrap">7 people</div>
            <div class="col-6">
              <div
                class="btn-group-toggle"
                :class="{
                  'd-flex flex-column': isMobile,
                  'd-inline-block': !isMobile,
                }"
              >
                <label
                  :class="{
                    active: plan == 'starter-monthly',
                    btn: !isMobile,
                    'mr-4': isMobile,
                  }"
                >
                  <input
                    type="radio"
                    name="plan-radios"
                    value="starter-monthly"
                    v-model="plan"
                  />
                  <span> $0</span>
                </label>
                <label
                  :class="{
                    active: plan == 'starter-annual',
                    btn: !isMobile,
                    'mr-4': isMobile,
                  }"
                >
                  <input
                    type="radio"
                    name="plan-radios"
                    value="starter-annual"
                    v-model="plan"
                  />
                  <span> $0</span>
                </label>
              </div>
            </div>
          </div>
          <div class="row align-items-center mb-3 toggle-plan-radio-group">
            <div class="col-3 text-left">Casual</div>
            <div class="col-3 text-nowrap">20 people</div>
            <div class="col-6">
              <div
                class="btn-group-toggle"
                :class="{
                  'd-flex flex-column': isMobile,
                  'd-inline-block': !isMobile,
                }"
              >
                <label :class="{ active: plan == 'casual-monthly', btn: !isMobile }">
                  <input
                    type="radio"
                    name="plan-radios"
                    value="casual-monthly"
                    v-model="plan"
                  />
                  <span> $4.95</span>
                </label>
                <label
                  :class="{
                    active: plan == 'casual-annual',
                    btn: !isMobile,
                    'ml-3': isMobile,
                  }"
                >
                  <input
                    type="radio"
                    name="plan-radios"
                    value="casual-annual"
                    v-model="plan"
                  />
                  <span> $49.50</span>
                </label>
              </div>
            </div>
          </div>
          <div class="row align-items-center mb-3 toggle-plan-radio-group">
            <div class="col-3 text-left">Unlimited</div>
            <div class="col-3">Unlimited people</div>
            <div class="col-6">
              <div
                class="btn-group-toggle"
                :class="{
                  'd-flex flex-column': isMobile,
                  'd-inline-block': !isMobile,
                }"
              >
                <label
                  :class="{
                    active: plan == 'unlimited-monthly',
                    btn: !isMobile,
                  }"
                >
                  <input
                    type="radio"
                    name="plan-radios"
                    value="unlimited-monthly"
                    v-model="plan"
                  />
                  <span> $8.95</span>
                </label>
                <label
                  :class="{
                    active: plan == 'unlimited-annual',
                    btn: !isMobile,
                    'ml-3': isMobile,
                  }"
                >
                  <input
                    type="radio"
                    name="plan-radios"
                    value="unlimited-annual"
                    v-model="plan"
                  />
                  <span> $89.50</span>
                </label>
              </div>
            </div>
          </div>

          <div class="row my-4">
            <img
              src="../assets/images/landing/container1.jpg"
              alt=""
              class="col-12 col-md-6 img-fluid"
            />
            <img
              src="../assets/images/landing/container2.jpg"
              alt=""
              class="col-12 col-md-6 img-fluid"
            />
          </div>

          <div class="row">
            <b-form-checkbox class="mx-auto ml-md-3">
              <span> It's a gift for someone else! </span>
            </b-form-checkbox>
            * All plans pay initial fee of $29.50 for 4 Plenty Lane containers to
            swap in, including shipping.
            <div class="d-flex justify-content-center" style="width: 100%">
              <b-button
                @click="goToCheckout"
                class="
                  mt-4
                  btnGreen
                  btnBigSize
                  btn50
                  text-uppercase
                  hover-slide-left
                "
              >
                <span>Proceed to checkout</span>
              </b-button>
            </div>
          </div>
        </div>
      </section>

      <PromoLogo></PromoLogo>
    </main>

    <Footer></Footer>

    <BackToTop></BackToTop>
  </div>
</template>

<script>
import Footer from "../components/homepage/Footer";
import Header from "../components/homepage/Header";
import BackToTop from "../components/BackToTop";
import HeroWave from "../components/HeroWave";
import PromoLogo from "../components/homepage/PromoLogo";
import mobileDetectorMixin from "../mixins/mobile-detector-mixin";
import config from "../config";

export default {
  name: "AfterAccountCreation",
  mixins: [mobileDetectorMixin],
  components: { Footer, Header, BackToTop, HeroWave, PromoLogo },
  mounted() {
    window.scrollTo(0, 0); // temp
    this.$eventHub.$emit("mobile-side-nav-closed");
  },
  data: () => ({
    plan: "starter-monthly",
  }),
  computed: {
    planCalculation() {
      let price = {
        price: 0,
        id: "",
      };
      const plan = this.plan;
      return {
        price: config.STRIPE_INFO.PRICE[plan],
        name: plan
      };
    },
  },
  methods: {
    choosePlan(plan) {
      this.plan = plan;
    },
    goToCheckout() {
      const id=this.$route.params.id
      if(id) {
        this.$router.push({
          name: "PlanCheckoutEdit",
          params: {
            plan: this.planCalculation,
            id
          },
        });
      } else {
        this.$router.push({
          name: "PlanCheckout",
          params: {
            plan: this.planCalculation,
          },
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.plan {
  font-size: 14pt;
  .container {
    max-width: 600px;
    text-align: center;
  }
  .toggle-plan-radio-group {
    //   position: relative;
    .btn {
      border-color: transparent;
      padding: 13px;
      transition: all 0.6ms ease;
      font-family: $FilsonProRegular;
      font-size: 18px;
      letter-spacing: 0.6px;
      line-height: 18px;
      margin: 0 3px;
      min-width: 100px;

      &.active {
        background-color: #ffffff;
        color: $textBlackColor;
        box-shadow: 0 4px 16px 0 rgba(69, 53, 38, 0.15);
      }
      &:not(.active) {
        background-color: $greenColor;
        color: #ffffff;
      }
    }
  }
  // @media screen and (max-width: $phoneBigWidth) {
  //   font-size: 12pt;
  //   .radio-btn {
  //     .btn {
  //       font-size: 14px;
  //       padding: 15px;
  //       line-height: 14px;
  //       min-width: 90px;
  //       margin: 0 3px;
  //     }
  //   }
  // }
}
.prices {
  align-items: center;
  p {
    font-size: 14pt;
    margin: 0;
  }
  hr {
    border-top: 2px solid #686866;
    margin: 2px auto;
    width: 20px;
  }
}
.description {
  ul {
    text-align: left;
    margin: 0 50px 25px 50px;
    li {
      list-style-type: circle;
    }
  }
}
</style>
