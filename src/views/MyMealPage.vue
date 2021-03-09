<template>
    <div v-if="isLoaded && mealInfo && mealInfo.id">
        <div
                class="dashboard-hero hero-img-overlay offer-page-content-header"
                :style="{ backgroundImage: 'url(' + bgImageUrl + ')' }"
        >
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleLightColor mb-2">{{mealInfo.name}}</div>
                    </div>
                </div>
            </div>
            <HeroWave></HeroWave>
        </div>

        <div class="dashboard-content">
            <div class="container-fluid">
                <div class="row mb-5">
                    <div class="col-lg-8">
                        <div class="dashboard-title-box mb-4">
                            <div class="title-size3 titleGreenNavyColor">About this meal</div>
                        </div>
                        <div class="dashboard-text" v-if="mealInfo.description && mealInfo.description.length">
                            <p>{{mealInfo.description}}</p>
                        </div>

                        <template v-if="mealInfo.dietaryNotes && mealInfo.dietaryNotes.length">
                            <div class="dashboard-title-box mb-3 mt-5">
                                <div class="title-size3 titleGreenNavyColor">Dietary Notes</div>
                            </div>
                            <div class="dashboard-text">
                                <ul class="list-style-circle">
                                    <li v-for="note in mealInfo.dietaryNotes">{{note.text}}</li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="row mb-5" v-if="mealInfo.mealQuestions && mealInfo.mealQuestions.length">
                    <div class="col-md-12">
                        <div class="dashboard-title-box mb-3">
                            <div class="title-size3 titleGreenNavyColor">
                                {{mealInfo.mealQuestions.length}} Question{{mealInfo.mealQuestions.length !== 1 ? 's' : ''}}
                            </div>
                        </div>
                        <div class="questions">
                            <div class="questions-box" v-for="item in mealInfo.mealQuestions">
                                <div class="row">
                                    <div class="col-sm-4 mb-2 mb-sm-0">
                                        <div class="questions-box-author">
                                            <template v-if="item.askedBy && item.askedBy.image && item.askedBy.image.thumbnail && item.askedBy.image.thumbnail.length">
                                                <div class="questions-box-author-img mr-2 mr-xl-3">
                                                    <img :src="item.askedBy.image.thumbnail" alt="" class="img-fluid">
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="questions-box-author-img-placeholder mr-2 mr-xl-3">
                                                    <i class="fas fa-user-circle user-icon"></i>
                                                </div>
                                            </template>
                                            <div class="questions-box-author-title">
                                                <template v-if="item.askedBy && item.askedBy.displayName">
                                                    {{item.askedBy.displayName}}
                                                </template>
                                                <template v-else>User-{{ item.askedById }}</template>
                                                <span v-if="item.createdAtDisplayDate">{{item.createdAtDisplayDate}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-8">
                                        <div class="questions-box-text">
                                            <p class="question mb-1">Q: {{item.question}}</p>
                                            <template v-if="item.answer && item.answer.length">
                                                <p>You: {{item.answer}}</p>
                                            </template>
                                            <template v-else>
                                                <b-btn
                                                        class="btnGreenTransparent btnSmallSize hover-slide-left"
                                                        @click="showModalToAnswerQuestion(item)"
                                                >
                                                    <span>Answer</span>
                                                </b-btn>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <AnswerQuestionModal
                :question-info="questionToAnswer"
                @answer-sent="onAnswerSent"
                @modal-hidden="onAnswerQuestionModalHidden"
        ></AnswerQuestionModal>
    </div>
</template>

<script>
import api from '../api';
import HeroWave from '../components/HeroWave';
import helpers from '../helpers';
import AnswerQuestionModal from '../components/modals/AnswerQuestionModal';
export default {
    name: "MyMealPage",
    components: {HeroWave, AnswerQuestionModal},
    data: () => ({
        mealId: '',
        mealInfo: {},
        isLoaded: false,
        bgImageUrl: '',
        questionToAnswer: null
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.clearData();
            const { id = '' } = vm.$route.params;
            vm.mealId = id;
            vm.loadPageData();
        })
    },
    beforeRouteUpdate (to, from, next) {
        const _loading = this.$loading.show();
        this.clearData();
        const { id = '' } = to.params;
        this.mealId = id;
        const cb = () => {
            next();
            if (_loading && _loading.hide) {
                _loading.hide();
            }
        };
        this.loadPageData(cb);
    },
    methods: {
        clearData () {
            this.isLoaded = false;
            this.mealInfo = {};
            this.bgImageUrl = '';
            this.questionToAnswer = null;
        },
        errLoadingDataHandler (cb, err) {
            if (err) {
                if (err.data && err.data.statusCode === 404) {
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                    if (cb) cb();
                    return this.$router.push({ path: '/dashboard/not-found' }).catch(() => {});
                }
            }
            this.isLoaded = true;
            this.hideGlobalLoader();
            if (cb) cb();
        },
        hideGlobalLoader () {
            if (this.$loader && this.$loader.hide) {
                setTimeout(() => {
                    this.$loader.hide()
                }, 0);
            }
        },
        loadPageData (cb) {
            if (!this.mealId) {
                this.errLoadingDataHandler(cb);
                return;
            }
            if (isNaN(this.mealId)) {
                this.errLoadingDataHandler(cb, { data: { statusCode: 404 } });
                return;
            }
            api.dashboard.meals.getMyMealById(this.mealId, true)
                .then(result => {
                    if (result.dietaryNotes && result.dietaryNotes.length) {
                        result.dietaryNotes = helpers.retrieveDietaryNotes(result.dietaryNotes);
                    }
                    if (result.images && result.images.length) {
                        const _images = result.images;
                        if (_images[0] && _images[0].path && _images[0].path.length > 0) {
                            this.bgImageUrl = _images[0].path;
                        } else {
                            this.bgImageUrl = '';
                        }
                    } else {
                        this.bgImageUrl = '';
                    }
                    if (result.mealQuestions && result.mealQuestions.length) {
                        result.mealQuestions = helpers.convertQuestionsDataResponse(result.mealQuestions);
                    }
                    this.mealInfo = { ...result };
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                    if (cb) cb();
                })
                .catch(err => {
                    this.errLoadingDataHandler(cb, err);
                })
        },
        showModalToAnswerQuestion (item) {
            this.questionToAnswer = { ...item };
            this.$bvModal.show('answer-question-modal');
        },
        onAnswerQuestionModalHidden () {
            this.questionToAnswer = null;
        },
        onAnswerSent (result) {
            const _question = this.mealInfo.mealQuestions.find(item => Number(item.id) === Number(result.id));
            if (_question) {
                _question['answer'] = result.answer;
            }
            this.questionToAnswer = null;
        }
    }
}
</script>

<style scoped>

</style>
