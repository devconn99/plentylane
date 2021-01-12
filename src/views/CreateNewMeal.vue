<template>
    <div class="new-meal-page">
        <form-wizard
                v-if="!isWizardCompleted"
                @on-complete="onComplete"
                @on-change="onChange"
                :title="stepTitles[currentStep]"
                subtitle=""
                shape="tab"
                ref="newMealWizard"
                color="#009C90">
            <tab-content title="" :before-change="()=>validateStep('step1')">
                <NewMealStep1 ref="step1" @on-validate="beforeFirstTabSwitch"></NewMealStep1>
            </tab-content>
            <tab-content title="" :before-change="beforeSecondTabSwitch">
                <NewMealImage ref="step2"></NewMealImage>
            </tab-content>
            <tab-content title="" :before-change="()=>validateStep('step3')">
                <NewMealStep3 ref="step3" @on-validate="beforeThirdTabSwitch"></NewMealStep3>
            </tab-content>
            <tab-content title="" :before-change="beforeLastTabSwitch">
                <div class="meal-preview-container">
                    <div class="meal-preview-fields-group d-flex">
                        <div class="meal-preview-field-item image-field-container">
                            <div class="meal-preview-field-item-header d-flex">
                                <span class="text-muted">Meal Image</span>
                                <b-btn class="edit-btn" @click="goToStep(1)">
                                    <i class="fa fa-pencil-alt"></i>
                                    <span class="edit-btn-text">Edit</span>
                                </b-btn>
                            </div>
                            <div class="meal-preview-field-item-image-holder"></div>
                        </div>
                        <div class="meal-preview-field-item">
                            <div class="meal-preview-field-item-header d-flex">
                                <span class="text-muted">Meal Info</span>
                                <b-btn class="edit-btn" @click="goToStep(0)">
                                    <i class="fa fa-pencil-alt"></i>
                                    <span class="edit-btn-text">Edit</span>
                                </b-btn>
                            </div>
                            <div class="meal-preview-field-item-bg-block">
                                <p class="meal-title">{{mealInfo.name}}</p>
                                <p class="meal-quantity">{{mealQuantityStr}}</p>
                                <p
                                        class="meal-description"
                                        v-if="mealInfo.description && mealInfo.description.length"
                                >{{mealInfo.description}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="meal-preview-fields-group d-flex">
                        <div class="meal-preview-field-item pickup-time-field-container">
                            <div class="meal-preview-field-item-header d-flex">
                                <span class="text-muted">Availability</span>
                                <b-btn class="edit-btn" @click="goToStep(2)">
                                    <i class="fa fa-pencil-alt"></i>
                                    <span class="edit-btn-text">Edit</span>
                                </b-btn>
                            </div>
                            <div class="meal-preview-field-item-bg-block">
                                <p>{{formattedPickupTime}}</p>
                            </div>
                        </div>
                        <div class="meal-preview-field-item location-field-container">
                            <div class="meal-preview-field-item-header d-flex">
                                <span class="text-muted">Location</span>
                                <b-btn class="edit-btn" @click="goToStep(2)">
                                    <i class="fa fa-pencil-alt"></i>
                                    <span class="edit-btn-text">Edit</span>
                                </b-btn>
                            </div>
                            <div class="meal-preview-field-item-bg-block">
                                <p>{{mealInfo.placeAlias}}</p>
                            </div>
                        </div>
                        <div class="meal-preview-field-item dietary-notes-field-container">
                            <div class="meal-preview-field-item-header d-flex">
                                <span class="text-muted">Dietary Notes</span>
                                <b-btn class="edit-btn" @click="goToStep(2)">
                                    <i class="fa fa-pencil-alt"></i>
                                    <span class="edit-btn-text">Edit</span>
                                </b-btn>
                            </div>
                            <div class="meal-preview-field-item-bg-block">
                                <ul v-if="mealInfo.dietaryNotesText && mealInfo.dietaryNotesText.length">
                                    <li v-for="note in mealInfo.dietaryNotesText">{{note}}</li>
                                </ul>
                                <ul v-else="mealInfo.dietaryNotes && mealInfo.dietaryNotes.length">
                                    <li v-for="item in mealInfo.dietaryNotes">{{item.label}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
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
        <div v-if="isWizardCompleted" class="meal-posted-container">
            <!-- TODO: temp -->
            <p>Meal posted, woohoo!</p>
            <b-button class="btn btn-green" @click="redirectToMeal">
                <i class="fa fa-eye"></i>
                <span class="pl-2">View Your Meal</span>
            </b-button>
            <router-link to="cook/new-meal" tag="button" class="btn btn-green mt-3">
                <i class="fa fa-plus"></i>
                <span class="pl-2">Create Another Meal</span>
            </router-link>
        </div>
    </div>
</template>

<script>
import NewMealStep1 from "../components/new-meal/NewMealStep1";
import NewMealImage from "../components/new-meal/NewMealImage";
import NewMealStep3 from "../components/new-meal/NewMealStep3";
import api from '../api';
export default {
    name: "CreateNewMeal",
    components: {NewMealStep1, NewMealImage, NewMealStep3},
    data: () => ({
        stepTitles: ['What are we making?', 'Do you have an image?', 'Notes, availability, and location', 'Let\'s review'],
        currentStep: 0,
        totalSteps: 4,
        newMealId: '',
        newMealUuid: '',
        mealInfo: {},
        postMeal: {},
        newOffer: {
            quantity: '',
            pickupTime: '',
            placeId: '',
            mealId: ''
        },
        isWizardCompleted: false
    }),
    computed: {
        formattedPickupTime: function () {
            // TODO: complete it later
            if (!this.mealInfo || !this.mealInfo.pickupTime) {
                return '';
            }
            // format: 5-6pm Tues, Feb. 1
            const date = new Date(this.mealInfo.pickupTime);
            const weekdayName = date.toLocaleDateString('en', { weekday: 'short' });
            const monthName = date.toLocaleDateString('en', { month: 'short' });
            let hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();
            const minutesStr = (`0${minutes}`).slice(-2);
            const isPM = hours >= 12;
            // temp time str
            let timeStr = '';
            const ampm = isPM ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            if (minutes === 0) {
                timeStr = `${hours}${ampm}`;
            } else {
                timeStr = `${hours}:${minutesStr}${ampm}`;
            }
            return `${timeStr} ${weekdayName}, ${monthName}. ${date.getUTCDate()}`;
        },
        mealQuantityStr: function () {
            let num = 0;
            if (this.mealInfo.quantity) {
                num = Number(this.mealInfo.quantity);
            }
            return `${num} Serving${num === 1 ? '' : 's'}`;
        },
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
        onChange (prevIndex, nextIndex) {
            if (nextIndex >= 0) {
                this.currentStep = nextIndex;
            }
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
        beforeLastTabSwitch () {
            return api.dashboard.meals.addMeal(this.postMeal)
                .then(result => {
                    this.newMealId = result.id;
                    this.newMealUuid = result.uuid;
                    this.newOffer.mealId = result.id;
                    return api.dashboard.offers.addOffer(this.newOffer)
                        .then(offer => {
                            return true;
                        })
                        .catch(err => {
                            console.log('\n >> error POST offer:', err);
                            // TODO: handle error
                            return false;
                        });
                })
                .catch(err => {
                    console.log('\n >> err post meal > ', err);
                    // TODO: handle error
                    return false;
                });
        },
        redirectToMeal () {
            this.$router.push({ path: `/dashboard/meals/${this.newMealId}` });
        }
    }
}
</script>

<style scoped lang="scss">
@import "../variables";
.new-meal-page {

}
.meal-preview-container {
    .meal-preview-fields-group {
        justify-content: space-between;

        & + .meal-preview-fields-group {
            margin-top: 30px;
        }

        .meal-preview-field-item {
            width: 100%;

            &.image-field-container {
                max-width: 204px;
                min-width: 204px;
            }
            &.dietary-notes-field-container {
                min-width: 200px;
            }
            &.pickup-time-field-container {
                max-width: 204px;
                min-width: 204px;
            }
            &.location-field-container {
                min-width: 150px;
            }

            & + .meal-preview-field-item {
                margin-left: 25px;
            }

            .meal-preview-field-item-header {
                justify-content: space-between;
                align-items: center;
                font-family: $LacaProSemiBold;
                font-size: 18px;
                line-height: 18px;
                color: #8A877D;
                margin-bottom: 10px;

                .edit-btn {
                    background: transparent;
                    border: none;
                    outline: none;
                    color: $greenColor;
                    padding-left: 0;
                    padding-right: 0;
                    margin-left: 20px;

                    .edit-btn-text {
                        margin-left: 10px;
                    }
                }
            }

            .meal-title {
                color: #181816;
                font-family: $LacaProSemiBold;
                font-size: 24px;
            }
            .meal-quantity {
                font-family: $FilsonProBold;
            }

            .meal-preview-field-item-bg-block {
                background-color: #fff;
                color: #181816;
                padding: 16px;
                font-size: 16px;
                line-height: 24px;
                font-family: $FilsonProRegular;
                letter-spacing: 0;
            }

            .meal-preview-field-item-image-holder {
                // temp
                width: 204px;
                height: 180px;
                background-color: $greenColor;
            }

            ul, li {
                list-style-type: disc;
            }
            ul {
                padding-left: 16px;
            }
        }
    }
}
</style>
