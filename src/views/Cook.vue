<template>
    <div>
        <div class="dashboard-hero dashboard-cook-bg">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleDarkColor">Let's get cooking!</div>
                    </div>
                </div>
            </div>
            <HeroWave></HeroWave>
        </div>

        <div class="dashboard-content">
            <div class="container-fluid">
                <div class="row mt-md-5 mt-sm-3">
                    <div class="cook-page-btn-wrapper mx-auto">
                        <div class="box-btn">
                            <router-link
                                    to="cook/new-meal"
                                    tag="button"
                                    class="btnLightGreen btnHugeSize btn100 hover-slide-left mb-3"
                            >
                                <span>
                                    <i class="fas fa-plus"></i>
                                    New Meal
                                </span>
                            </router-link>
                            <b-button
                                    class="btnGreenTransparent btnHugeSize btn100 hover-slide-left"
                                    ref="btnCopyMeal"
                                    @click="openSelectMealModal">
                                <span>
                                    <i class="fas fa-sync"></i>
                                    Copy Meal
                                </span>
                            </b-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <SelectMealModal></SelectMealModal>
    </div>
</template>

<script>
import HeroWave from '../components/HeroWave';
import SelectMealModal from '../components/modals/SelectMealModal';
export default {
    name: "Cook",
    components: {HeroWave, SelectMealModal},
    methods: {
        openSelectMealModal () {
            this.$bvModal.show('select-meal-modal');
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.cook-page-btn-wrapper {
    min-width: 560px;

    @media screen and (max-width: $tableMinWidth) {
        min-width: 100%;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
    }
}
</style>
