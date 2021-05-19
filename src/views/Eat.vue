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
                        :background-color="loaderOptions.BACKGROUND_COLOR"
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
        },
        prepareBrowserLocation () {
            let vm = this;
            const crd = vm.$store.getters.browserCoordinates;
            if (crd && crd.lat && crd.lng) {
                vm.$eventHub.$emit('browser-coordinates', crd);
                return;
            }
            const _options = {
                enableHighAccuracy: false,
                timeout: 4000,
                maximumAge: 0
            };
            function _successHandler (pos) {
                if (!pos || !pos.coords) return;
                const data = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                vm.$store.commit('browserCoordinates', data);
                vm.$eventHub.$emit('browser-coordinates', data);
            }
            function _errorHandler (err) {
                // error codes:
                // 0: unknown error
                // 1: permission denied
                // 2: position unavailable (error response from location provider)
                // 3: timed out
                switch (err.code) {
                    case 0:
                    case 2:
                    case 3:
                        // ask user's location again in 2 seconds
                        setTimeout(() => {
                            navigator.geolocation.getCurrentPosition(_successHandler, _errorHandler, _options);
                        }, 2000);
                        break;
                    default:
                        vm.$eventHub.$emit('error-browser-coordinates');
                        break;
                }
            }
            navigator.geolocation.getCurrentPosition(_successHandler, _errorHandler, _options);
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.isLoading = true;
            vm.prepareBrowserLocation();
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
