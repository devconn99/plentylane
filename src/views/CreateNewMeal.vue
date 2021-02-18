<template>
    <div>
        <div class="dashboard-hero dashboard-cook-bg">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleDarkColor">
                            <template v-if="!isWizardCompleted">{{stepTitles[currentStep]}}</template>
                            <template v-else>Meal posted, woohoo!</template>
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
                        <loading :active.sync="isPosting"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                        ></loading>
                        <form-wizard
                                @on-complete="onComplete"
                                @on-change="onChange"
                                title=""
                                subtitle=""
                                shape="tab"
                                ref="newMealWizard"
                                class="wizard-new-meal"
                                v-bind:class="{ 'is-last-step': currentStep === totalSteps - 1 }"
                                color="#009C90">
                            <tab-content title="" :before-change="()=>validateStep('step1')">
                                <NewMealStep1
                                        ref="step1"
                                        :prev-values="copyMealInfo"
                                        :disabled-fields="disabledFields"
                                        @on-validate="beforeFirstTabSwitch"
                                        @should-allow-edit-meal-copy="onShouldAllowEditMealCopy"
                                ></NewMealStep1>
                            </tab-content>
                            <tab-content title="" :before-change="beforeSecondTabSwitch">
                                <NewMealImage
                                        ref="step2"
                                        :disabled-fields="disabledFields"
                                        @should-allow-edit-meal-copy="onShouldAllowEditMealCopy"
                                ></NewMealImage>
                            </tab-content>
                            <tab-content title="" :before-change="()=>validateStep('step3')">
                                <NewMealStep3
                                        ref="step3"
                                        :prev-values="copyMealInfo"
                                        :disabled-fields="disabledFields"
                                        @on-validate="beforeThirdTabSwitch"
                                        @should-allow-edit-meal-copy="onShouldAllowEditMealCopy"
                                ></NewMealStep3>
                            </tab-content>
                            <tab-content title="" :before-change="beforeLastTabSwitch">
                                <MealReviewBeforeSave :meal-info="mealInfo" @go-to-step="onGoToStepHandler"></MealReviewBeforeSave>
                            </tab-content>

                            <template slot="footer" scope="props">
                                <div class=wizard-footer-left>
                                    <wizard-button @click.native="backBtnClick(props)" class="wizard-btn-prev" :style="props.fillButtonStyle">
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
                                        <span v-else class="wizard-btn-text">Post</span>
                                        <i class="wizard-btn-icon fas fa-arrow-right"></i>
                                    </wizard-button>
                                </div>
                            </template>
                        </form-wizard>
                    </div>

                    <div class="meal-created-btn-wrapper mx-auto" v-else>
                        <div class="box-btn">
                            <b-button
                                    class="btnLightGreen btnHugeSize btn100 hover-slide-left mb-3"
                                    @click="redirectToMeal"
                            >
                                <span>
                                    <i class="fa fa-eye"></i>
                                    View Your Meal
                                </span>
                            </b-button>
                            <b-button
                                    class="btnGreenTransparent btnHugeSize btn100 hover-slide-left"
                                    @click="createAnotherMeal"
                            >
                                <span>
                                    <i class="fa fa-plus"></i>
                                    Create Another Meal
                                </span>
                            </b-button>
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
import config from "../config";
export default {
    name: "CreateNewMeal",
    components: {NewMealStep1, NewMealImage, NewMealStep3, HeroWave, Loading, MealReviewBeforeSave},
    data: () => ({
        stepTitles: ['What are we making?', 'Do you have an image?', 'Notes, availability, and location', 'Let\'s review'],
        currentStep: 0,
        totalSteps: 4,
        newMealId: '',
        mealInfo: {},
        postMeal: {},
        newOffer: {
            quantity: '',
            pickupTime: '',
            placeId: '',
            mealId: ''
        },
        isWizardCompleted: false,
        newOfferId: '',
        loaderOptions: { ...config.LOADER_OPTIONS },
        isPosting: false,
        copyMealInfo: {},
        disabledFields: []
    }),
    computed: {
        // save it for later
        isCurrentStepValid: function () {
            // TODO: get back to it later
            switch (this.currentStep) {
                case 0:
                    // name, description, number of meals screen
                    const refStep1 = this.$refs['step1'];
                    if (refStep1) {
                        return refStep1.isFormValid();
                    }
                    return false;
                case 1:
                    // image screen
                    // temp
                    return true;
                case 2:
                    // dietary notes, pickup time, location screen
                    const refStep3 = this.$refs['step3'];
                    if (refStep3) {
                        return refStep3.isFormValid();
                    }
                    return false;
                default:
                    return true;
            }
        }
    },
    methods: {
        goToStep (stepIndex) {
            this.$refs.newMealWizard.changeTab(this.currentStep, stepIndex);
        },
        onGoToStepHandler (stepIndex) {
            this.goToStep(stepIndex);
        },
        onChange (prevIndex, nextIndex) {
            if (nextIndex >= 0) {
                this.currentStep = nextIndex;
            }
            window.scrollTo(0, 0);
        },
        backBtnClick (props) {
          if (this.currentStep !== 0) {
              props.prevTab();
          } else {
              this.$router.push({ path: '/dashboard/cook' });
          }
        },
        validateStep(name) {
            const refToValidate = this.$refs[name];
            return refToValidate.validate();
        },
        onComplete () {
            this.isWizardCompleted = true;
        },
        beforeFirstTabSwitch (model, isValid) {
            if (!isValid) return false;
            this.mealInfo = Object.assign({}, this.mealInfo, model);
            this.postMeal = { name: model.name, description: model.description, dietaryNotes: [] };
            this.newOffer.quantity = Number(model.quantity);
            return true;
        },
        beforeSecondTabSwitch () {
            // load image step
            return true;
        },
        beforeThirdTabSwitch (model, isValid) {
            if (!isValid) return false;
            this.newOffer.pickupTime = model.pickupTime;
            this.newOffer.placeId = model.placeId;
            this.mealInfo = Object.assign({}, this.mealInfo, model);
            this.postMeal['dietaryNotes'] = model.dietaryNotes;
            return true;
        },
        hasMealInfoChanged () {
            if (this.postMeal.name !== this.copyMealInfo.name.trim()) return true;
            if (this.postMeal.description !== this.copyMealInfo.description.trim()) return true;
            // TODO: check if new image was uploaded (when uploading is ready)
            const _prevNotes =
                this.copyMealInfo.dietaryNotes && this.copyMealInfo.dietaryNotes.length
                    ? this.copyMealInfo.dietaryNotes.map(note => note.label)
                    : [];
            const _newNotes =
                this.postMeal.dietaryNotes && this.postMeal.dietaryNotes.length
                    ? this.postMeal.dietaryNotes.map(note => note.label)
                    : [];
            if (_newNotes.length && !_prevNotes.length) return true;
            if (!_newNotes.length && _prevNotes.length) return true;
            const _prevNotesValueStr = _prevNotes.sort().join(',');
            const _newNotesValueStr = _newNotes.sort().join(',');
            return _prevNotesValueStr !== _newNotesValueStr;
        },
        beforeLastTabSwitch () {
            this.isPosting = true;
            if (this.copyMealInfo && this.copyMealInfo.id) {
                // check if meal info has changed. If there are no changes - skip POST new meal, just POST new offer
                if (!this.hasMealInfoChanged()) {
                    this.newOffer.mealId = this.copyMealInfo.id;
                    return api.dashboard.offers.addOffer(this.newOffer)
                        .then(offer => {
                            this.newOfferId = offer.id;
                            this.isPosting = false;
                            return true;
                        })
                        .catch(err => {
                            this.isPosting = false;
                            console.log('\n >> error POST offer:', err);
                            // TODO: handle error
                            return false;
                        });
                }
            }
            // just a regular flow: POST new meal -> POST new offer
            return api.dashboard.meals.addMeal(this.postMeal)
                .then(result => {
                    this.newMealId = result.id;
                    this.newOffer.mealId = result.id;
                    return api.dashboard.offers.addOffer(this.newOffer)
                        .then(offer => {
                            this.newOfferId = offer.id;
                            this.isPosting = false;
                            return true;
                        })
                        .catch(err => {
                            this.isPosting = false;
                            console.log('\n >> error POST offer:', err);
                            // TODO: handle error
                            return false;
                        });
                })
                .catch(err => {
                    this.isPosting = false;
                    console.log('\n >> err post meal > ', err);
                    // TODO: handle error
                    return false;
                });
        },
        redirectToMeal () {
            this.$router.push({ path: `/dashboard/my-offers/${this.newOfferId}` });
        },
        createAnotherMeal () {
            // clear all steps of the wizard
            this.newOfferId = '';
            this.postMeal = {};
            this.newMealId = '';
            this.mealInfo = {};
            this.newOffer = {
                quantity: '',
                pickupTime: '',
                placeId: '',
                mealId: ''
            };
            this.isWizardCompleted = false;
            this.copyMealInfo = Object.assign({});
            this.disabledFields = [];
            setTimeout(() => {
                this.goToStep(0);
            }, 0);
        },
        onShouldAllowEditMealCopy () {
            this.$nextTick(() => {
                this.disabledFields = [];
            });
        }
    },
    created () {
        // get copy meal info from $store
        this.$nextTick(() => {
            const _copiedInfo = { ...this.$store.getters.copiedMealInfo };
            if (!_copiedInfo || !_copiedInfo.id || !_copiedInfo.name) return;
            this.copyMealInfo = { ..._copiedInfo };
            // reset $store value
            this.$store.commit('copiedMealInfo', {});
            this.disabledFields = ['name', 'description', 'image', 'dietaryNotes'];
        });
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.meal-created-btn-wrapper {
    min-width: 560px;

    @media screen and (max-width: $tableMinWidth) {
        min-width: 100%;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
    }
}
</style>
