<template>
    <b-modal
            id="shipping-info-modal"
            ref="shippingInfoModal"
            hide-footer
            size="lg"
            centered
            modal-class="shipping-info-modal"
            @hidden="onHidden"
            @show="onShow"
            centered
            :return-focus="{}"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 text-center">Edit Shipping Info</div>

            <b-form class="form" @submit.stop.prevent="onSubmit">
                <b-form-group label="Full Name">
                    <b-form-input
                            name="subject"
                            v-model="$v.form.fullName.$model"
                            placeholder="Full Name"
                            autocomplete="off"
                    ></b-form-input>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.fullName.$dirty && !$v.form.fullName.required">This is a required field.</small>
                </b-form-group>

                <b-form-group label="Address">
                    <b-form-input
                            name="address"
                            v-model="$v.form.address.$model"
                            placeholder="Address"
                            autocomplete="off"
                    ></b-form-input>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.address.$dirty && !$v.form.address.required">This is a required field.</small>
                </b-form-group>

                <b-form-group label="Phone">
                    <b-form-input
                            name="phone"
                            v-model="$v.form.phone.$model"
                            placeholder="Phone"
                            autocomplete="off"
                    ></b-form-input>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.phone.$dirty && !$v.form.phone.required">This is a required field.</small>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.phone.$dirty && $v.form.phone && !$v.form.phone.isValidPhone">Please enter valid phone.</small>
                </b-form-group>

                <div class="btn-box">
                    <b-button
                            type="submit"
                            :disabled="$v.$invalid"
                            class="btnGreen btnBigSize btn100 text-uppercase hover-slide-left">
                        <span>Save</span>
                    </b-button>
                </div>
            </b-form>
        </div>
        <div slot="modal-title"></div>
        <div slot="modal-header-close">
            <div class="modal-popup-title-icon">
                <SvgIcon icon="closeModalIcon"></SvgIcon>
            </div>
        </div>
    </b-modal>
</template>

<script>
import SvgIcon from '../SvgIcon';
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import parsePhoneNumberWithError from 'libphonenumber-js';
export default {
    name: "ShippingInfoModal",
    mixins: [validationMixin],
    components: {SvgIcon},
    props: ['prevValues'],
    data: () => ({
        form: {
            fullName: '',
            address: '',
            phone: ''
        }
    }),
    validations: {
        form: {
            fullName: {required},
            address: {required},
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
            }
        }
    },
    methods: {
        onShow () {
            const keys = Object.keys(this.prevValues || []);
            keys.forEach(key => {
                if (this.prevValues[key]) {
                    this.form[key] = this.prevValues[key];
                }
             });
        },
        onHidden () {
            this.$v.$reset();
            this.form.fullName = '';
            this.form.address = '';
            this.form.phone = '';
        },
        closeModal () {
            this.$bvModal.hide('shipping-info-modal');
        },
        onSubmit () {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            try {
                const _phoneNumber = parsePhoneNumberWithError(this.form.phone, 'US');
                if (_phoneNumber) {
                    this.form.phone = _phoneNumber.nationalNumber;
                } else {
                    return;
                }
            } catch (error) {
                return;
            }
            this.closeModal();
            this.$emit('shipping-info-saved', this.form);
        }
    }
}
</script>

<style scoped>

</style>
