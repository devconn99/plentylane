<template>
    <div>
        <div class="dashboard-hero dashboard-eat-bg">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleDarkColor">What's cooking?</div>
                    </div>
                </div>
            </div>
            <HeroWave></HeroWave>
        </div>

        <div class="dashboard-content">
            <div class="container-fluid">
                <!-- TODO: add filters and content -->
            </div>
        </div>
    </div>
</template>

<script>
import HeroWave from '../components/HeroWave';
export default {
    name: "Eat",
    components: {HeroWave}
}
</script>

<style scoped lang="scss">

</style>
