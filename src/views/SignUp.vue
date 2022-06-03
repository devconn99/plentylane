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

            <h1 class="title-size3 titleGreenNavyColor">Register for Plenty Lane</h1>

            <!-- <b-alert
              :show="submitted && showSuccessAlert"
              dismissible
              variant="success"
            >
              <p>You've been registered successfully. Please use your email and password to login.</p>
            </b-alert> -->
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
                  name="fullName"
                  v-model="$v.form.fullName.$model"
                  @focus="focusHandler"
                  @input="resetError"
                  placeholder="Full Name"
                  autocomplete="off"
                ></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.fullName.$dirty && !$v.form.fullName.required">
                  This is a required field.
                </small>
              </b-form-group>
              <b-form-group>
                <b-form-input
                  v-model="$v.form.email.$model"
                  type="email"
                  @focus="focusHandler"
                  @input="resetError"
                  placeholder="Email Address"
                ></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.email.email">
                  Please enter valid email address.
                </small>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.email.$dirty && !$v.form.email.required">
                  This is a required field.
                </small>
              </b-form-group>
              <b-form-group>
                <b-form-input
                  v-model="$v.form.phoneNumber.$model"
                  @focus="focusHandler"
                  @input="resetError"
                  placeholder="Phone 000-000-0000"
                ></b-form-input>
                <small class="text-notification d-flex mt-2 text-left">We wan't share your contact information.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.phoneNumber.$dirty && !$v.form.phoneNumber.required">This is a required field.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.phoneNumber.isValidPhoneNumber">Please enter valid phone number.</small>
              </b-form-group>
              <b-form-group>
                <b-form-input
                  v-model.trim="$v.form.username.$model"
                  type="text"
                  @focus="focusHandler"
                  @input="resetError"
                  placeholder="User Name"
                ></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.username.$dirty && !$v.form.username.required">This is a required field.</small>
                <small class="text-danger d-flex mt-2" v-if="!$v.form.username.minLength">This field must be at least {{userNameMinLength}} characters long.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.username.maxLength">This field must be shorter than or equal to {{userNameMaxLength}} characters.</small>
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
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.password.maxLength">This field must be shorter than or equal to {{pwdMaxLength}} characters.</small>
                <small class="text-danger d-flex mt-2 text-left" v-else-if="!$v.form.password.isValidPwd">This field must be at least {{pwdMinLength}} characters long with one uppercase letter, one lowercase letter, and one number.</small>
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
              <b-button type="submit" :disabled="$v.$invalid || submitted" class="btnGreen btnBigSize btn50 text-uppercase hover-slide-left">
                <span>Continue</span>
              </b-button>
            </b-form>

            <div class="authorization-box-info">
              <div>
                <p>
                  By signing up you agree to our
                  <router-link to="/privacy">Privacy</router-link> and
                  <router-link to="/terms">Terms policies</router-link>.
                </p>
                <p>
                  Already have an account?
                  <router-link to="/login">Login here</router-link>
                </p>
              </div>
              <div class="gift-section">
                <div class="d-flex align-items-center mb-3">
                  <SvgIcon icon="gift" params="{ fill: #C54579 }" />
                  <h4 class="text-notification pt-2 pl-3">
                    Getting Plenty Lane as a gift?
                  </h4>
                </div>
                <span>
                  If this is a gift, register for the <strong>recipient</strong>, not yourself.
                  You will have an opportunity to write a gift message.
                </span>
              </div>
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
import { required, minLength, maxLength, sameAs, email } from "vuelidate/lib/validators";
import Loading from 'vue-loading-overlay';
import SvgIcon from '../components/SvgIcon';
import api from '../api';
import config from '../config';
import helpers from '../helpers';
export default {
  name: "SignUp",
  components: {Loading, SvgIcon},
  mixins: [validationMixin],
  data: () => ({
    // showSuccessAlert: false,
    showErrorAlert: false,
    pwdMinLength: config.PWD_MIN_LENGTH,
    pwdMaxLength: config.PWD_MAX_LENGTH,
    userNameMinLength: config.USER_NAME_MIN_LENGTH,
    userNameMaxLength: config.USER_NAME_MAX_LENGTH,
    submitted: false,
    form: {
      fullName: '',
      email: '',
      phoneNumber: '',
      username: '',
      password: '',
      passwordConfirm: '',
      inviteId: ''
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
      },
      fullName: {
        required
      },
      phoneNumber: {
        required,
        isValidPhoneNumber(value) {
          if (value === '') return true;
          return /^[2-9]\d{2}-[2-9]\d{2}-\d{4}$/.test(value);
        }
      },
      username: {
        required,
        minLength: minLength(config.USER_NAME_MIN_LENGTH),
        maxLength: maxLength(config.USER_NAME_MAX_LENGTH)
      },
      password: {
        required,
        minLength: minLength(config.PWD_MIN_LENGTH),
        maxLength: maxLength(config.PWD_MAX_LENGTH),
        isValidPwd(value) {
          return this.isValidPassword(value);
        }
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
  mounted() {
    this.manipulateInvitation()
  },
  methods: {
    manipulateInvitation() {
      const code = this.$route.query.code;
      if (code) {
        this.form.inviteId = code
      }
    },
    isValidPassword (value) {
      if (value === '') return true;
      return new RegExp(`^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{${config.PWD_MIN_LENGTH},}$`, 'g').test(value);
    },
    resetError() {
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
    focusHandler(e) {
      this.resetError();
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.submitted = true;
      this.isSubmitting = true;
      const fullName = this.$v.form.$model.fullName.trim();
      const firstName = fullName.split(' ')[0];
      const lastName = fullName.replace(`${firstName} `, '');
      const userData = {
        email: this.$v.form.$model.email,
        password: this.$v.form.$model.password,
        firstName,
        lastName: lastName || ' ',
        username: this.$v.form.$model.username,
        phone: this.$v.form.$model.phoneNumber,
        inviteId: this.form.inviteId,
        role: "normal",
      };
      api.auth.signUp(userData)
        .then(() => {
          this.isSubmitting = false;
          // this.showSuccessAlert = true;
          this.$router.push({ path: '/sign-up-success' });
        })
        .catch(err => {
          // error message will disappear on focus or on change value
          if (Array.isArray(err.message) && err.message.length > 0) {
            this.errorMsg = err.message.reduce((result, current) => {
              if (!result || !result.length) {
                return `${helpers.capitalizeFirstLetter(current)}`;
              }
              return `${result}. ${helpers.capitalizeFirstLetter(current)}`;
            }, '');
          } else if (typeof err.message === 'string') {
            this.errorMsg = err.message;
          } else {
            this.errorMsg = 'Error during registration.'
          }
          this.isSubmitting = false;
          this.showErrorAlert = true;
        });
    }
  }
}
</script>

<style scoped lang="scss">
  .btn-sign-up {
    padding-left: 60px;
    padding-right: 60px;
  }
  .alert {
    padding-left: 25px;
    margin-bottom: 35px;
  }
  .alert-dismissible .close {
    padding-right: 25px;
  }
  .gift-section {
    margin-top: 50px;
  }
  .text-notification {
    color: #194F5A;
  }
</style>
