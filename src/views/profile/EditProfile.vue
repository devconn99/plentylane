<template>
    <div class="row edit-profile-wrapper">
        <div class="col-12 position-relative edit-profile-wrapper-col">
            <loading
                    :active.sync="isLoading"
                    :is-full-page="loaderOptions.IS_FULL_PAGE"
                    :color="loaderOptions.COLOR"
                    :background-color="loaderOptions.BACKGROUND_COLOR"
            ></loading>
            <loading
                    :active.sync="isSubmitting"
                    :is-full-page="loaderOptions.IS_FULL_PAGE"
                    :color="loaderOptions.COLOR"
                    :background-color="loaderOptions.BACKGROUND_COLOR"
            ></loading>

            <div class="dashboard-title-box flex-row align-items-center mb-4 mb-lg-5 mt-2 mt-lg-3">
                <div class="dashboard-profile-title-back mr-2 mr-md-3">
                    <div class="cursor-pointer" @click="showMobileAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                    </div>
                </div>
                <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">Edit Profile</div>
            </div>

            <b-form class="form" @submit.stop.prevent="onSubmit" v-if="!isLoading">
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
                        <b-form-group class="notifications-form-group">
                            <b-form-checkbox switch v-model="$v.form.receiveNotifications.$model">
                                <span class="switch-text">Notifications are {{$v.form.receiveNotifications.$model ? 'On' : 'Off'}}</span>
                            </b-form-checkbox>
                        </b-form-group>
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
                        <div class="form-group">
                            <label class="mb-0" for="profile_photo_input">Profile Image</label>
                            <div
                                    class="profile-img"
                                    v-bind:class="{ 'no-image': !profilePhotoUrl || !profilePhotoUrl.length }"
                            >
                                <template v-show="profilePhotoUrl && profilePhotoUrl.length">
                                    <img :src="profilePhotoUrl" ref="userPhoto" alt="Profile Image" class="img-fluid" />
                                </template>
                            </div>
                            <input
                                    id="profile_photo_input"
                                    class="d-none"
                                    ref="fileInput"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    @change="onFileChange"
                            />
                            <div class="box-btn mt-3 text-center">
                                <b-btn
                                        class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mb-3"
                                        ref="triggerSelectFileBtn"
                                        @click="triggerSelectNewAvatar"
                                >
                                    <span>Upload Image</span>
                                </b-btn>
                                <p
                                        v-if="hasOriginalImage()"
                                        class="cursor-pointer delete-image-trigger"
                                        @click="showConfirmRemovePhotoModal"
                                >Delete Image</p>
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

        <!-- Modals -->
        <ConfirmModal :id="modalId" :message="confirmRemovePhotoMsg" @confirmed="deleteImage"></ConfirmModal>
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
import SvgIcon from '../../components/SvgIcon';
import ConfirmModal from '../../components/modals/ConfirmModal';
export default {
    name: "EditProfile",
    mixins: [validationMixin],
    components: {Loading, SvgIcon, ConfirmModal},
    data: () => ({
        isLoading: false,
        modalId: 'confirm-remove-user-photo',
        confirmRemovePhotoMsg: 'Are you sure you want to remove profile photo?',
        loaderOptions: { ...config.LOADER_OPTIONS },
        form: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            bio: '',
            receiveNotifications: null
        },
        showSuccessAlert: false,
        showErrorAlert: false,
        errorMsg: '',
        submitted: false,
        userInfo: null,
        avatarDataContent: '',
        isSubmitting: false,
        profilePhotoUrl: ''
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
            bio: {},
            receiveNotifications: {}
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
            this.$v.form.$model.receiveNotifications = data.receiveNotifications;
            if (data.image && data.image.path && data.image.path.length > 0) {
                this.profilePhotoUrl = data.image.path;
            } else {
                this.profilePhotoUrl = '';
            }
        },
        loadUserInfo () {
            this.isLoading = true;
            api.dashboard.profile.userInfo()
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
            if (!this.$v.form.$anyDirty) {
                return;
            }
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
            api.dashboard.profile.updateProfile(this.form)
                .then(response => {
                    this.$eventHub.$emit('user-name-updated', { firstName: response.firstName, lastName: response.lastName });
                    this.userInfo = { ...response };
                    this.$store.commit('userInfo', { ...response });
                    this.showSuccessAlert = true;
                    this.isSubmitting = false;
                    this.$v.$reset();
                    setTimeout(() => {
                        this.hideAlerts();
                    }, 2000);
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
                    this.$v.$reset();
                    setTimeout(() => {
                        this.hideAlerts();
                    }, 2000);
                })
        },
        triggerSelectNewAvatar () {
            this.$refs.fileInput.click();
        },
        deleteImage () {
            this.isSubmitting = true;

            api.dashboard.profile.deleteImage()
                .then(() => {
                    this.$refs.fileInput.value = null;
                    this.userInfo.image = null;
                    this.profilePhotoUrl = '';
                    this.$store.commit('deleteUserImage');
                    this.$eventHub.$emit('user-image-removed');
                    this.isSubmitting = false;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isSubmitting = false;
                })
        },
        onFileChange (event) {
            this.$nextTick(() => {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
            });
            if (!event || !event.target || !event.target.files || !event.target.files.length) {
                this.isSubmitting = false;
                return;
            }
            const file = event.target.files[0];
            this.isSubmitting = true;

            const fr = new FileReader();
            fr.onload = (e) => {
                if (!e || !e.target || !e.target.result) {
                    this.isSubmitting = false;
                    return;
                }
                const tempData = e.target.result;
                if (this.$refs.userPhoto) {
                    this.$refs.userPhoto.setAttribute('src', tempData);
                }
                api.dashboard.profile.uploadImage(file)
                    .then(result => {
                        if (!result) {
                            this.isSubmitting = false;
                            return;
                        }
                        this.userInfo['image'] = { ...result.image };
                        this.profilePhotoUrl = result.image.path;
                        this.$store.commit('setUserImage', result.image);
                        this.$eventHub.$emit('user-image-updated', { image: result.image, tempData: tempData });
                        this.isSubmitting = false;
                    })
                    .catch(err => {
                        console.log('\n >> err > ', err);
                        this.isSubmitting = false;
                    });
            };
            fr.readAsDataURL(file);
            fr.onerror = () => {
                this.isSubmitting = false;
            };
        },
        showMobileAside () {
            this.$eventHub.$emit('show-mobile-profile-aside');
        },
        hasOriginalImage () {
            if (!this.userInfo || !this.userInfo.id) return false;
            if (!this.userInfo.image) return false;
            return this.userInfo.image.path && this.userInfo.image.path.length > 0;
        },
        showConfirmRemovePhotoModal () {
            if (this.isSubmitting) return;
            this.$bvModal.show(this.modalId);
        }
    }
}
</script>

<style lang="scss">
@import "../../scss/utils/vars";
.edit-profile-wrapper {
    .edit-profile-wrapper-col {
        min-height: 400px;

        @media screen and (max-width: $phoneBigWidth) {
            min-height: 200px;
        }
    }
    .form-group {
        &.notifications-form-group {
            @media screen and (min-width: $tableWidth + 1) {
                margin-top: -5px;
            }
        }
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
    .profile-img {
        margin: 16px auto 0;
        width: 240px;
        height: 240px;

        &.no-image {
            height: 0;
            width: 0;
            margin-top: 0;

            img {
                opacity: 0;
                height: 0;
                width: 0;
            }
        }
        &:not(.no-image) {
            @media screen and (max-width: $tableMinWidth) {
                width: 180px;
                height: 180px;
                margin-top: 14px;
            }
        }

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
        }
    }
}
</style>
