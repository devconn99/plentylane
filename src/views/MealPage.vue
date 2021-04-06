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
                        <router-link
                                class="cook-box"
                                :to="{ path: '/dashboard/cook-profile/' + mealInfo.user.id }"
                                v-if="mealInfo.user && mealInfo.user.id"
                        >
                            <div class="cook-info justify-content-center">
                                <div class="cook-info-img">
                                    <template v-if="mealInfo.user.image && mealInfo.user.image.thumbnail && mealInfo.user.image.thumbnail.length">
                                        <img :src="mealInfo.user.image.thumbnail" alt="" class="img-fluid">
                                    </template>
                                    <template v-else>
                                        <i class="fas fa-user-circle icon-placeholder"></i>
                                    </template>
                                </div>
                                <div class="cook-info-part">
                                    <div class="cook-info-name titleLightColor mr-2">{{userName}}</div>
                                    <div class="cook-info-benefits">
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit3"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit2"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit1"></SvgIcon>
                                        </div>
                                        <UserRating :rating="mealInfo.user.rating"></UserRating>
                                    </div>
                                </div>
                            </div>
                        </router-link>
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
                                            <p>{{mealInfo.user.firstName}}: {{item.answer}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mb-5 d-flex justify-content-end">
                    <div class="col-12 col-lg-4">
                        <b-btn class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mb-4" @click="showAskQuestionModal">
                            <span>Ask question</span>
                        </b-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <AskQuestionAboutMeal :meal-id="this.mealId" @on-question-sent="onQuestionSent"></AskQuestionAboutMeal>
    </div>
</template>

<script>
import api from "../api";
import helpers from "../helpers";
import HeroWave from '../components/HeroWave';
import SvgIcon from '../components/SvgIcon';
import AskQuestionAboutMeal from '../components/modals/AskQuestionAboutMeal';
import UserRating from '../components/UserRating';
export default {
    name: "MealPage",
    components: {HeroWave, SvgIcon, AskQuestionAboutMeal, UserRating},
    data: () => ({
        isLoaded: false,
        mealId: '',
        mealInfo: {},
        bgImageUrl: ''
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
    computed: {
        userName: function () {
            return helpers.userNameWithShortLastName(this.mealInfo['user']);
        }
    },
    methods: {
        clearData () {
            this.isLoaded = false;
            this.mealInfo = {};
            this.bgImageUrl = '';
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
            api.dashboard.meals.getMealById(this.mealId, true)
                .then(meal => {
                    if (meal.dietaryNotes && meal.dietaryNotes.length) {
                        meal.dietaryNotes = helpers.retrieveDietaryNotes(meal.dietaryNotes);
                    }
                    if (meal.images && meal.images.length) {
                        const _images = meal.images;
                        if (_images[0] && _images[0].path && _images[0].path.length > 0) {
                            this.bgImageUrl = _images[0].path;
                        } else {
                            this.bgImageUrl = '';
                        }
                    } else {
                        this.bgImageUrl = '';
                    }
                    if (meal.mealQuestions && meal.mealQuestions.length) {
                        meal.mealQuestions = helpers.convertQuestionsDataResponse(meal.mealQuestions, { key: 'question', isDesc: false });
                    }
                    this.mealInfo = { ...meal };
                    if (meal.user && !meal.user.hasOwnProperty('image')) {
                        return api.dashboard.users.getUserInfo(meal.user.id);
                    }
                    return Promise.resolve(null);
                })
                .then(userInfo => {
                    if (userInfo && userInfo.hasOwnProperty('image')) {
                        this.mealInfo.user['image'] = { ...userInfo.image };
                    }
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                    if (cb) cb();
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.errLoadingDataHandler(cb, err);
                })
        },
        showAskQuestionModal () {
            this.$bvModal.show('ask-question-modal');
        },
        onQuestionSent (result) {
            // no need to display new question at this moment because current page shows only answered questions.
        }
    }
}
</script>

<style scoped lang="scss">

</style>
