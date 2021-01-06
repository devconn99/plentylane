<template>
    <div class="login-page w-100">
        <div class="col-md-6">
            <p class="text-left">Login</p>
            <b-form @submit.stop.prevent="onSubmit">
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
                    <small class="text-danger d-flex mt-2" v-if="!$v.form.password.minLength">This field must be at least {{pwdMinLength}} characters long.</small>
                </b-form-group>
                <b-button type="submit" :disabled="$v.$invalid || submitted" class="mt-4 btn-login">Login</b-button>
                <small v-if="submitted && errorMsg" class="text-danger d-flex mt-2 text-left">{{errorMsg}}</small>
            </b-form>
            <div class="bottom-info-container text-muted small mt-4 d-flex flex-column align-items-baseline">
                <p>
                    Don't have an account?
                    <router-link to="/sign-up" class="font-weight-bold">Register</router-link>
                </p>
                <p>
                    Forgot your password?
                    <!-- TODO: add route for Reset password page -->
                    <router-link to="/" class="font-weight-bold">Reset it here</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";
import api from '../api';
import config from '../config';
export default {
    name: "Login",
    mixins: [validationMixin],
    data: () => ({
        pwdMinLength: config.PWD_MIN_LENGTH,
        submitted: false,
        form: {
            email: '',
            password: '',
        },
        errorMsg: ''
    }),
    validations: {
        form: {
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(config.PWD_MIN_LENGTH)
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
            const userData = {
                email: this.$v.form.$model.email,
                password: this.$v.form.$model.password
            };
            api.auth.login(userData)
                .then((response) => {
                    console.log('\n >> response > ', response);
                    if (response.accessToken) {
                        localStorage.setItem('plAccessToken', response.accessToken);
                    }
                    this.$router.push({ name: 'Dashboard' });
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.errorMsg = err.message;
                })
        }
    }
}
</script>

<style scoped lang="scss">
@import "../variables.scss";
.login-page {
    margin-top: 50px; // temp
}
.btn-login {
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
