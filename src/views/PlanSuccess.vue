<template>
  <div class="row">
    <div class="col-12 col-sm-8 col-md-10 col-lg-9 col-xl-8 mx-auto text-center">
      <div class="dashboard-title-box mb-3">
        <div class="title-size3 titleGreenNavyColor">Your order is complete!</div>
      </div>
      <p>Your plan is successfully updated.</p>
      <div class="title-size3 titleGreenNavyColor mt-5 mb-3">Now what?</div>
      <div class="box-btn">
        <router-link
          :to="{ path: '/dashboard' }"
          class="btnGreenTransparent btnHugeSize btn100 hover-slide-left"
        >
          <span>Continue</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import config from "../config";
import api from "../api";
import { mapGetters } from "vuex";

export default {
  name: "PlanSuccess",
  created() {
    let user = this.userInfo;
    if (!user || !user.email || !user.id) {
      this.loadUserInfo();
    } else {
      this.manipulateUserDetails(user);
    }
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
        } else {
          let { customer,source } = await this.createCustomer(token.id);
          if (customer && source) {
          await this.createPayment(customer.id,token.card.id,source.id);
          const createdSubscription = await this.createSubscription(customer.id,token.card.id);
          this.$store.commit('updateSubscription',createdSubscription);
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
