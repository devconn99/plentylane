<template>
  <div id="home-page">
    <!-- <Header isGreenColor></Header> -->

    <main>
      <section class="hero green-bg">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-7 col-md-10 mx-auto text-center">
              <h1 class="title-size1 titleLightColor mb-4">Checkout</h1>
            </div>
          </div>
        </div>
        <HeroWave></HeroWave>
      </section>

      <section class="pad-70">
        <div class="container">
          <div class="row mb-3">
            <div class="col col-md-6">
              <h2 class="text-left">Selected Plan details :</h2>
            </div>
            <div class="col-6 d-none d-md-block">
              <h2 class="text-left">Customer details :</h2>
            </div>
          </div>

          <div class="row mb-2">
            <div class="col-12 col-md-6">
              <div class="row">
                <div class="col-6 col-md-4">Plan</div>
                <div class="col-6">{{ getPlanName | kebabToTitleCase }}</div>
              </div>
              <div class="row mb-2">
                <div class="col-6 col-md-4">Price</div>
                <div class="col-6">${{ getPlanPrice }}/{{ getFrequency }}</div>
              </div>
              <div class="row mb-2">
                <div class="col-10">
                  * You will be charged
                  <span v-if="getFrequency == 'annual'">
                    ${{ getPlanPrice }} plan price
                  </span>
                  <span v-if="!isUpdateCase">
                    + $29.50 initial fee
                  </span>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <b-card class="bg-main">
                <b-form>
                  <b-form-group>
                    <b-form-input
                      v-model="$v.userDetails.name.$model"
                      placeholder="Name"
                      autocomplete="off"
                    />
                    <small
                      class="text-danger d-flex mt-1 text-left"
                      v-if="$v.userDetails.name.$dirty && !$v.userDetails.name.required"
                    >This is a required field.</small>
                  </b-form-group>
                  <b-form-group>
                    <b-form-input v-model="$v.userDetails.email.$model" placeholder="Email" />
                    <small
                      class="text-danger d-flex mt-2 text-left"
                      v-if="!$v.userDetails.email.email"
                    >Please enter valid email address.</small>
                    <small
                      class="text-danger d-flex mt-2 text-left"
                      v-if="$v.userDetails.email.$dirty && !$v.userDetails.email.required"
                    >This is a required field.</small>
                  </b-form-group>
                  <b-form-group>
                    <b-form-input v-model="$v.userDetails.phone.$model" placeholder="Phone" autocomplete="off" />
                    <small
                      class="text-danger d-flex mt-2 text-left"
                      v-if="$v.userDetails.phone.$dirty && !$v.userDetails.phone.required"
                    >This is a required field.</small>
                    <small
                      class="text-danger d-flex mt-2 text-left"
                      v-if="!$v.userDetails.phone.isValidPhoneNumber"
                    >Please enter valid phone number.</small>
                  </b-form-group>

                  <b-form-group v-if="!isUpdateCase">
                    <b-form-checkbox v-model="applyPromoCode" >
                    Apply promo code?
                    </b-form-checkbox>
                    <b-form-input v-if="applyPromoCode" v-model="userDetails.promoCode" placeholder="Promo code" autocomplete="off" />
                  </b-form-group>

                  <b-form-group v-if="!isUpdateCase">
                    <b-form-input
                      v-model="$v.userDetails.address.line1.$model"
                      placeholder="Street"
                      autocomplete="off"
                    />
                    <small
                      class="text-danger d-flex mt-2 text-left"
                      v-if="$v.userDetails.address.line1.$dirty && !$v.userDetails.address.line1.required"
                    >This is a required field.</small>
                  </b-form-group>

                  <div class="d-flex mt-2" v-if="!isUpdateCase">
                    <b-form-group>
                      <b-form-input
                        v-model="$v.userDetails.address.city.$model"
                        placeholder="City"
                        autocomplete="off"
                      />
                      <small
                        class="text-danger d-flex mt-2 text-left"
                        v-if="$v.userDetails.address.city.$dirty && !$v.userDetails.address.city.required"
                      >This is a required field.</small>
                    </b-form-group>

                    <b-form-group>
                      <b-form-input
                        v-model="userDetails.address.postal_code"
                        placeholder="Postal Code"
                        autocomplete="off"
                      />
                    </b-form-group>
                    <b-form-group>
                      <b-form-input
                        v-model="$v.userDetails.address.state.$model"
                        placeholder="State"
                        autocomplete="off"
                      />
                      <small
                        class="text-danger d-flex mt-2 text-left"
                        v-if="$v.userDetails.address.state.$dirty && !$v.userDetails.address.state.required"
                      >
                        This is a required field.
                      </small>
                    </b-form-group>
                    <b-form-group>
                      <b-form-input
                        v-model="$v.userDetails.address.country.$model"
                        placeholder="Country"
                        autocomplete="off"
                      />
                      <small
                        class="text-danger d-flex mt-2 text-left"
                        v-if="$v.userDetails.address.country.$dirty && !$v.userDetails.address.country.required"
                      >
                        This is a required field.
                      </small>
                    </b-form-group>
                  </div>
                  <StripeElementCard
                    v-if="!isUpdateCase"
                    class="mt-2"
                    ref="elementRef"
                    :testMode="true"
                    :hidePostalCode="true"
                    :pk="publishableKey"
                    @token="tokenCreated"
                  />
                </b-form>
              </b-card>
            </div>
          </div>

          <div class="row">
            <div class="d-flex justify-content-center" style="width: 100%">
              <b-button
                class="mt-4 btnGreen btnBigSize btn50 text-uppercase hover-slide-left"
                @click="submitCardData"
              >
                <span>Subscribe to plan</span>
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
import { validationMixin } from "vuelidate";
import { required,email,requiredIf } from "vuelidate/lib/validators";

import Footer from "../components/homepage/Footer";
import Header from "../components/homepage/Header";
import BackToTop from "../components/BackToTop";
import HeroWave from "../components/HeroWave";
import PromoLogo from "../components/homepage/PromoLogo";
import { StripeElementCard } from "@vue-stripe/vue-stripe";
import mobileDetectorMixin from "../mixins/mobile-detector-mixin";
import config from "../config";
import api from "../api";
import { mapGetters } from "vuex";

export default {
  name: "PlanCheckout",
  mixins: [mobileDetectorMixin,validationMixin],
  components: {
    Footer,
    Header,
    BackToTop,
    HeroWave,
    PromoLogo,
    StripeElementCard,
  },
  created() {
    let user = this.userInfo;
    if (!user || !user.email || !user.id) {
      this.loadUserInfo();
    } else {
      this.manipulateUserDetails(user);
    }
  },
  mounted() {
    window.scrollTo(0,0); // temp
    this.$eventHub.$emit("mobile-side-nav-closed");
  },
  data: () => ({
    plan: "starter-monthly",
    publishableKey: config.STRIPE_INFO.PUBLISHABLE_KEY,
    applyPromoCode:false,
    userDetails: {
      name: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      },
      promoCode:""
    },
  }),
  validations: {
    userDetails: {
      email: {
        required,
        email,
      },
      name: {
        required,
      },
      phone: {
        required,
        isValidPhoneNumber(value) {
          if (value === "") return true;
          return /^[2-9]\d{2}-[2-9]\d{2}-\d{4}$/.test(value) || /^\d{10}$/.test(value);
        },
      },
      address: {
        line1: {
          required: requiredIf(function (form) {
            return !this.isUpdateCase
          })
        },
        city: {
          required: requiredIf(function (form) {
            return !this.isUpdateCase
          }),
        },
        state: {
          required: requiredIf(function (form) {
            return !this.isUpdateCase
          }),
        },
        country: {
          required: requiredIf(function (form) {
            return !this.isUpdateCase
          })
        },
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
    getPlanData() {
      let planData = this.$route.params?.plan;
      if (planData) {
        return planData;
      } else {
        const { id } = this.$route.params
        if (id) {
          return this.$router.push(`/choose-plan/${id}`);
        } else {
          return this.$router.push("/choose-plan");
        }

      }
    },
    getPlanName() {
      return this.getPlanData.name ?? "";
    },
    getPlanPrice() {
      return this.getPlanData?.price?.price ?? "";
    },
    getPlanPriceId() {
      return this.getPlanData?.price?.id ?? "";
    },
    getFrequency() {
      return this.getPlanName.includes("monthly") ? "monthly" : "annual";
    },
    isUpdateCase() {
      return !!this.$route.params.id
    }
  },
  methods: {
    manipulateUserDetails(user) {
      const { email,fullName,phone,subscription } = user;
      this.userDetails = {
        ...this.userDetails,
        email,
        phone,
        name: fullName,
        subscription
      };
      if (this.isUpdateCase) {
        this.getSubscription()
      }
    },

    async getSubscription() {
      const { id } = this.userDetails?.subscription

      try {
        const subscription = await api.payment.getSubscription(id)
        this.$store.commit('updateSubscription',subscription);
      } catch (error) {
        console.log(error)
      }
    },
    async submitCardData() {
      this.$v.userDetails.$touch();
      if (this.$v.userDetails.$anyError) {
        return;
      }
      if (!this.isUpdateCase) {
        this.$refs.elementRef.submit();
      } else {
        await this.apiCallToGeneratePaymentIntent(null);
      }

    },
    async tokenCreated(token) {
      if (token?.card) {
        await this.apiCallToGeneratePaymentIntent(token);
      }
    },

    async apiCallToGeneratePaymentIntent(token) {
      try {
        const id = this.$route.params.id
        if (id) {
          const subscriptionId = this.userDetails?.subscription?.stripesubscriptionId
          const planId = this.userDetails?.subscription?.plan?.id
          const updatedSubscription = await this.updateSubscription(id,subscriptionId,planId)
          this.$store.commit('updateSubscription',updatedSubscription);
          this.$router.push("/plan-success");
        } else {
          let { customer,source } = await this.createCustomer(token.id);
          if (customer && source) {
            await this.createPayment(customer.id,token.card.id,source.id);
            const createdSubscription = await this.createSubscription(customer.id,token.card.id);
            this.$store.commit('updateSubscription',createdSubscription);
            this.$router.push("/plan-success");
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async createCustomer(token) {
      let customer = { ...this.userDetails,stripe_token: token };
      let user = await api.payment.createCustomer(customer);
      return user;
    },
    async createPayment(customerId,paymentMethod,sourceId) {
      const payment = {
        amount: 2950,
        customer: customerId,
        payment_method: paymentMethod,
        source: sourceId,
        promoCode:this.userDetails.promoCode,
        metadata: { plan: this.getPlanName },
      };
      return await api.payment.makePayment(payment);
    },
    async createSubscription(customerId,paymentMethod) {
      return await api.payment.createSubscription({
        customerId,
        priceId: this.getPlanPriceId,
        userId: this.userInfo?.id,
        payment_method: paymentMethod,
        promoCode:this.userDetails.promoCode,
        plan: {
          frequency: this.getFrequency,
          name: this.getPlanName,
          price: this.getPlanPrice,
          signupFee: 29.5,
          alias: this.getPlanName,
          swapLimit: 0,
        },
      });
    },
    async updateSubscription(id,subscriptionId,planId) {
      return await api.payment.updateSubscription({
        id,
        subscriptionId,
        priceId: this.getPlanPriceId,
        userId: this.userInfo?.id,
        promoCode:this.promoCode,
        plan: {
          id: planId,
          frequency: this.getFrequency,
          name: this.getPlanName,
          price: this.getPlanPrice,
          signupFee: 29.5,
          alias: this.getPlanName,
          swapLimit: 0,
        },
      });
    },
    loadUserInfo() {
      api.dashboard.profile
        .userInfo()
        .then((data) => {
          this.manipulateUserDetails({ ...data });
          this.$store.commit("userInfo",{ ...data });
        })
        .catch((err) => { });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";

.bg-main {
  background: $mainBackgroundColor !important;
}
</style>
