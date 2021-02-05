<template>
    <div class="eat-page">
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
            <div class="container-fluid position-relative">
                <loading
                        :active.sync="isLoading"
                        :is-full-page="loaderOptions.IS_FULL_PAGE"
                        :color="loaderOptions.COLOR"
                ></loading>

                <MainSearch
                        :show-title="shouldShowTitle"
                        @search-started="onSearchStarted"
                        @search-finished="onSearchFinished"
                ></MainSearch>
            </div>
        </div>
    </div>
</template>

<script>
import HeroWave from '../components/HeroWave';
import MainSearch from '../components/MainSearch';
import Loading from 'vue-loading-overlay';
import config from "../config";
export default {
    name: "Eat",
    components: {HeroWave, MainSearch, Loading},
    data: () => ({
        isLoading: false,
        loaderOptions: { ...config.LOADER_OPTIONS },
        shouldShowTitle: true
    }),
    methods: {
        onSearchStarted () {
            this.isLoading = true;
        },
        onSearchFinished () {
            this.isLoading = false;
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.$eventHub.$emit('trigger-main-search', '');
        })
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.eat-page {
    .dashboard-content {
        padding-top: 80px !important;
        padding-bottom: 0 !important;

        @media screen and (max-width: $tableMinWidth) {
            padding-top: 40px !important;
        }
    }
}
</style>
