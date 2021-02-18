<template>
    <div>
        <div class="dashboard-hero dashboard-cook-bg">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleDarkColor">
                            <template v-if="!isWizardCompleted">{{stepTitles[currentStep]}}</template>
                            <template v-else>Offer saved, woohoo!</template>
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
                                        :prev-values="currentData"
                                        ref="step1"
                                        @on-validate="beforeFirstTabSwitch"
                                ></NewMealStep1>
                            </tab-content>
                            <tab-content title="" :before-change="beforeSecondTabSwitch">
                                <NewMealImage ref="step2"></NewMealImage>
                            </tab-content>
                            <tab-content title="" :before-change="()=>validateStep('step3')">
                                <NewMealStep3
                                        :prev-values="currentData"
                                        ref="step3"
                                        @on-validate="beforeThirdTabSwitch"
                                ></NewMealStep3>
                            </tab-content>
                            <tab-content title="" :before-change="beforeLastTabSwitch">
                                <MealReviewBeforeSave
                                        :meal-info="dataReview"
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
                            <b-btn class="btnGreenTransparent btnHugeSize btn100 hover-slide-left" @click="redirectToMyOffers">
                                <span>Go to my offers</span>
                            </b-btn>
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
    name: "EditOffer",
    components: {NewMealStep1, NewMealImage, NewMealStep3, HeroWave, Loading, MealReviewBeforeSave},
    data: () => ({
        stepTitles: ['Edit your offer', 'Do you have an image?', 'Notes, availability, and location', 'Let\'s review'],
        offerId: '',
        mealId: '',
        loaderOptions: { ...config.LOADER_OPTIONS },
        currentStep: 0,
        totalSteps: 4,
        isSaving: false,
        isWizardCompleted: false,
        offerToPatch: {},
        mealToPatch: {},
        currentData: null,
        dataReview: {}
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.clearData();
            const { id = '' } = vm.$route.params;
            vm.offerId = id;
            vm.loadPageData();
        })
    },
    beforeRouteUpdate (to, from, next) {
        const _loading = this.$loading.show();
        this.clearData();
        const { id = '' } = to.params;
        this.offerId = id;
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
            this.currentData = null;
            this.dataReview = {};
            this.mealId = '';
            this.currentStep = 0;
            this.isSaving = false;
            this.isWizardCompleted = false;
            this.offerToPatch = {};
            this.mealToPatch = {};
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
            if (!this.offerId) {
                this.errLoadingDataHandler(cb);
                return;
            }
            if (isNaN(this.offerId)) {
                this.errLoadingDataHandler(cb, { data: { statusCode: 404 } });
                return;
            }
            api.dashboard.offers.getMyOfferById(this.offerId)
                .then(result => {
                    this.parseOfferData(result);
                    this.hideGlobalLoader();
                    if (cb) cb();
                })
                .catch(err => {
                    this.errLoadingDataHandler(cb ? cb : null, err);
                });
        },
        parseOfferData (offerInfo) {
            this.mealId = offerInfo.mealId;
            let _data = {};
            if (offerInfo['meal'] && offerInfo['meal']['name']) {
                if (!this.mealId) {
                    this.mealId = offerInfo.meal.id;
                }
                _data['name'] = offerInfo.meal.name;
                _data['description'] = offerInfo.meal.description;
                _data['dietaryNotes'] = offerInfo.meal.dietaryNotes;
            }
            _data['quantity'] = offerInfo.quantity;
            _data['pickupTime'] = offerInfo.pickupTime;
            _data['place'] = { ...offerInfo.place };
            _data['placeId'] = offerInfo.placeId;
            _data['mealId'] = offerInfo.mealId;
            this.$nextTick(() => {
                this.currentData = { ..._data };
                window.scrollTo(0, 0);
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
            this.dataReview = Object.assign({}, this.dataReview, model);
            this.mealToPatch = { name: model.name, description: model.description, dietaryNotes: [] };
            this.offerToPatch = { quantity: Number(model.quantity) };
            return true;
        },
        beforeSecondTabSwitch () {
            // load image step
            return true;
        },
        beforeThirdTabSwitch (model, isValid) {
            if (!isValid) return false;
            this.dataReview = Object.assign({}, this.dataReview, model);
            this.mealToPatch['dietaryNotes'] = model.dietaryNotes;
            this.offerToPatch['pickupTime'] = model.pickupTime;
            this.offerToPatch['placeId'] = model.placeId;
            return true;
        },
        beforeLastTabSwitch () {
            this.isSaving = true;
            if (typeof this.offerToPatch.quantity !== 'number') {
                this.offerToPatch.quantity = Number(this.offerToPatch.quantity);
            }
            if (typeof this.offerToPatch.placeId !== 'number') {
                this.offerToPatch.placeId = Number(this.offerToPatch.placeId);
            }
            return api.dashboard.offers.updateOffer(this.offerId, this.offerToPatch)
                .then(() => {
                    return api.dashboard.meals.updateMeal(this.mealId, this.mealToPatch)
                })
                .then(() => {
                    this.isSaving = false;
                    return true;
                })
                .catch(err => {
                    console.log('\n >> err patch offer/meal > ', err);
                    this.isSaving = false;
                    return false;
                });
        },
        redirectToMyOffers () {
            this.$store.commit('myOffersActiveTabIndexOnInit', 2);
            this.$router.push({ path: '/dashboard/profile/my-meals' }).catch(() => {});
        }
    }
}
</script>

<style scoped>

</style>
