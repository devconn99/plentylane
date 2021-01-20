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
                <div class="row mt-5">
                    <div class="col-md-6 mx-auto">
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
                            <b-button class="btnGreenTransparent btnHugeSize btn100 hover-slide-left">
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
    </div>
</template>

<script>
import HeroWave from '../components/HeroWave';
export default {
    name: "Cook",
    components: {HeroWave}
}
</script>

<style scoped lang="scss">
    // TODO: check buttons on screen width ~860px later
</style>
