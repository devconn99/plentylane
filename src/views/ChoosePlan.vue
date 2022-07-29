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
          <h2 class="text-left mb-3 text-fuchsia-rose">Choose your plan:</h2>
          <div class="row align-items-center mb-2">
            <div class="col-3"></div>
            <div class="col-3 text-nowrap">Swap with</div>
            <div class="col-6 text-dark-green" v-if="isMobile">
              <span style="border-bottom: 1px black solid"> Monthly</span>
              <br />Annual
            </div>
            <div class="col-6 text-dark-green" v-else>Monthly / Annual</div>
          </div>
          <div class="row align-items-center mb-3 toggle-plan-radio-group">
            <div class="col-3 text-left text-fuchsia-rose">Starter</div>
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
                    'active-button': plan == 'starter-monthly',
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
                    'active-button': plan == 'starter-annual',
                    'mr-4': isMobile,
                    btn: !isMobile,
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
            <div class="col-3 text-left text-fuchsia-rose">Casual</div>
            <div class="col-3 text-nowrap">20 people</div>
            <div class="col-6">
              <div
                class="btn-group-toggle"
                :class="{
                  'd-flex flex-column': isMobile,
                  'd-inline-block': !isMobile,
                }"
              >
                <label :class="{ 'active-button': plan == 'casual-monthly', btn: !isMobile }">
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
                    'active-button': plan == 'casual-annual',
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
            <div class="col-3 text-left text-fuchsia-rose">Unlimited</div>
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
                    'active-button': plan == 'unlimited-monthly',
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
                    'active-button': plan == 'unlimited-annual',
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
            <span v-if="!isUpdateCase">
              * All plans pay initial fee of $29.50 for 4 Plenty Lane containers to
            swap in, including shipping.

            </span>
           
            <stripe-checkout
            ref="checkoutRef"
            :pk="publishableKey"
            :session-id="sessionId"
            @loading="v => loading = v"
            />   
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

    <MessageModal
      id="no-plan-modal"
      message="Kindly select a plan"
      @confirmed="closeMessageModal"
    />
  </div>
</template>

<script>
import { StripeCheckout } from "@vue-stripe/vue-stripe";
import Footer from "../components/homepage/Footer";
import Header from "../components/homepage/Header";
import BackToTop from "../components/BackToTop";
import MessageModal from "../components/modals/MessageModal.vue";
import HeroWave from "../components/HeroWave";
import PromoLogo from "../components/homepage/PromoLogo";
import mobileDetectorMixin from "../mixins/mobile-detector-mixin";
import config from "../config";
import api from "../api";
import { mapGetters } from "vuex";

export default {
  name: "ChoosePlan",
  mixins: [mobileDetectorMixin],
  components: { Footer, MessageModal, Header, BackToTop, HeroWave, PromoLogo,StripeCheckout },
  created(){
    if(!this.userInfo.email){
      this.loadUserInfo()
    }
    this.getPlanName()
  },
  mounted() {
    window.scrollTo(0, 0); // temp
    this.$eventHub.$emit("mobile-side-nav-closed");
  },
  data: ()=>{
    return{
    sessionId:"",
    publishableKey: config.STRIPE_INFO.PUBLISHABLE_KEY,
    plan: "starter-monthly",
  }},
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
    planCalculation() {
      const plan = this.plan;
      return {
        price: config.STRIPE_INFO.PRICE[plan],
        name: plan
      };
    },
    getFrequency() {
      return this.plan.includes("monthly") ? "monthly" : "annual";
    },
    lineItems(){
      const plan = this.plan
      return [{
        price: config.STRIPE_INFO.PRICE[plan].id,
        quantity:1
      },
      ]
    },
    successURL(){
      return config.STRIPE_INFO.SUCCESS_URL
    },
    cancelURL(){
      return config.STRIPE_INFO.CANCEL_URL
    },
    isUpdateCase() {
      return !!this.$route.params.id
    }
  },
  methods: {
    async goToCheckout() {
      if (this.lineItems?.length) {
        let lineItemsToUpdate = [...this.lineItems];
        if (!this.isUpdateCase) {
          lineItemsToUpdate.push({
            price:config.STRIPE_INFO.PRICE["initial-fee"].id,
            quantity:1
          });
        }

        const data = {
          success_url: this.successURL,
          cancel_url: this.cancelURL,
          line_items: lineItemsToUpdate,
          mode: "subscription",
          customer_email: this.userInfo?.email || '',
          allow_promotion_codes: true,
          billing_address_collection:'required'
        }
        if(this.getFrequency=='monthly' && !this.isUpdateCase) {
          data['subscription_data'] = {
            trial_period_days:30
          }
        }

        try {
          const session = await api.payment.createCheckoutSession(data);
          this.sessionId=session?.id;
          this.$refs.checkoutRef.redirectToCheckout();        
        } catch (error) {
          console.log(error)
        }
      } else {
        this.$bvModal.show('no-plan-modal');
      }

      // const id=this.$route.params.id
      // if(id) {
      //   this.$router.push({
      //     name: "PlanCheckoutEdit",
      //     params: {
      //       plan: this.planCalculation,
      //       id
      //     },
      //   });
      // } else {
      //   this.$router.push({
      //     name: "PlanCheckout",
      //     params: {
      //       plan: this.planCalculation,
      //     },
      //   });
      // }
    },
    closeMessageModal() {
      this.$bvModal.hide('no-plan-modal');
    },

    getPlanName() {
      const planId=this.$route.params.id
      if (planId) {
        const obj=config.STRIPE_INFO.PRICE;

        const key = Object.keys(obj).find((key)=> {
          return obj[key]['id'] === planId}
        );

        if(key) {
          this.plan = key;
        }
      }
    },

    loadUserInfo() {
      api.dashboard.profile
        .userInfo()
        .then((data) => {
          this.$store.commit("userInfo",{ ...data });
        })
        .catch((err) => { });
    }
  },
};
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";

.text-fuchsia-rose {
  color: #C54579;
}

.active-button{
  background-color: #194f5a !important;
}

.text-dark-green{
  color: #194f5a;
}

.plan {
  font-size: 14pt;
  .container {
    max-width: 600px;
    text-align: center;
  }
  .toggle-plan-radio-group {
    // position: relative;
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
