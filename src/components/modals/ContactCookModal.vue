<template>
    <b-modal
            id="contact-cook-modal"
            ref="contactCookModal"
            hide-footer
            size="lg"
            modal-class="contact-cook-modal"
            @hidden="onHidden"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 text-center">
                <template v-if="!isContacted">Contact the cook</template>
                <template v-else>Your message has been sent to the cook.</template>
            </div>

            <b-form class="form" @submit.stop.prevent="onSubmit" v-if="!isContacted">
                <b-form-group label="Subject/Question">
                    <b-form-input
                            name="subject"
                            v-model="$v.form.subject.$model"
                            placeholder=""
                            autocomplete="off"
                    ></b-form-input>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.subject.$dirty && !$v.form.subject.required">This is a required field.</small>
                    <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.subject.maxLength">This field must be shorter than or equal to {{messageMaxLength}} characters.</small>
                </b-form-group>
                <b-form-group label="Notes for cook">
                    <textarea
                            name="message"
                            v-model="$v.form.message.$model"
                            placeholder=""
                            autocomplete="off"
                    ></textarea>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.message.$dirty && !$v.form.message.required">This is a required field.</small>
                    <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.message.maxLength">This field must be shorter than or equal to {{messageMaxLength}} characters.</small>
                </b-form-group>
                <div class="btn-box">
                    <b-button type="submit" :disabled="$v.$invalid" class="btnGreen btnBigSize btn100 text-uppercase hover-slide-left">
                        <span>Send message</span>
                    </b-button>
                </div>
            </b-form>
        </div>
        <div slot="modal-title"></div>
        <div slot="modal-header-close">
            <div class="modal-popup-title-icon">
                <!-- TODO: use SvgIcon component instead -->
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g transform="translate(-960.000000, -227.000000)">
                            <g transform="translate(1.000000, 0.000000)">
                                <g transform="translate(440.000000, 200.000000)">
                                    <g transform="translate(512.000000, 20.000000)">
                                        <g>
                                            <polygon points="0 0 32 0 32 32 0 32"></polygon>
                                            <path
                                                    d="M24.4,7.61333333 C23.88,7.09333333 23.04,7.09333333 22.52,7.61333333 L16,14.12 L9.48,7.6 C8.96,7.08 8.12,7.08 7.6,7.6 C7.08,8.12 7.08,8.96 7.6,9.48 L14.12,16 L7.6,22.52 C7.08,23.04 7.08,23.88 7.6,24.4 C8.12,24.92 8.96,24.92 9.48,24.4 L16,17.88 L22.52,24.4 C23.04,24.92 23.88,24.92 24.4,24.4 C24.92,23.88 24.92,23.04 24.4,22.52 L17.88,16 L24.4,9.48 C24.9066667,8.97333333 24.9066667,8.12 24.4,7.61333333 Z"
                                                    fill="#757F8B"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import config from '../../config';
export default {
    name: "ContactCookModal",
    mixins: [validationMixin],
    props: ['cookId', 'offerId'],
    data: () => ({
        isContacted: false,
        messageMaxLength: config.TEXT_AREA_MAX_LENGTH,
        form: {
            subject: null,
            message: null
        },
    }),
    validations: {
        form: {
            subject: {
                required,
                maxLength: maxLength(config.TEXT_AREA_MAX_LENGTH)
            },
            message: {
                required,
                maxLength: maxLength(config.TEXT_AREA_MAX_LENGTH)
            }
        }
    },
    methods: {
        closeModal () {
            this.$bvModal.hide('contact-cook-modal');
        },
        onHidden () {
            this.isContacted = false;
            this.$v.$reset();
            this.form.subject = null;
            this.form.message = null;
        },
        onSubmit () {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            const dataToPost = {
                subject: this.$v.form.$model.subject.trim(),
                message: this.$v.form.$model.message.trim(),
            };
            // TODO: add api method for this POST request
            this.isContacted = true;
            setTimeout(() => {
                this.closeModal();
            }, 3000);
        }
    }
}
</script>

<style scoped>

</style>
