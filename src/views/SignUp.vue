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
                        ></loading>

                        <h1 class="title-size3 titleGreenNavyColor">Register for Plenty Lane</h1>

                        <b-alert
                                :show="submitted && showSuccessAlert"
                                dismissible
                                variant="success"
                        >
                            <p>You've been registered successfully. Please use your email and password to login.</p>
                        </b-alert>
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
                                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.fullName.$dirty && !$v.form.fullName.required">This is a required field.</small>
                            </b-form-group>
                            <b-form-group>
                                <b-form-input
                                        v-model="$v.form.email.$model"
                                        type="email"
                                        @focus="focusHandler"
                                        @input="resetError"
                                        placeholder="Email Address"
                                ></b-form-input>
                                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.email.email">Please enter valid email address.</small>
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
                            <p>
                                By signing up you agree to our
                                <a href="https://www.plentylane.com/" target="_blank">Privacy</a> and
                                <a href="https://www.plentylane.com/" target="_blank">Terms policies</a>.
                            <p>
                                Already have an account?
                                <router-link to="/login">Login here</router-link>
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
import { required, minLength, maxLength, sameAs, email } from "vuelidate/lib/validators";
import api from '../api';
import config from '../config';
import helpers from '../helpers';
import Loading from 'vue-loading-overlay';
export default {
    name: "SignUp",
    components: {Loading},
    mixins: [validationMixin],
    data: () => ({
        showSuccessAlert: false,
        showErrorAlert: false,
        pwdMinLength: config.PWD_MIN_LENGTH,
        pwdMaxLength: config.PWD_MAX_LENGTH,
        submitted: false,
        form: {
            fullName: '',
            email: '',
            password: '',
            passwordConfirm: ''
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
    methods: {
        isValidPassword (value) {
            if (value === '') return true;
            return new RegExp(`^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{${config.PWD_MIN_LENGTH},}$`, 'g').test(value);
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
            const fullName = this.$v.form.$model.fullName.trim();
            const firstName = fullName.split(' ')[0];
            const lastName = fullName.replace(`${firstName} `, '');
            const userData = {
                email: this.$v.form.$model.email,
                password: this.$v.form.$model.password,
                firstName,
                lastName: lastName || ' '
            };
            api.auth.signUp(userData)
                .then(() => {
                    this.isSubmitting = false;
                    this.showSuccessAlert = true;
                    setTimeout(() => {
                        this.$router.push({ path: '/login' });
                    }, 3000);
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
                })
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
</style>
