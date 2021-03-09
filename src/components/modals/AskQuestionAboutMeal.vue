<template>
    <b-modal
            id="ask-question-modal"
            ref="askQuestionModal"
            hide-footer
            size="lg"
            centered
            modal-class="ask-question-modal"
            @hidden="onHidden"
            centered
            :return-focus="{}"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 text-center">
                <template v-if="!isSubmitted">Ask question</template>
                <template v-else>Your question has been sent successfully.</template>
            </div>

            <b-form class="form" @submit.stop.prevent="onSubmit" v-if="!isSubmitted">
                <loading
                        :active.sync="showLoading"
                        :is-full-page="loaderOptions.IS_FULL_PAGE"
                        :color="loaderOptions.COLOR"
                        :background-color="loaderOptions.BACKGROUND_COLOR"
                ></loading>
                <b-form-group label="Question">
                    <textarea
                            name="message"
                            v-model.trim="$v.form.question.$model"
                            placeholder=""
                            autocomplete="off"
                    ></textarea>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.question.$dirty && !$v.form.question.required">This is a required field.</small>
                    <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.question.maxLength">This field must be shorter than or equal to {{questionMaxLength}} characters.</small>
                </b-form-group>
                <div class="btn-box">
                    <b-button type="submit" :disabled="$v.$invalid || showLoading" class="btnGreen btnBigSize btn100 text-uppercase hover-slide-left">
                        <span>Send question</span>
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
import config from '../../config';
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import SvgIcon from '../SvgIcon';
import Loading from 'vue-loading-overlay';
import api from '../../api';
export default {
    name: "AskQuestionAboutMeal",
    mixins: [validationMixin],
    components: {SvgIcon, Loading},
    props: ['mealId'],
    data: () => ({
        isSubmitted: false,
        questionMaxLength: config.TEXT_AREA_MAX_LENGTH,
        form: {
            question: null
        },
        loaderOptions: { ...config.LOADER_OPTIONS },
        showLoading: false
    }),
    validations: {
        form: {
            question: {
                required,
                maxLength: maxLength(config.TEXT_AREA_MAX_LENGTH)
            }
        }
    },
    methods: {
        closeModal () {
            this.$bvModal.hide('ask-question-modal');
        },
        onHidden () {
            this.isSubmitted = false;
            this.$v.$reset();
            this.form.question = null;
            this.showLoading = false;
        },
        onSubmit () {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            this.showLoading = true;
            const dataToPost = {
                question: this.$v.form.$model.question,
                mealId: this.mealId
            };
            api.dashboard.mealQuestions.postQuestion(dataToPost)
                .then(result => {
                    this.$emit('question-sent', result);
                    this.showLoading = false;
                    this.isSubmitted = true;
                    setTimeout(() => {
                        this.closeModal();
                    }, 2000);
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.showLoading = false;
                });
        }
    }
}
</script>

<style scoped>

</style>
