<template>
    <div class="sign-up-page w-100">
        <div class="col-md-6">
            <p>Register for Plenty Lane</p>
            <b-form @submit.stop.prevent="onSubmit">
                <b-form-group>
                    <b-form-input
                            name="fullName"
                            v-model="$v.form.fullName.$model"
                            @focus="focusHandler"
                            @input="resetError"
                            placeholder="Full Name"
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
                    <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.password.isValidPwd">This field must be at least {{pwdMinLength}} characters long with one capital letter and one digit.</small>
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
                    <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.passwordConfirm.isValidPwd">This field must be at least {{pwdMinLength}} characters long with one capital letter and one digit.</small>
                    <small class="text-danger d-flex mt-2 text-left" v-if="($v.form.$model.password && $v.form.$model.passwordConfirm) && !$v.form.passwordConfirm.sameAsPassword">Passwords must be identical.</small>
                </b-form-group>
                <b-button type="submit" :disabled="$v.$invalid || submitted" class="mt-4 btn-sign-up">Continue</b-button>
                <small v-if="submitted && errorMsg" class="text-danger d-flex mt-2 text-left">{{errorMsg}}</small>
                <small v-if="submitted && isSignUpSuccess" class="text-success d-flex mt-2 text-left">
                    You've been registered successfully. Please use your email and password to login
                </small>
            </b-form>
            <div class="bottom-info-container text-muted small mt-4 d-flex flex-column align-items-baseline">
                <p>
                    By signing up you agree to our
                    <a href="https://www.plentylane.com/" class="font-weight-bold" target="_blank">Privacy</a> and
                    <a href="https://www.plentylane.com/" class="font-weight-bold" target="_blank">Terms policies</a>.
                </p>
                <p>
                    Already have an account?
                    <router-link to="/login" class="font-weight-bold">Login here</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs, email } from "vuelidate/lib/validators";
import api from '../api';
import config from '../config';
export default {
    name: "SignUp",
    mixins: [validationMixin],
    data: () => ({
        pwdMinLength: config.PWD_MIN_LENGTH,
        submitted: false,
        form: {
            fullName: '',
            email: '',
            password: '',
            passwordConfirm: ''
        },
        errorMsg: '',
        isSignUpSuccess: false
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
                isValidPwd(value) {
                    return this.isValidPassword(value);
                }
            },
            passwordConfirm: {
                required,
                minLength: minLength(config.PWD_MIN_LENGTH),
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
        capitalizeFirstLetter(string) {
            return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
        },
        resetError () {
            if (this.submitted) {
                this.submitted = false;
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
                    this.isSignUpSuccess = true; // to show success message -> temp solution
                    setTimeout(() => {
                        this.$router.push({ name: 'Login' });
                    }, 3000);
                })
                .catch(err => {
                    // error message will disappear on focus or on change value
                    if (err.statusCode === '409') {
                        this.errorMsg = err.message;
                    } else if (Array.isArray(err.message) && err.message.length > 0) {
                        this.errorMsg = err.message.reduce((result, current) => {
                            if (!result || !result.length) {
                                return `${this.capitalizeFirstLetter(current)}`;
                            }
                            return `${result}. ${this.capitalizeFirstLetter(current)}`;
                        }, '');
                    }
                })
        },
        // save it for later
        resetForm() {
            this.form = {
                fullName: null,
                email: null,
                password: null,
                passwordConfirm: null
            };

            this.$nextTick(() => {
                this.$v.$reset();
            });
        }
    }
}
</script>

<style scoped lang="scss">
@import "../variables.scss";
.sign-up-page {
    margin-top: 50px; // temp
}
.btn-sign-up {
    border-radius: 0;
    background-color: $navbar-bg;
    border-color: $navbar-bg;
    font-weight: bold;
    display: block;
}
.bottom-info-container {
    a {
        color: $navbar-bg;
    }
}
</style>
