<template>
    <b-modal
            id="contact-cook-modal"
            ref="contactCookModal"
            hide-footer
            size="lg"
            centered
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
                <SvgIcon icon="closeModalIcon"></SvgIcon>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import config from '../../config';
import SvgIcon from '../SvgIcon';
export default {
    name: "ContactCookModal",
    mixins: [validationMixin],
    components: {SvgIcon},
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
