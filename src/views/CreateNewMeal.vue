<template>
    <div class="new-meal-page">
        <form-wizard @on-complete="onComplete"
                     @on-change="onChange"
                     :title="stepTitles[currentStep]"
                     subtitle=""
                     shape="tab"
                     color="#009C90">
            <tab-content title="" :before-change="()=>validateStep('step1')">
                <NewMealStep1 ref="step1" @on-validate="mergePartialModels"></NewMealStep1>
            </tab-content>
            <tab-content title="" :before-change="beforeSecondTabSwitch">
                Second step content goes here...
            </tab-content>
            <tab-content title="" :before-change="beforeThirdTabSwitch">
                Third step content goes here...
            </tab-content>
            <tab-content title="" :before-change="beforeLastTabSwitch">
                Last step content goes here...
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
                    <wizard-button @click.native="props.nextTab()" class="wizard-btn-next" :style="props.fillButtonStyle">
                        <span v-if="!props.isLastStep" class="wizard-btn-text">Next</span>
                        <span v-else class="wizard-btn-text">Post</span>
                        <i class="wizard-btn-icon fas fa-arrow-right"></i>
                    </wizard-button>
                </div>
            </template>
        </form-wizard>
    </div>
</template>

<script>
import NewMealStep1 from "../components/new-meal/NewMealStep1";
export default {
    name: "CreateNewMeal",
    components: {NewMealStep1},
    data: () => ({
        stepTitles: ['What are we making?', 'Do you have an image?', 'Notes, availability, and location', 'Let\'s review'],
        currentStep: 0,
        totalSteps: 4,
        finalModel: {}
    }),
    methods: {
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
        mergePartialModels (model, isValid) {
            if (isValid) {
                // merging each step model into the final model
                this.finalModel = Object.assign({}, this.finalModel, model);
            }
        },
        onComplete () {

        },
        beforeSecondTabSwitch () {
            return true;
        },
        beforeThirdTabSwitch () {
            return true;
        },
        beforeLastTabSwitch () {
            return true;
        }
    }
}
</script>

<style scoped lang="scss">
.new-meal-page {

}
</style>
