<template>
    <div class="row edit-profile-wrapper">
        <div class="col-12 position-relative">
            <loading
                    :active.sync="isLoading"
                    :is-full-page="loaderOptions.IS_FULL_PAGE"
                    :color="loaderOptions.COLOR"
            ></loading>
            <loading
                    :active.sync="isSubmitting"
                    :is-full-page="loaderOptions.IS_FULL_PAGE"
                    :color="loaderOptions.COLOR"
            ></loading>

            <div class="dashboard-title-box flex-row align-items-center mb-5 mt-2 mt-lg-3">
                <div class="title-size3 titleGreenNavyColor">Edit Profile</div>
            </div>

            <b-form class="form" @submit.stop.prevent="onSubmit">
                <div class="row">
                    <div class="col-12">
                        <b-alert
                                class="mb-4"
                                :show="submitted && showSuccessAlert"
                                dismissible
                                variant="success"
                        >
                            <p>Your profile has been updated successfully.</p>
                        </b-alert>
                        <b-alert
                                class="mb-4"
                                :show="submitted && showErrorAlert"
                                dismissible
                                variant="danger"
                        >
                            <p>{{errorMsg}}</p>
                        </b-alert>
                    </div>

                    <div class="col-lg-6">
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
                            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.phone.$dirty && !$v.form.phone.required">This is a required field.</small>
                            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.phone.$dirty && $v.form.phone && !$v.form.phone.isValidPhone">Please enter valid phone.</small>
                        </b-form-group>
                    </div>

                    <div class="col-lg-6 col-xl-5 ml-auto">
                        <!-- TODO: use vue-bootstrap b-form-file component instead or use vue-dropzone -->
                        <div class="form-group">
                            <label for="">Profile image</label>
                            <div class="profile-img">
                                <img
                                        src="../../assets/images/data/images/avatars/avatar.jpg"
                                        alt="Profile Image"
                                        class="img-fluid"
                                />
                                <!-- TODO: get back to it later -->
                                <!--
                                <i
                                        v-if="!prevAvatarUrl.length && !avatarUrlTemp.length"
                                        class="fas fa-user-circle user-icon-placeholder"
                                ></i>
                                <img v-show="avatarUrlTemp && avatarUrlTemp.length" :src="avatarUrlTemp" />

                                <input
                                        class="d-none"
                                        ref="fileInput"
                                        type="file"
                                        accept=".png, .jpg, .jpeg"
                                        @change="onFileChange"
                                />
                                -->
                            </div>
                            <div class="box-btn mt-3 text-center">
                                <b-btn
                                        class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mb-3"
                                        @click="triggerSelectNewAvatar"
                                >
                                    <span>Upload image</span>
                                </b-btn>
                                <p class="cursor-pointer delete-image-trigger" @click="deleteImage">Delete Image</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <b-form-group label="Bio">
                        <textarea
                                name="bio"
                                v-model="$v.form.bio.$model"
                                placeholder="Bio"
                                @focus="focusHandler"
                                @input="hideAlerts"
                                autocomplete="off"
                        ></textarea>
                        </b-form-group>
                    </div>

                    <div class="col-lg-6 col-xl-5 ml-auto">
                        <div class="btn-box">
                            <b-btn
                                    type="submit"
                                    class="btnGreen btnNormalSize btn100 hover-slide-left"
                                    :disabled="$v.$invalid || submitted"
                            >
                                <span>Save Changes</span>
                            </b-btn>
                        </div>
                    </div>
                </div>
            </b-form>
        </div>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import Loading from 'vue-loading-overlay';
import api from '../../api';
import parsePhoneNumberWithError from 'libphonenumber-js';
import helpers from '../../helpers';
import config from "../../config";
export default {
    name: "EditProfile",
    mixins: [validationMixin],
    components: {Loading},
    data: () => ({
        isLoading: false,
        loaderOptions: { ...config.LOADER_OPTIONS },
        form: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            bio: ''
        },
        showSuccessAlert: false,
        showErrorAlert: false,
        errorMsg: '',
        submitted: false,
        userInfo: null,
        prevAvatarUrl: '', // TODO
        avatarUrlTemp: '',
        isSubmitting: false
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
            lastName: {
                required
            },
            phone: {
                required,
                isValidPhone(value) {
                    if (!value) return true;
                    if (new RegExp('[a-zA-Z]', 'g').test(value)) {
                        return false;
                    }
                    try {
                        const _phoneNumber = parsePhoneNumberWithError(value, 'US');
                        return _phoneNumber.isValid();
                    } catch (error) {
                        return false
                    }
                }
            },
            bio: {}
        }
    },
    created () {
        // temp
        this.isLoading = true;
        const user = { ...this.$store.getters.userInfo };
        if (!user || !user.email || !user.id) {
            this.loadUserInfo();
        } else {
            this.userInfo = { ...user };
            this.setFormValues(user);
            this.isLoading = false;
        }
    },
    methods: {
        setFormValues (data) {
            this.$v.form.$model.firstName = data.firstName;
            this.$v.form.$model.lastName = data.lastName;
            this.$v.form.$model.email = data.email;
            this.$v.form.$model.phone = data.phone;
            this.$v.form.$model.bio = data.bio;
            // TODO: set this.prevAvatarUrl if exists
        },
        loadUserInfo () {
            this.isLoading = true;
            api.dashboard.userInfo()
                .then((data) => {
                    this.userInfo = { ...data };
                    this.$store.commit('userInfo', { ...data });
                    this.setFormValues(data);
                    this.isLoading = false;
                })
                .catch((err) => {
                    this.isLoading = false;
                });
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
            this.$v.form.$touch();
            if (this.$v.form.$invalid) {
                return;
            }
            this.submitted = true;
            this.isSubmitting = true;
            if (this.form.phone) {
                try {
                    const _phoneNumber = parsePhoneNumberWithError(this.form.phone, 'US');
                    if (_phoneNumber) {
                        this.form.phone = _phoneNumber.nationalNumber;
                    }
                } catch (error) {}
            }
            api.dashboard.updateProfile(this.form)
                .then(response => {
                    this.$store.commit('userInfo', { ...response });
                    this.showSuccessAlert = true;
                    this.isSubmitting = false;
                })
                .catch(err => {
                    console.log('\nerr update profile:', err);
                    const errMessages = err.data.message || err.message;
                    if (Array.isArray(errMessages) && errMessages.length > 0) {
                        this.errorMsg = errMessages.reduce((result, current) => {
                            if (!result || !result.length) {
                                return `${helpers.capitalizeFirstLetter(current)}`;
                            }
                            return `${result}. ${helpers.capitalizeFirstLetter(current)}`;
                        }, '');
                    } else {
                        this.errorMsg = errMessages || 'Error saving changes.';
                    }
                    this.showErrorAlert = true;
                    this.isSubmitting = false;
                })
        },
        triggerSelectNewAvatar () {
            // TODO: get back to it later
            // this.$refs.fileInput.click();
        },
        deleteImage () {
            // TODO: get back to it later
            /*
            this.prevAvatarUrl = '';
            this.avatarUrlTemp = '';
            this.$refs.fileInput.value = null;
            */
        },
        onFileChange (e) {
            // TODO: get back to it later
            /*
            const file = e.target.files[0];
            const _url = URL.createObjectURL(file);
            if (_url && _url.length) {
                this.avatarUrlTemp = _url;
                this.prevAvatarUrl = '';
            }
            */
        }
    }
}
</script>

<style lang="scss">
@import "../../scss/utils/vars";
.edit-profile-wrapper {
    .form-group {
        legend {
            font-weight: bold;
        }

        .delete-image-trigger {
            text-decoration: underline;
            color: $greenColor;
            font-family: $FilsonProBold;
            font-size: 16px;
            letter-spacing: 0;
            line-height: 24px;
            user-select: none;

            &:hover {
                text-decoration: none;
                color: $greenColor;
            }
        }
    }
}
</style>
