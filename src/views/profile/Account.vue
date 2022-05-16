<template>
  <span>
    <div class="row">
      <div class="col-12">
        <div class="dashboard-title-box flex-row align-items-center mb-4 mb-lg-5 mt-2 mt-lg-3">
          <div class="dashboard-profile-title-back mr-2 mr-md-3">
            <div class="cursor-pointer" @click="showMobileAside">
              <SvgIcon icon="arrowLeft"></SvgIcon>
            </div>
          </div>
          <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">
            Account
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-sm-6">
            <h4 class="font-weight-bold titleGreenNavyColor">Plan</h4>
            <h5 class="ml-4 font-weight-bold titleGreenNavyColor">
              Type : {{ getPlanName | kebabToTitleCase }}
            </h5>
            <h5 class="ml-4 font-weight-bold titleGreenNavyColor">
              Price : {{ getPlanPrice }}
            </h5>
            <div class="d-flex mt-4">
              <b-button class="btnGreen btnBigSize btn50 text-uppercase hover-slide-left" @click="updateSubscription()">
                <span>Update</span>
              </b-button>
              <b-button
                class="ml-2 btnLightRed btnBigSize btn50 text-uppercase hover-slide-left"
                @click="openConfirmCancelSubscription"
              >
                <span>Cancel</span>
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal
      :id="modalId"
      message="You want to cancel subscription?"
      @confirmed="cancelSubScription"
    />
    <MessageModal
      :id="messageModalId"
      message="Subscription cancelled successfully!"
      @confirmed="closeMessageModal"
    />
  </span>
</template>

<script>
import SvgIcon from '../../components/SvgIcon';
import { mapGetters } from 'vuex'
import ConfirmModal from '../../components/modals/ConfirmModal.vue';
import MessageModal from '../../components/modals/MessageModal.vue';
import api from '../../api';
import config from '../../config';

export default {
  name: "Account",
  components: { SvgIcon,ConfirmModal,MessageModal },
  data: () => ({
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
      subscription: null
    },
    modalId: "confirm-cancel-subscription",
    messageModalId: "subscription-canceled"
  }),
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
    getPlanName() {
      const planId=this.userDetails?.subscription?.plan?.id
      if (planId) {
        const obj = config.STRIPE_INFO.PRICE;
        return Object.keys(obj).find((key)=> {
          return obj[key]['id'] === planId
        });
      }
      return ""
    },
    getPlanPrice() {
       const price = this.userDetails?.subscription?.plan?.amount;
       return price ? (price/100) : 0;
    }
  },
  created() {
    let user = this.userInfo;
    if (!user || !user.email || !user.id) {
      this.loadUserInfo();
    } else {
      this.manipulateUserDetails(user);
    }
  },
  methods: {
    showMobileAside() {
      this.$eventHub.$emit('show-mobile-profile-aside');
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
    manipulateUserDetails(user) {
      const { email,fullName,phone,subscription,stripeCheckoutId } = user;
      this.userDetails = {
        ...this.userDetails,
        email,
        phone,
        name: fullName,
        subscription,
        stripeCheckoutId
      };
      // this.getSubscription()
      this.getCheckoutSession()
    },
    updateSubscription() {
      let id = this.userDetails.subscription?.id
      if (id) {
        this.$router.push({
          name: "ChoosePlanEdit",
          params: {
            id
          },
        });
      }
    },
    openConfirmCancelSubscription() {
      let id = this.userDetails.subscription?.id
      if (id) {
        this.$bvModal.show(this.modalId);
      }

    },
    async getSubscription() {
      const { id } = this.userDetails?.subscription
      try {
        const subscription = await api.payment.getSubscription(id)
        this.userDetails.subscription = subscription
        this.$store.commit('updateSubscription',subscription);
      } catch (error) {
        console.log(error)
      }
    },
  async getCheckoutSession() {
      const { stripeCheckoutId } = this.userDetails
      if(stripeCheckoutId){
     try {
        const chckout = await api.payment.getCheckoutSession(stripeCheckoutId)
        if(chckout?.subscription){
        const subscription = await api.payment.getSubscriptionById(chckout.subscription)
        this.$store.commit('updateSubscription',subscription);
        }
      } catch (error) {
       this.$store.commit('updateSubscription',null);
        console.log(error)
      }
     }else
     {
       this.$store.commit('updateSubscription',null);
     }
    },
    async cancelSubScription() {
      const { id,stripesubscriptionId,planId } = this.userDetails?.subscription
      try {
        await api.payment.cancelSubscription({ id,subscriptionId: stripesubscriptionId,planId })
        this.$bvModal.show(this.messageModalId);
        this.$store.commit('updateSubscription',null);
      } catch (error) {
        console.log(error)
      }
    },
    closeMessageModal() {
      this.$bvModal.hide(this.messageModalId);
      this.$router.push("/choose-plan");
    }
  }
}
</script>