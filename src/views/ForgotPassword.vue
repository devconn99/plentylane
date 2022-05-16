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

            <h1 class="title-size3 titleGreenNavyColor">Forgot Password</h1>

            <b-alert
              :show="submitted && showErrorAlert"
              dismissible
              :variant="alertVarient"
            >
              <p>{{errorMsg}}</p>
            </b-alert>

            <b-form class="form" @submit.stop.prevent="onSubmit">
              <b-form-group>
                <b-form-input
                  v-model="$v.form.email.$model"
                  type="email"
                  @focus="focusHandler"
                  @input="resetError"
                  placeholder="Email Address"
                  autocomplete="off"
                ></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.email.email">Please enter valid email address.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.email.$dirty && !$v.form.email.required">This is a required field.</small>
              </b-form-group>
              <b-button type="submit" :disabled="$v.$invalid || submitted" class="btnGreen btnBigSize btn50 text-uppercase hover-slide-left">
                <span>Reset</span>
              </b-button>
            </b-form>
          </div>
        </div>
        <div class="authorization-background green-bg"></div>
      </section>
    </main>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email } from "vuelidate/lib/validators";
import Loading from 'vue-loading-overlay';
import api from '../api';
import config from '../config';
export default {
  name: "Login",
  components: {Loading},
  mixins: [validationMixin],
  data: () => ({
    showErrorAlert: false,
    alertVarient:'',
    submitted: false,
    form: {
      email: '',
    },
    errorMsg: '',
    loaderOptions: { ...config.LOADER_OPTIONS },
    isSubmitting: false
  }),
  validations: {
    form: {
      email: {
        required,
        email
      }
    }
  },
  methods: {
    focusHandler (e) {
      this.resetError();
    },
    resetError () {
      if (this.submitted) {
        this.submitted = false;
      }
      if (this.showErrorAlert) {
        this.showErrorAlert = false;
      }
      if (this.errorMsg.length) {
        this.errorMsg = false;
      }
    },
    onSubmit () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.submitted = true;
      this.isSubmitting = true;
      const userData = {
        email: this.$v.form.$model.email
      };
      api.auth.resetPasswordRequest(userData)
        .then((response) => {
          this.alertVarient='success';
          this.errorMsg = "Reset Email sent successfully!";
          this.showErrorAlert = true;
          this.isSubmitting = false;
        })
        .catch(err => {
          this.alertVarient='danger';
          this.errorMsg = err.message;
          this.showErrorAlert = true;
          this.isSubmitting = false;
        })
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
