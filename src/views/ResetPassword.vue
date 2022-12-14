<template>
  <div id="authorization-page">
    <header class="header">
      <div class="container">
        <div class="header-box">
          <div class="logo-block">
            <router-link to="/">
              <img
                src="../assets/images/logo/logo_green.svg"
                alt=""
                class="img-fluid"
              />
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

            <h1 class="title-size3 titleGreenNavyColor">Reset Password</h1>

            <b-alert
              :show="submitted && showErrorAlert"
              dismissible
              :variant="alertVarient"
              @dismissed="goToLogin"
            >
              <p>{{ errorMsg }}</p>
            </b-alert>

            <b-form class="form" @submit.stop.prevent="onSubmit">
              <b-form-group>
                <b-form-input
                  v-model="$v.form.password.$model"
                  type="password"
                  @focus="focusHandler"
                  @input="resetError"
                  placeholder="Password"
                  autocomplete="off"
                ></b-form-input>
                <small
                  class="text-danger d-flex mt-2 text-left"
                  v-if="$v.form.password.$dirty && !$v.form.password.required"
                  >This is a required field.</small
                >
                <small
                  class="text-danger d-flex mt-2"
                  v-if="!$v.form.password.minLength"
                  >This field must be at least {{ pwdMinLength }} characters
                  long.</small
                >
                <small
                  class="text-danger d-flex mt-2 text-left"
                  v-if="!$v.form.password.maxLength"
                >
                  This field must be shorter than or equal to
                  {{ pwdMaxLength }} characters.
                </small>
              </b-form-group>
              <b-form-group>
                <b-form-input
                  v-model="$v.form.passwordConfirm.$model"
                  type="password"
                  @focus="focusHandler"
                  @input="resetError"
                  placeholder="Password Confirmation"
                ></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.passwordConfirm.$dirty && !$v.form.passwordConfirm.required">This is a required field.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.passwordConfirm.maxLength">This field must be shorter than or equal to {{pwdMaxLength}} characters.</small>
                <small class="text-danger d-flex mt-2 text-left" v-else-if="!$v.form.passwordConfirm.isValidPwd">This field must be at least {{pwdMinLength}} characters long with one capital letter and one digit.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="($v.form.$model.password && $v.form.$model.passwordConfirm && $v.form.passwordConfirm.isValidPwd && $v.form.passwordConfirm.maxLength) && !$v.form.passwordConfirm.sameAsPassword">Passwords must be identical.</small>
              </b-form-group>
              <b-button
                type="submit"
                :disabled="$v.$invalid || submitted"
                class="
                  btnGreen
                  btnBigSize
                  btn50
                  text-uppercase
                  hover-slide-left
                "
              >
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
import { required, minLength, maxLength, sameAs } from "vuelidate/lib/validators";
import Loading from 'vue-loading-overlay';
import api from '../api';
import config from '../config';
export default {
  name: "ResetPassword",
  components: {Loading},
  mixins: [validationMixin],
  data: () => ({
    showErrorAlert: false,
    pwdMinLength: config.PWD_MIN_LENGTH,
    pwdMaxLength: config.PWD_MAX_LENGTH,
    submitted: false,
    form: {
      password: '',
      passwordConfirm:''
    },
    alertVarient:"",
    errorMsg: '',
    loaderOptions: { ...config.LOADER_OPTIONS },
    isSubmitting: false
  }),
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(config.PWD_MIN_LENGTH),
        maxLength: maxLength(config.PWD_MAX_LENGTH),
        isValidPwd(value) {
          return this.isValidPassword(value);
        },
      },
      passwordConfirm: {
        required,
        minLength: minLength(config.PWD_MIN_LENGTH),
        maxLength: maxLength(config.PWD_MAX_LENGTH),
        isValidPwd(value) {
          return this.isValidPassword(value);
        },
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    isValidPassword (value) {
      if (value === '') return true;
      return new RegExp(`^(?=.*\\d)(?=.*[A-Z]).{${config.PWD_MIN_LENGTH},}$`, 'g').test(value);
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
    focusHandler (e) {
      this.resetError();
    },
    goToLogin(){
      this.$router.push({ path: '/login' });
      this.showErrorAlert = false;
    },
    onSubmit () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.submitted = true;
      this.isSubmitting = true;
      const {id, token}=this.$route.query;
      const userData = {
        password: this.$v.form.$model.password,
        userId:id,
        token
      };
      api.auth.resetPassword(userData)
        .then((response) => {
          this.isSubmitting = false;
          this.errorMsg = "Password successfully changed";
          this.alertVarient="success";
          this.showErrorAlert = true;
          setTimeout(() => {
            this.goToLogin();
          }, 3000);
          
        })
        .catch(err => {
          console.log('\n >> err > ', err);
          this.errorMsg = err.message;
          this.alertVarient="danger";
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
