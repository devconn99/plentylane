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

            <h1 class="title-size3 titleGreenNavyColor">Login</h1>

            <b-alert
              :show="submitted && showErrorAlert"
              dismissible
              variant="danger"
            >
              <p>{{errorMsg}}</p>
            </b-alert>

            <b-form class="form" @submit.stop.prevent="onSubmit">
              <b-form-group>
                <b-form-input
                  v-model="$v.form.email.$model"
                  @focus="focusHandler"
                  @input="resetError"
                  placeholder="Email/Username"
                ></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.email.email">Please enter valid email/username.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.email.$dirty && !$v.form.email.required">This is a required field.</small>
              </b-form-group>
              <b-form-group>
                <b-form-input
                  v-model="$v.form.password.$model"
                  type="password"
                  @focus="focusHandler"
                  @input="resetError"
                  placeholder="Password"
                ></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.password.$dirty && !$v.form.password.required">This is a required field.</small>
                <small class="text-danger d-flex mt-2" v-if="!$v.form.password.minLength">This field must be at least {{pwdMinLength}} characters long.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.password.maxLength">
                  This field must be shorter than or equal to {{pwdMaxLength}} characters.
                </small>
              </b-form-group>
              <b-button type="submit" :disabled="$v.$invalid || submitted" class="btnGreen btnBigSize btn50 text-uppercase hover-slide-left">
                <span>Login</span>
              </b-button>
            </b-form>

            <div class="authorization-box-info">
              <p>
                Don't have an account?
                <router-link to="/sign-up">Register</router-link>
              </p>
              <p>
                Forgot your password?
                <!-- TODO: add router and view for "Reset password page" -->
                <router-link to="/forgot-password">Reset it here</router-link>
              </p>
            </div>
          </div>
        </div>
        <div class="authorization-background green-bg"></div>
      </section>
    </main>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email,requiredIf } from "vuelidate/lib/validators";
import Loading from 'vue-loading-overlay';
import api from '../api';
import config from '../config';

export default {
  name: "Login",
  components: {Loading},
  mixins: [validationMixin],
  data: () => ({
    showErrorAlert: false,
    pwdMinLength: config.PWD_MIN_LENGTH,
    pwdMaxLength: config.PWD_MAX_LENGTH,
    submitted: false,
    form: {
      email: '',
      password: '',
    },
    errorMsg: '',
    loaderOptions: { ...config.LOADER_OPTIONS },
    isSubmitting: false
  }),
  validations: {
    form: {
      email: {
        required,
        email: function (email) {
          return (email)
            ? email.includes("@")
              ? !!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)
              : !email.includes(" ")
            : true;
        }
      },
      password: {
        required,
        minLength: minLength(config.PWD_MIN_LENGTH),
        maxLength: maxLength(config.PWD_MAX_LENGTH)
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
    onSubmit () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.submitted = true;
      this.isSubmitting = true;
      const userData = {
        email: this.$v.form.$model.email,
        password: this.$v.form.$model.password
      };
      api.auth.login(userData)
        .then((response) => {
          if (response.accessToken) {
            localStorage.setItem('plAccessToken', response.accessToken);
          }
          api.dashboard.profile.userInfo()
            .then((data) => {
              this.$store.commit('userInfo', { ...data });
              localStorage.setItem('plUserId', data.id);
              localStorage.setItem("role",data.role)
              this.isSubmitting = false;
              if(data.stripeCheckoutId != null) {
                this.$router.push({ path: '/dashboard' });
              } else {
                this.$router.push('/choose-plan' );
              }
            })
            .catch((err) => {
              this.isSubmitting = false;
              this.$router.push({ path: '/dashboard' });
            });
        })
        .catch(err => {
          console.log('\n >> err > ', err);
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
