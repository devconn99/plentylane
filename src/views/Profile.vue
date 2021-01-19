<template>
    <div class="profile-page">
        <b-tabs pills card vertical>
            <b-tab active>
                <template #title>
                    <p>Edit Profile</p>
                </template>
                <h1 class="title-size3 titleGreenNavyColor mb-4">Edit Profile</h1>
                <b-alert
                        :show="submitted && showSuccessAlert"
                        dismissible
                        variant="success"
                >
                    <p>Your profile has been updated successfully.</p>
                </b-alert>
                <b-alert
                        :show="submitted && showErrorAlert"
                        dismissible
                        variant="danger"
                >
                    <p>{{errorMsg}}</p>
                </b-alert>

                <b-form class="form" @submit.stop.prevent="onSubmit">
                    <b-form-group label="First Name">
                        <b-form-input
                                name="firstName"
                                v-model="$v.form.firstName.$model"
                                placeholder="First Name"
                                @focus="focusHandler"
                                @input="hideAlerts"
                                autocomplete="off"
                        ></b-form-input>
                        <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.firstName.$dirty && !$v.form.firstName.required">This is a required field.</small>
                    </b-form-group>
                    <b-form-group label="Last Name">
                        <b-form-input
                                name="lastName"
                                v-model="$v.form.lastName.$model"
                                placeholder="Last Name"
                                @focus="focusHandler"
                                @input="hideAlerts"
                                autocomplete="off"
                        ></b-form-input>
                        <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.lastName.$dirty && !$v.form.lastName.required">This is a required field.</small>
                    </b-form-group>
                    <b-form-group label="Email">
                        <b-form-input
                                v-model="$v.form.email.$model"
                                type="email"
                                @focus="focusHandler"
                                @input="hideAlerts"
                                placeholder="Email Address"
                        ></b-form-input>
                        <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.email.email">Please enter valid email address.</small>
                        <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.email.$dirty && !$v.form.email.required">This is a required field.</small>
                    </b-form-group>
                    <b-form-group label="Phone">
                        <b-form-input
                                name="phone"
                                v-model="$v.form.phone.$model"
                                placeholder="Phone"
                                @focus="focusHandler"
                                @input="hideAlerts"
                                autocomplete="off"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Bio">
                        <b-form-textarea
                                name="bio"
                                v-model="$v.form.bio.$model"
                                placeholder="Bio"
                                @focus="focusHandler"
                                @input="hideAlerts"
                                autocomplete="off"
                        ></b-form-textarea>
                    </b-form-group>
                    <b-button
                            type="submit"
                            :disabled="$v.$invalid || submitted"
                            class="main-btn btn-green btn-sign-up hover-slide-left float-right">
                        <span>Save Changes</span>
                    </b-button>
                </b-form>
            </b-tab>
            <template #tabs-start>
                <li role="presentation" class="nav-item tabs-title">Profile</li>
            </template>
            <template #tabs-end>
                <li role="presentation" class="nav-item" @click="logout">Logout</li>
            </template>
        </b-tabs>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import api from '../api';
export default {
    name: "Profile",
    mixins: [validationMixin],
    data: () => ({
        showSuccessAlert: false,
        showErrorAlert: false,
        errorMsg: '',
        submitted: false,
        userInfo: null,
        form: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            bio: ''
        }
    }),
    validations: {
        form: {
            email: {
                required,
                email
            },
            firstName: {
                required
            },
            lastName: {},
            phone: {},
            bio: {}
        }
    },
    created () {
        const user = { ...this.$store.getters.userInfo };
        if (!user || !user.email || !user.id) {
            this.loadUserInfo();
        } else {
            this.userInfo = { ...user };
            this.setFormValues(user);
        }
    },
    methods: {
        setFormValues (data) {
            this.$v.form.$model.firstName = data.firstName;
            this.$v.form.$model.lastName = data.lastName;
            this.$v.form.$model.email = data.email;
            this.$v.form.$model.phone = data.phone;
            this.$v.form.$model.bio = data.bio;
        },
        loadUserInfo () {
            api.dashboard.userInfo()
                .then((data) => {
                    this.userInfo = { ...data };
                    this.$store.commit('userInfo', { ...data });
                    this.setFormValues(data);
                })
                .catch((err) => {});
        },
        hideAlerts () {
            if (this.showSuccessAlert) {
                this.showSuccessAlert = false;
            }
            if (this.showErrorAlert) {
                this.showErrorAlert = false;
                this.errorMsg = '';
            }
            if (this.submitted) {
                this.submitted = false;
            }
        },
        focusHandler (e) {
            this.hideAlerts();
        },
        onSubmit () {
            this.submitted = true;
            api.dashboard.updateProfile(this.form)
                .then(response => {
                    this.$store.commit('userInfo', { ...response });
                    this.showSuccessAlert = true;
                })
                .catch(err => {
                    // TODO: temp parsing errors
                    const errMessages = err.data.message || err.message;
                    if (Array.isArray(errMessages) && errMessages.length > 0) {
                        this.errorMsg = errMessages.reduce((result, current) => {
                            if (!result || !result.length) {
                                return current;
                            }
                            return `${result}; ${current}`;
                        }, '');
                    } else {
                        this.errorMsg = errMessages || 'Error saving changes.';
                    }
                    this.showErrorAlert = true;

                })
        },
        logout () {
            // TODO: prepare custom template for this dialog later
            this.$bvModal.msgBoxConfirm('Are you sure you want to logout?')
                .then(value => {
                    if (value) {
                        localStorage.removeItem('plAccessToken');
                        this.$store.commit('reset');
                        this.$router.push({path: '/login'});
                    }
                })
                .catch(err => {})
        }
    }
}
</script>

<style lang="scss">
@import "../scss/utils/vars";
.profile-page {
    .tabs {
        .tabs-title {
            color: $textBlackColor;
            font-family: $LHFAmericanSans;
            font-size: 36px;
            letter-spacing: 0;
            line-height: 56px;
            margin-bottom: 40px;
        }
        .nav.nav-pills {
            padding: 40px;
            background-color: transparent;
            border-right: 1px solid #FEF8E6;
            box-shadow: 2px 0 0 0 rgba(24,24,22,0.07);

            .nav-item {
                &:not(.tabs-title), .nav-link.active p {
                    cursor: pointer;
                    font-family: $LacaProSemiBold;
                    font-size: 24px;
                    letter-spacing: 0;
                    line-height: 24px;
                    margin-bottom: 10px;
                }
                &:not(.tabs-title) {
                    color: $textBlackColor;
                }
            }

            .nav-link.active, .show>.nav-link {
                background-color: transparent;
                padding-left: 0;
                color: $greenColor;
            }
        }
        .tab-content {
            padding: 40px;

            .form-group {
                legend {
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
