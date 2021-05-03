<template>
    <div class="row">
        <div class="col-12">
            <div class="dashboard-title-box flex-row align-items-center mb-4 mb-lg-5 mt-2 mt-lg-3">
                <div class="dashboard-profile-title-back mr-2 mr-md-3">
                    <div class="cursor-pointer" @click="showMobileAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                    </div>
                </div>
                <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">My Answers</div>
            </div>

            <b-tabs nav-class="custom-tabs" content-class="profile-item mt-4" v-model="activeTabIndex" @input="onTabSwitched">
                <b-tab title="Pending answer" :disabled="isLoadingAnsweredQuestions">
                    <div class="tab-content-wrapper">
                        <loading
                                :active.sync="isLoadingUnAnsweredQuestions"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                                :background-color="loaderOptions.BACKGROUND_COLOR"
                        ></loading>
                        <template v-if="unAnsweredPagination.loaded">
                            <div class="questions" v-if="unAnsweredQuestions && unAnsweredQuestions.length">
                                <div class="questions-box" v-for="(item, index) in unAnsweredQuestions" v-bind:key="item.id">
                                    <div class="row" v-if="shouldShowGroupMealInfo(item, index, unAnsweredQuestions)">
                                        <div class="col-12 mb-3" v-bind:class="{ 'mt-2': index !== 0 }">
                                            <span class="pr-2">About</span>
                                            <router-link
                                                    :to="{ path: '/dashboard/my-meals/' + item.mealId }"
                                                    v-slot="{ href }"
                                            >
                                                <a :href="href" target="_blank">{{item.meal.name}}</a>
                                            </router-link>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-4 mb-2 mb-sm-0">
                                            <div class="questions-box-author">
                                                <template v-if="item.askedBy.image && item.askedBy.image.thumbnail">
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
                                                    <span class="username">{{ item.askedBy.username }}</span>
                                                    <span v-if="item.createdAtDisplayDate">{{item.createdAtDisplayDate}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-8">
                                            <div class="questions-box-text">
                                                <p class="question mb-2">Q: {{item.question}}</p>
                                                <b-btn
                                                        class="btnGreenTransparent btnSmallSize hover-slide-left"
                                                        @click="showModalToAnswerQuestion(item)"
                                                >
                                                    <span>Answer</span>
                                                </b-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <b-btn
                                        v-if="!unAnsweredPagination.isLastPage"
                                        class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                                        @click="loadMoreUnAnsweredQuestions">
                                    <span>Load more</span>
                                </b-btn>
                            </div>
                            <div v-else>
                                <p>No questions to answer.</p>
                            </div>
                        </template>
                    </div>
                </b-tab>
                <b-tab title="Answered" :disabled="isLoadingUnAnsweredQuestions">
                    <div class="tab-content-wrapper">
                        <loading
                                :active.sync="isLoadingAnsweredQuestions"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                                :background-color="loaderOptions.BACKGROUND_COLOR"
                        ></loading>
                        <loading
                                :active.sync="isRemovingAnswer"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                                :background-color="loaderOptions.BACKGROUND_COLOR"
                        ></loading>
                        <template v-if="answeredPagination.loaded">
                            <div class="questions" v-if="answeredQuestions && answeredQuestions.length">
                                <div class="questions-box" v-for="(item, index) in answeredQuestions" v-bind:key="item.id">
                                    <div class="row" v-if="shouldShowGroupMealInfo(item, index, answeredQuestions)">
                                        <div class="col-12 mb-3" v-bind:class="{ 'mt-2': index !== 0 }">
                                            <span class="pr-2">About</span>
                                            <router-link
                                                    :to="{ path: '/dashboard/my-meals/' + item.mealId }"
                                                    v-slot="{ href }"
                                            >
                                                <a :href="href" target="_blank">{{item.meal.name}}</a>
                                            </router-link>
                                        </div>
                                    </div>
                                    <div class="row position-relative">
                                        <div class="col-sm-4 mb-2 mb-sm-0">
                                            <div class="questions-box-author right-padding">
                                                <template v-if="item.askedBy.image && item.askedBy.image.thumbnail">
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
                                                    <span class="username">{{ item.askedBy.username }}</span>
                                                    <span v-if="item.createdAtDisplayDate">{{item.createdAtDisplayDate}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-8">
                                            <div class="questions-box-text right-padding">
                                                <p class="question mb-2">Q: {{item.question}}</p>
                                                <p class="mb-2">You: {{item.answer}}</p>
                                                <b-btn
                                                        class="btnGreenTransparent btnSmallSize hover-slide-left"
                                                        @click="showModalToAnswerQuestion(item, true)"
                                                >
                                                    <span>Edit</span>
                                                </b-btn>
                                            </div>
                                        </div>
                                        <div class="remove-answer" @click="showConfirmRemoveAnswerModal(item)">
                                            <SvgIcon icon="notificationClose"></SvgIcon>
                                        </div>
                                    </div>
                                </div>
                                <b-btn
                                        v-if="!answeredPagination.isLastPage"
                                        class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                                        @click="loadMoreAnsweredQuestions">
                                    <span>Load more</span>
                                </b-btn>
                            </div>
                            <div v-else>
                                <p>No answered questions.</p>
                            </div>
                        </template>
                    </div>
                </b-tab>
            </b-tabs>
        </div>

        <!-- Modals -->
        <AnswerQuestionModal
                :question-info="questionToAnswer"
                :is-edit="isEditAnswer"
                @answer-sent="onAnswerSent"
                @modal-hidden="onAnswerQuestionModalHidden"
        ></AnswerQuestionModal>
        <ConfirmModal
                :id="confirmRemoveAnswerModalId"
                :message="confirmRemoveAnswerMessage"
                @confirmed="onConfirmedRemoveAnswer"
                @canceled="onCanceledRemoveAnswer"
        ></ConfirmModal>
    </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import api from '../../api';
import ConfirmModal from '../../components/modals/ConfirmModal';
import config from "../../config";
import SvgIcon from '../../components/SvgIcon';
import helpers from '../../helpers';
import AnswerQuestionModal from '../../components/modals/AnswerQuestionModal';
export default {
    name: "MyAnswers",
    components: {Loading, ConfirmModal, SvgIcon, AnswerQuestionModal},
    data: () => ({
        loaderOptions: { ...config.LOADER_OPTIONS },
        activeTabIndex: 0,
        answeredQuestions: [],
        unAnsweredQuestions: [],
        unAnsweredPagination: {
            total: 0,
            page: 1,
            pageCount: 1,
            loaded: false,
            isLastPage: false
        },
        answeredPagination: {
            total: 0,
            page: 1,
            pageCount: 1,
            loaded: false,
            isLastPage: false
        },
        isLoadingUnAnsweredQuestions: false,
        isLoadingAnsweredQuestions: false,
        questionToAnswer: null,
        confirmRemoveAnswerModalId: 'confirm-remove-answer',
        confirmRemoveAnswerMessage: 'Are you sure you want to remove this question?',
        answerIdToRemove: null,
        isRemovingAnswer: false,
        isEditAnswer: false
    }),
    created () {
        this.loadUnAnsweredQuestions();
    },
    methods: {
        onTabSwitched (tabIndex) {
            switch (tabIndex) {
                case 0:
                    if (!this.unAnsweredPagination.loaded) {
                        return this.loadUnAnsweredQuestions();
                    }
                    break;
                case 1:
                    if (!this.answeredPagination.loaded) {
                        return this.loadAnsweredQuestions();
                    }
                    break;
                default:
                    break;
            }
        },
        loadUnAnsweredQuestions () {
            this.isLoadingUnAnsweredQuestions = true;
            api.dashboard.mealQuestions.getUnAnsweredQuestionsForCook(this.unAnsweredPagination.page)
                .then(result => {
                    const shouldOverride = this.unAnsweredPagination.page === 1;
                    if (result && result.data && result.data.length) {
                        const _result = helpers.convertQuestionsDataResponse(result.data);
                        this.unAnsweredQuestions = shouldOverride
                            ? _result.slice(0)
                            : this.unAnsweredQuestions.concat(_result.slice(0));
                    } else if (shouldOverride) {
                        this.unAnsweredQuestions = [];
                    }
                    this.unAnsweredPagination.total = result.total;
                    this.unAnsweredPagination.pageCount = result.pageCount;
                    this.unAnsweredPagination.isLastPage = result.page === result.pageCount;
                    this.unAnsweredPagination.loaded = true;
                    this.isLoadingUnAnsweredQuestions = false;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isLoadingUnAnsweredQuestions = false;
                });
        },
        loadAnsweredQuestions () {
            this.isLoadingAnsweredQuestions = true;
            api.dashboard.mealQuestions.getAnsweredQuestionsForCook(this.answeredPagination.page)
                .then(result => {
                    const shouldOverride = this.answeredPagination.page === 1;
                    if (result && result.data && result.data.length) {
                        const _result = helpers.convertQuestionsDataResponse(result.data);
                        this.answeredQuestions = shouldOverride
                            ? _result.slice(0)
                            : this.answeredQuestions.concat(_result.slice(0));
                    } else if (shouldOverride) {
                        this.answeredQuestions = [];
                    }
                    this.answeredPagination.total = result.total;
                    this.answeredPagination.pageCount = result.pageCount;
                    this.answeredPagination.isLastPage = result.page === result.pageCount;
                    this.answeredPagination.loaded = true;
                    this.isLoadingAnsweredQuestions = false;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isLoadingAnsweredQuestions = false;
                });
        },
        loadMoreUnAnsweredQuestions () {
            if (this.unAnsweredPagination.isLastPage) return;
            this.unAnsweredPagination.page++;
            this.loadUnAnsweredQuestions();
        },
        loadMoreAnsweredQuestions () {
            if (this.answeredPagination.isLastPage) return;
            this.answeredPagination.page++;
            this.loadAnsweredQuestions();
        },
        showMobileAside () {
            this.$eventHub.$emit('show-mobile-profile-aside');
        },
        showModalToAnswerQuestion (item, isEdit) {
            this.isEditAnswer = isEdit;
            this.questionToAnswer = { ...item };
            this.$bvModal.show('answer-question-modal');
        },
        onAnswerSent (result) {
            if (this.isEditAnswer) {
                const _found = this.answeredQuestions.find(item => Number(item.id) === Number(result.id));
                if (_found) {
                    _found['answer'] = result.answer;
                }
            } else {
                let _prevQuestionInfo = {};
                this.unAnsweredQuestions = this.unAnsweredQuestions.filter(item => {
                    if (Number(item.id) === Number(result.id)) {
                        _prevQuestionInfo = { ...item };
                        return false;
                    }
                    return true;
                });
                _prevQuestionInfo['answer'] = result.answer;
                this.answeredQuestions.push(_prevQuestionInfo);
            }
        },
        onAnswerQuestionModalHidden () {
            this.isEditAnswer = false;
            this.questionToAnswer = null;
        },
        showConfirmRemoveAnswerModal (item) {
            this.answerIdToRemove = item.id;
            this.$bvModal.show(this.confirmRemoveAnswerModalId);
        },
        onConfirmedRemoveAnswer () {
            if (!this.answerIdToRemove) return;
            this.isRemovingAnswer = true;
            api.dashboard.mealQuestions.deleteMyAnswer(this.answerIdToRemove)
                .then(() => {
                    this.answeredQuestions = this.answeredQuestions.filter(item => Number(item.id) !== Number(this.answerIdToRemove));
                    this.answerIdToRemove = null;
                    this.isRemovingAnswer = false;
                })
                .catch((err) => {
                    console.log('\n >> err > ', err);
                    this.isRemovingAnswer = false;
                })
        },
        onCanceledRemoveAnswer () {
            this.answerIdToRemove = null;
        },
        shouldShowGroupMealInfo (item, index, collection) {
            if (index === 0) return true;
            return !!(collection[index - 1] && item.mealId !== collection[index - 1].mealId);
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.tab-content-wrapper {
    min-height: 300px;
    width: 100%;
    position: relative;
}
.questions {
    .questions-box {
        @media screen and (min-width: $phoneBigWidth + 1) {
            .questions-box-text.right-padding {
                padding-right: 25px;
            }
        }
        @media screen and (max-width: $phoneBigWidth) {
            .questions-box-author.right-padding {
                padding-right: 25px;
            }
        }
    }
}
</style>
