<template>
    <b-modal
            id="answer-question-modal"
            ref="answerQuestionModal"
            hide-footer
            size="lg"
            centered
            modal-class="answer-question-modal"
            @hidden="onHidden"
            centered
            :return-focus="{}"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 text-center">
                <template v-if="!isSubmitted">Answer question</template>
                <template v-else>Your answer has been sent successfully.</template>
            </div>

            <b-form class="form" @submit.stop.prevent="onSubmit" v-if="!isSubmitted">
                <loading
                        :active.sync="showLoading"
                        :is-full-page="loaderOptions.IS_FULL_PAGE"
                        :color="loaderOptions.COLOR"
                        :background-color="loaderOptions.BACKGROUND_COLOR"
                ></loading>
                <template v-if="questionInfo && questionInfo.id">
                    <b-form-group label="Question" v-if="questionInfo.question && questionInfo.question.length">
                        <p class="m-0 p-0">{{questionInfo.question}}</p>
                    </b-form-group>
                </template>
                <template v-if="questionInfo && questionInfo.mealId && questionInfo.meal && questionInfo.meal.name">
                    <b-form-group label="About">
                        <router-link :to="{ path: '/dashboard/my-meals/' + questionInfo.mealId }" v-slot="{ href }">
                            <a :href="href" target="_blank">{{questionInfo.meal.name}}</a>
                        </router-link>
                    </b-form-group>
                </template>
                <b-form-group label="Answer">
                    <textarea
                            name="answer"
                            v-model.trim="$v.form.answer.$model"
                            placeholder=""
                            autocomplete="off"
                    ></textarea>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.answer.$dirty && !$v.form.answer.required">This is a required field.</small>
                    <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.answer.maxLength">This field must be shorter than or equal to {{answerMaxLength}} characters.</small>
                </b-form-group>
                <div class="btn-box">
                    <b-button type="submit" :disabled="$v.$invalid || showLoading" class="btnGreen btnBigSize btn100 text-uppercase hover-slide-left">
                        <span>Send answer</span>
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
    name: "AnswerQuestionModal",
    mixins: [validationMixin],
    components: {SvgIcon, Loading},
    props: ['questionInfo'],
    data: () => ({
        isSubmitted: false,
        answerMaxLength: config.TEXT_AREA_MAX_LENGTH,
        form: {
            answer: null
        },
        loaderOptions: { ...config.LOADER_OPTIONS },
        showLoading: false
    }),
    validations: {
        form: {
            answer: {
                required,
                maxLength: maxLength(config.TEXT_AREA_MAX_LENGTH)
            }
        }
    },
    methods: {
        closeModal () {
            this.$bvModal.hide('answer-question-modal');
        },
        onHidden () {
            this.isSubmitted = false;
            this.$v.$reset();
            this.form.answer = null;
            this.showLoading = false;
            this.$emit('modal-hidden');
        },
        onSubmit () {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            this.showLoading = true;
            const _dataToPatch = { answer: this.$v.form.$model.answer };
            api.dashboard.mealQuestions.updateMyAnswer(this.questionInfo.id, _dataToPatch)
                .then(() => {
                    this.$emit('answer-sent', { ...this.questionInfo, ..._dataToPatch });
                    this.showLoading = false;
                    this.isSubmitted = true;
                    setTimeout(() => {
                        this.closeModal();
                    }, 2000);
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.showLoading = false;
                })
        }
    },
}
</script>

<style scoped>

</style>
