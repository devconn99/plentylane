<template>
    <div>
        <div class="dashboard-hero dashboard-not-found-bg">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleDarkColor">Page not found</div>
                    </div>
                </div>
            </div>
            <HeroWave></HeroWave>
        </div>

        <div class="dashboard-content">
            <div class="container-fluid">
                <div class="booking-page-not-found-button-wrapper">
                    <router-link
                            :to="{ path: '/dashboard' }"
                            tag="button"
                            class="btnLightGreen btnHugeSize hover-slide-left mb-3"
                    >
                        <span>Go to dashboard</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HeroWave from '../components/HeroWave';
export default {
    name: "NotFound",
    components: {HeroWave}
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.booking-page-not-found-button-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    justify-content: center;
    align-items: center;
    margin: 50px auto 0;

    @media screen and (max-width: $phoneBigWidth) {
        max-width: 100%;
        margin-top: 0;

        button {
            width: 100%;
        }
    }
}
</style>
