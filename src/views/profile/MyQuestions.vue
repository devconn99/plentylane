<template>
    <div class="row">
        <div class="col-12">
            <div class="dashboard-title-box flex-row align-items-center mb-4 mb-lg-5 mt-2 mt-lg-3">
                <div class="dashboard-profile-title-back mr-2 mr-md-3">
                    <div class="cursor-pointer" @click="showMobileAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                    </div>
                </div>
                <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">My Questions</div>
            </div>

            <b-tabs nav-class="custom-tabs" content-class="profile-item mt-4" v-model="activeTabIndex" @input="onTabSwitched">
                <b-tab title="Answered" :disabled="isLoadingUnAnsweredQuestions">
                    <div class="tab-content-wrapper">
                        <loading
                                :active.sync="isLoadingAnsweredQuestions"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                                :background-color="loaderOptions.BACKGROUND_COLOR"
                        ></loading>
                        <template v-if="answeredPagination.loaded">
                            <div class="questions" v-if="answeredQuestions && answeredQuestions.length">
                                <div class="questions-box" v-for="item in answeredQuestions" v-bind:key="item.id">
                                    <div class="row">
                                        <div class="col-sm-4 mb-2 mb-sm-0">
                                            <div class="questions-box-author right-padding">
                                                <div class="questions-box-author-img mr-2 mr-xl-3">
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
                                                </div>
                                                <div class="questions-box-author-title">
                                                    {{ item.askedBy.displayName }}
                                                    <span v-if="item.createdAtDisplayDate">{{item.createdAtDisplayDate}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-8">
                                            <div class="questions-box-text right-padding">
                                                <p class="question mb-1">Q: {{item.question}}</p>
                                                <div class="mb-1">
                                                    <span class="pr-2">About</span>
                                                    <router-link
                                                            :to="{ path: '/dashboard/meals/' + item.mealId }"
                                                            v-slot="{ href }"
                                                    >
                                                        <a :href="href" target="_blank">{{item.meal.name}}</a>
                                                    </router-link>
                                                </div>
                                                <p>{{item.meal.user.firstName}}: {{item.answer}}</p>
                                            </div>
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
                                <p>No questions.</p>
                            </div>
                        </template>
                    </div>
                </b-tab>
                <b-tab title="Non-answered" :disabled="isLoadingAnsweredQuestions">
                    <div class="tab-content-wrapper">
                        <loading
                                :active.sync="isLoadingUnAnsweredQuestions"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                                :background-color="loaderOptions.BACKGROUND_COLOR"
                        ></loading>
                        <template v-if="unAnsweredPagination.loaded">
                            <div class="questions" v-if="unAnsweredQuestions && unAnsweredQuestions.length">
                                <div class="questions-box" v-for="item in unAnsweredQuestions" v-bind:key="item.id">
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
                                                    {{ item.askedBy.displayName }}
                                                    <span v-if="item.createdAtDisplayDate">{{item.createdAtDisplayDate}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-8">
                                            <div class="questions-box-text">
                                                <p class="question mb-1">Q: {{item.question}}</p>
                                                <div>
                                                    <span class="pr-2">About</span>
                                                    <router-link
                                                            :to="{ path: '/dashboard/meals/' + item.mealId }"
                                                            v-slot="{ href }"
                                                    >
                                                        <a :href="href" target="_blank">{{item.meal.name}}</a>
                                                    </router-link>
                                                </div>
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
                                <p>No questions.</p>
                            </div>
                        </template>
                    </div>
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon';
import Loading from 'vue-loading-overlay';
import config from "../../config";
import api from '../../api';
import helpers from "../../helpers";
export default {
    name: "MyQuestions",
    components: {SvgIcon, Loading},
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
        isLoadingAnsweredQuestions: false
    }),
    created () {
        this.loadAnsweredQuestions();
    },
    methods: {
        showMobileAside () {
            this.$eventHub.$emit('show-mobile-profile-aside');
        },
        onTabSwitched (tabIndex) {
            switch (tabIndex) {
                case 0:
                    if (!this.answeredPagination.loaded) {
                        return this.loadAnsweredQuestions();
                    }
                    break;
                case 1:
                    if (!this.unAnsweredPagination.loaded) {
                        return this.loadUnAnsweredQuestions();
                    }
                    break;
                default:
                    break;
            }
        },
        loadUnAnsweredQuestions () {
            this.isLoadingUnAnsweredQuestions = true;
            api.dashboard.mealQuestions.getMyUnAnsweredQuestions(this.unAnsweredPagination.page)
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
            api.dashboard.mealQuestions.getMyAnsweredQuestions(this.answeredPagination.page)
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
        }
    }
}
</script>

<style scoped lang="scss">
.tab-content-wrapper {
    min-height: 300px;
    width: 100%;
    position: relative;
}
</style>
