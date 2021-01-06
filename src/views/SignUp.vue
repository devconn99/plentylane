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
                            :state="validateState('fullName')"
                    ></b-form-input>
                    <small class="text-danger d-flex mt-2" v-if="$v.form.fullName.$dirty && !$v.form.fullName.required">This is a required field.</small>
                </b-form-group>
                <b-form-group>
                    <b-form-input
                            v-model="$v.form.email.$model"
                            type="email"
                            @focus="focusHandler"
                            @input="resetError"
                            placeholder="Email Address"
                            :state="validateState('email')"
                    ></b-form-input>
                    <small class="text-danger d-flex mt-2" v-if="!$v.form.email.email">Please enter valid email address.</small>
                    <small class="text-danger d-flex mt-2" v-if="$v.form.email.$dirty && !$v.form.email.required">This is a required field.</small>
                </b-form-group>
                <b-form-group>
                    <b-form-input
                            v-model="$v.form.password.$model"
                            type="password"
                            @focus="focusHandler"
                            @input="resetError"
                            placeholder="Password"
                            :state="validateState('password')"
                    ></b-form-input>
                    <small class="text-danger d-flex mt-2" v-if="$v.form.password.$dirty && !$v.form.password.required">This is a required field.</small>
                    <small class="text-danger d-flex mt-2" v-if="!$v.form.password.minLength">This field must be at least {{pwdMinLength}} characters.</small>
                </b-form-group>
                <b-form-group>
                    <b-form-input
                            v-model="$v.form.passwordConfirm.$model"
                            type="password"
                            @focus="focusHandler"
                            @input="resetError"
                            placeholder="Password Confirmation"
                            :state="validateState('passwordConfirm')"
                    ></b-form-input>
                    <small class="text-danger d-flex mt-2" v-if="$v.form.passwordConfirm.$dirty && !$v.form.passwordConfirm.required">This is a required field.</small>
                    <small class="text-danger d-flex mt-2" v-if="!$v.form.passwordConfirm.minLength">This field must be at least {{pwdMinLength}} characters.</small>
                    <small class="text-danger d-flex mt-2" v-if="($v.form.$model.password && $v.form.$model.passwordConfirm) && !$v.form.passwordConfirm.sameAsPassword">Passwords must be identical.</small>
                </b-form-group>
                <b-button type="submit" :disabled="$v.$invalid || submitted" class="mt-4 btn-sign-up">Continue</b-button>
                <small v-if="submitted && errorMsg" class="text-danger d-flex mt-2">{{errorMsg}}</small>
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
const PWD_MIN_LENGTH = 8;
export default {
    name: "SignUp",
    mixins: [validationMixin],
    data: () => ({
        pwdMinLength: PWD_MIN_LENGTH,
        submitted: false,
        form: {
            fullName: '',
            email: '',
            password: '',
            passwordConfirm: ''
        },
        errorMsg: ''
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
                minLength: minLength(PWD_MIN_LENGTH)
            },
            passwordConfirm: {
                required,
                minLength: minLength(PWD_MIN_LENGTH),
                sameAsPassword: sameAs('password')
            }
        }
    },
    methods: {
        validateState(name) {
            const { $dirty, $error } = this.$v.form[name];
            return $dirty ? !$error : null;
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
            const fullName = this.$v.form.$model.fullName;
            const firstName = fullName.split(' ')[0];
            const lastName = fullName.replace(`${firstName} `, '');
            const userData = {
                email: this.$v.form.$model.email,
                password: this.$v.form.$model.password,
                firstName,
                lastName: lastName || ' '
            };
            console.log('\n >> userData > ', userData);
            api.auth.signUp(userData)
                .then((response) => {
                    // TODO: check response
                    this.submitted = false;
                    this.$router.push({ name: 'Login' });
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
