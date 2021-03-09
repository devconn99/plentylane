<template>
    <div>
        <div class="dashboard-hero dashboard-cook-bg">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleDarkColor">
                            <template v-if="!isWizardCompleted">{{stepTitles[currentStep]}}</template>
                            <template v-else>Meal saved, woohoo!</template>
                        </div>
                    </div>
                </div>
            </div>
            <HeroWave></HeroWave>
        </div>

        <div class="dashboard-content">
            <div class="container-fluid">
                <div class="row mt-md-5 mt-md-3">
                    <div class="col-12 mx-auto" v-if="!isWizardCompleted">
                        <loading
                                :active.sync="isSaving"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                                :background-color="loaderOptions.BACKGROUND_COLOR"
                        ></loading>
                        <form-wizard
                                @on-complete="onCompleteWizard"
                                @on-change="onChangeWizardStep"
                                title=""
                                subtitle=""
                                shape="tab"
                                ref="newMealWizard"
                                class="wizard-new-meal"
                                v-bind:class="{ 'is-last-step': currentStep === totalSteps - 1 }"
                                color="#009C90">
                            <tab-content title="" :before-change="()=>validateStep('step1')">
                                <NewMealStep1
                                        :exclude-quantity-field="true"
                                        :prev-values="mealOriginalInfo"
                                        ref="step1"
                                        @on-validate="beforeFirstTabSwitch"
                                ></NewMealStep1>
                            </tab-content>
                            <tab-content title="" :before-change="()=>validateStep('step2')">
                                <NewMealImage
                                        :prev-image="prevImage"
                                        ref="step2"
                                        @on-validate="beforeSecondTabSwitch"
                                ></NewMealImage>
                            </tab-content>
                            <tab-content title="" :before-change="()=>validateStep('step3')">
                                <NewMealStep3
                                        :hidden-fields="['pickupTime', 'location']"
                                        :prev-values="mealOriginalInfo"
                                        ref="step3"
                                        @on-validate="beforeThirdTabSwitch"
                                ></NewMealStep3>
                            </tab-content>
                            <tab-content title="" :before-change="beforeLastTabSwitch">
                                <MealReviewBeforeSave
                                        :meal-info="mealInfo"
                                        :hide-quantity="true"
                                        :hidden-fields="['location', 'pickupTime']"
                                        @go-to-step="onGoToStepHandler"
                                ></MealReviewBeforeSave>
                            </tab-content>

                            <template slot="footer" scope="props">
                                <div class=wizard-footer-left>
                                    <wizard-button
                                            @click.native="backBtnClick(props)"
                                            class="wizard-btn-prev"
                                            :style="props.fillButtonStyle"
                                    >
                                        <i class="wizard-btn-icon fas fa-arrow-left"></i>
                                        <span class="wizard-btn-text">Back</span>
                                    </wizard-button>
                                </div>
                                <div class="wizard-footer-step-info">Step {{currentStep + 1}}/{{totalSteps}}</div>
                                <div class="wizard-footer-right">
                                    <wizard-button
                                            @click.native="props.nextTab()"
                                            class="wizard-btn-next"
                                            :style="props.fillButtonStyle"
                                    >
                                        <span v-if="!props.isLastStep" class="wizard-btn-text">Next</span>
                                        <span v-else class="wizard-btn-text">Save</span>
                                        <i class="wizard-btn-icon fas fa-arrow-right"></i>
                                    </wizard-button>
                                </div>
                            </template>
                        </form-wizard>
                    </div>

                    <div class="meal-updated-btn-wrapper mx-auto" v-else>
                        <div class="box-btn">
                            <router-link
                                    tag="button"
                                    class="btnLightGreen btnHugeSize btn100 hover-slide-left mb-3"
                                    :to="{ path: '/dashboard' }"
                            >
                                <span>Go to the dashboard</span>
                            </router-link>
                            <router-link
                                    tag="button"
                                    class="btnGreenTransparent btnHugeSize btn100 hover-slide-left"
                                    :to="{ path: '/dashboard/profile/my-meals' }"
                            >
                                <span>Go to my meals</span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NewMealStep1 from "../components/new-meal/NewMealStep1";
import NewMealImage from "../components/new-meal/NewMealImage";
import NewMealStep3 from "../components/new-meal/NewMealStep3";
import HeroWave from '../components/HeroWave';
import api from '../api';
import Loading from 'vue-loading-overlay';
import MealReviewBeforeSave from '../components/new-meal/MealReviewBeforeSave';
import config from '../config';
export default {
    name: "EditMeal",
    components: {NewMealStep1, NewMealImage, NewMealStep3, HeroWave, Loading, MealReviewBeforeSave},
    data: () => ({
        mealId: '',
        mealOriginalInfo: null,
        stepTitles: ['Edit your meal', 'Do you have an image?', 'Notes', 'Let\'s review'],
        currentStep: 0,
        totalSteps: 4,
        mealInfo: {},
        isWizardCompleted: false,
        mealToPatch: {},
        loaderOptions: { ...config.LOADER_OPTIONS },
        isSaving: false,
        prevImage: {},
        imageIdToDelete: '',
        newImageData: null
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
            this.isWizardCompleted = false;
            this.mealOriginalInfo = null;
            this.mealToPatch = {};
            this.mealInfo = {};
            this.currentStep = 0;
            this.isSaving = false;
            this.prevImage = {};
            this.imageIdToDelete = '';
            this.newImageData = null;
        },
        hideGlobalLoader () {
            if (this.$loader && this.$loader.hide) {
                setTimeout(() => {
                    this.$loader.hide()
                }, 0);
            }
        },
        errLoadingDataHandler (cb, err) {
            if (err) {
                if (err.data && err.data.statusCode === 404) {
                    this.hideGlobalLoader();
                    if (cb) cb();
                    return this.$router.push({ path: '/dashboard/not-found' }).catch(() => {});
                }
            }
            this.hideGlobalLoader();
            if (cb) cb();
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
            api.dashboard.meals.getMyMealById(this.mealId)
                .then(result => {
                    this.mealOriginalInfo = { ...result };
                    if (result.images && result.images.length) {
                        this.prevImage = { ...result.images[0] };
                    }
                    this.hideGlobalLoader();
                    if (cb) cb();
                })
                .catch(err => {
                    this.errLoadingDataHandler(cb ? cb : null, err);
                });
        },
        onGoToStepHandler (stepIndex) {
            this.goToStep(stepIndex);
        },
        goToStep (stepIndex) {
            this.$refs.newMealWizard.changeTab(this.currentStep, stepIndex);
        },
        onChangeWizardStep (prevIndex, nextIndex) {
            if (nextIndex >= 0) {
                this.currentStep = nextIndex;
            }
            window.scrollTo(0, 0);
        },
        backBtnClick (props) {
            if (this.currentStep !== 0) {
                props.prevTab();
            } else {
                this.$router.go(-1);
            }
        },
        validateStep(name) {
            const refToValidate = this.$refs[name];
            return refToValidate.validate();
        },
        onCompleteWizard () {
            this.isWizardCompleted = true;
        },
        beforeFirstTabSwitch (model, isValid) {
            if (!isValid) return false;
            this.mealInfo = Object.assign({}, this.mealInfo, model);
            this.mealToPatch = { name: model.name, description: model.description, dietaryNotes: [] };
            return true;
        },
        beforeSecondTabSwitch (model, isValid) {
            if (!isValid) return false;
            const { file = null, imageUrl = '', imageIdToDelete = '' } = model;
            this.mealInfo['imageUrl'] = imageUrl;
            // no need to add "images" field to `this.mealToPatch`
            this.newImageData = file ? file : null;
            this.imageIdToDelete = imageIdToDelete;
            return true;
        },
        beforeThirdTabSwitch (model, isValid) {
            if (!isValid) return false;
            this.mealInfo = Object.assign({}, this.mealInfo, model);
            this.mealToPatch['dietaryNotes'] = model.dietaryNotes;
            return true;
        },
        beforeLastTabSwitch () {
            this.isSaving = true;
            return api.dashboard.meals.updateMeal(this.mealId, this.mealToPatch)
                .then(() => {
                    if (this.newImageData) {
                        return api.dashboard.meals.addImage(this.mealId, this.newImageData)
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    if (this.imageIdToDelete) {
                        return api.dashboard.meals.removeImage(this.imageIdToDelete)
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    this.isSaving = false;
                    return true;
                })
                .catch(err => {
                    console.log('\n >> err patch meal:', err);
                    this.isSaving = false;
                    return false;
                });
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.meal-updated-btn-wrapper {
    min-width: 560px;

    @media screen and (max-width: $tableMinWidth) {
        min-width: 100%;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
    }
}
</style>
