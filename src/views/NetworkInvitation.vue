<template>
  <div id="authorization-page">
    <header class="header">
      <div class="container">
        <div class="header-box">
          <div class="logo-block">
            <router-link to="/">
              <img src="../assets/images/logo/logo_green.svg" alt="" class="img-fluid">
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main>
      <section class="authorization">
        <div class="authorization-box">
          <div class="authorization-box-position position-relative">
            <loading
              :active.sync="isSubmitting"
              :is-full-page="loaderOptions.IS_FULL_PAGE"
              :color="loaderOptions.COLOR"
              :background-color="loaderOptions.BACKGROUND_COLOR"
            ></loading>

            <h1 class="title-size3 titleGreenNavyColor">Join {{inviteeUser}}'s network.</h1>
            <b-alert
              :show="alert.show"
              dismissible
              :variant="alert.variant"
              @dismiss-count-down="countDownChanged"
              @dismissed="alert.show = 0"
            >
              <p>{{alert.msg}}</p>
            </b-alert>

            <div>
              <h2>Do you want to accept the invitation?</h2>
              <span class="d-flex mt-4">
                <b-button
                  @click="onSubmit"
                  :disabled="isCurrentInvitationInvalid"
                  class="btnGreen btnBigSize btn50 text-uppercase hover-slide-left"
                >
                  <span>Accept</span>
                </b-button>
                <b-button
                  @click="rejectInvitation"
                  :disabled="isCurrentInvitationInvalid"
                  class="ml-2 btnLightRed btnBigSize btn50 text-uppercase hover-slide-left"
                >
                  <span>Reject</span>
                </b-button>
              </span>
            </div>
          </div>
        </div>
        <div class="authorization-background green-bg"></div>
      </section>
    </main>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import { mapGetters } from 'vuex';
import api from '../api';
import SvgIcon from '../components/SvgIcon';
import config from '../config';
import helpers from '../helpers';

export default {
  name: "SignUp",
  components: {Loading, SvgIcon},
  data: () => ({
    // showSuccessAlert: false,
    alert: {
      msg: "",
      variant: "success",
      show: 0
    },
    alreadyAccepted: false,
    isValidInvitation: true,
    registeredUserMail: "",
    submitted: false,
    loaderOptions: { ...config.LOADER_OPTIONS },
    isSubmitting: false,
    inviteId: ""
  }),
  mounted() {
    this.manipulateInvitation();
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
    inviteeUser() {
      return this.$route.query['user-name'];
    },
    code() {
      return this.$route.query?.code;
    },
    isCurrentInvitationInvalid(){
      return this.alreadyAccepted || !this.isValidInvitation;
    },
    token(){
      const _token = localStorage.getItem("plAccessToken");
      return _token || "";
    }
  },
  methods: {
    manipulateInvitation() {
      const code = this.$route.query.code;
      if(code){
        api.invitations.validateInvitation(code).then(res=>{
          if (res?.status == "Accepted") {
            this.alert = {
              show:5,
              variant:"success",
              msg:"Invitation Already accepted"
            }
            this.alreadyAccepted=true;
            this.isValidInvitation = false;
          } else if (!res?.id) {
            this.isValidInvitation = false;
            this.alert = {
              show:5,
              variant:"danger",
              msg:"Invalid Invitation"
            }
          } else if (res?.email) {
            api.invitations.getInvitedUser(res.email).then(res1 => {
              if (res1 && res1.id) {
                this.registeredUserMail = res1.email;
              } else {
                this.registeredUserMail = "";
              }
            })
          }
        }).catch(err => {

        })
        this.inviteId = code
      }
    },
    acceptNetworkInvitation(){
      this.submitted = true;
      this.isSubmitting = true;
      const userData = {
        email: this.registeredUserMail,
        inviteId: this.inviteId,
        type: "network"
      };
      const userEmail = this.userInfo?.email;
      api.invitations.acceptAlreadyRegisteredInvitation(userData)
        .then(() => {
          this.isSubmitting = false;
          // this.showSuccessAlert = true;
          this.isValidInvitation=false;
          if (this.token && userData.email == userEmail) {
            this.$router.push({ path: '/dashboard' });
          } else {
	          localStorage.clear();
            this.$router.push({ path: '/invitation-success' });
          }
        })
        .catch(err => {
          // error message will disappear on focus or on change value
          if (Array.isArray(err.message) && err.message.length > 0) {
            this.alert.msg = err.message.reduce((result, current) => {
              if (!result || !result.length) {
                return `${helpers.capitalizeFirstLetter(current)}`;
              }
              return `${result}. ${helpers.capitalizeFirstLetter(current)}`;
            }, '');
          } else if (typeof err.message === 'string') {
            this.alert.msg = err.message;
          } else {
            this.alert.msg = 'Error accepting invitation.'
          }
          this.isSubmitting = false;
          this.alert.show = 5;
        });
    },
    countDownChanged(dismissCountDown ){
      this.alert.show = dismissCountDown;
    },
    rejectInvitation() {
      const userData = {
        code: this.code,
        username: this.inviteeUser
      }
      api.invitations.rejectInvitation(userData)
        .then(() => {
          this.isSubmitting = false;
          this.showSuccessAlert = true;
          this.isValidInvitation=false;
          if (this.token) {
            this.$router.push({ path: '/dashboard' });
          } else {
            this.alert = {
              show: 5,
              variant: "success",
              msg: "Invitation Rejected"
            }
          }
        })
        .catch(err => {
          // error message will disappear on focus or on change value
          if (Array.isArray(err.message) && err.message.length > 0) {
            this.alert.msg  = err.message.reduce((result, current) => {
              if (!result || !result.length) {
                return `${helpers.capitalizeFirstLetter(current)}`;
              }
              return `${result}. ${helpers.capitalizeFirstLetter(current)}`;
            }, '');
          } else if (typeof err.message === 'string') {
            this.alert.msg  = err.message;
          } else {
            this.alert.msg = 'Error accepting invitation.'
          }
          this.isSubmitting = false;
          this.alert.show = 5;
        })
    },
    onSubmit () {
      if (this.isCurrentInvitationInvalid) {
        return;
      }
      this.acceptNetworkInvitation()
    }
  }
}
</script>

<style scoped lang="scss">
  .alert {
    padding-left: 25px;
    margin-bottom: 35px;
  }
  .alert-dismissible .close {
    padding-right: 25px;
  }
</style>
