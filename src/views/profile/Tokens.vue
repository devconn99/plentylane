<template>
    <div class="row">
        <div class="col-12">
            <div class="dashboard-title-box flex-row align-items-center mb-4 mb-lg-5 mt-2 mt-lg-3">
                <div class="dashboard-profile-title-back mr-2 mr-md-3">
                    <div class="cursor-pointer" @click="showMobileAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                    </div>
                </div>
                <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">Tokens</div>
            </div>

            <div class="tokens-table-wrapper">
                <loading
                        :active.sync="isLoading"
                        :is-full-page="loaderOptions.IS_FULL_PAGE"
                        :color="loaderOptions.COLOR"
                        :background-color="loaderOptions.BACKGROUND_COLOR"
                ></loading>
                <template v-if="isDataLoaded">
                    <template v-if="tokensInfo">
                        <p>{{tokensAvailableStr}}</p>

                        <b-table
                                v-if="tokensInfo.data && tokensInfo.data.length"
                                class="table-custom-border"
                                bordered
                                :items="tokensInfo.data"
                                :fields="tableHeaderFields"
                        ></b-table>
                    </template>
                    <template v-else>
                        <p>No tokens available.</p>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon';
import Loading from 'vue-loading-overlay';
import api from '../../api';
import config from "../../config";
export default {
    name: "Tokens",
    components: {SvgIcon, Loading},
    data: () => ({
        loaderOptions: { ...config.LOADER_OPTIONS },
        tokensInfo: {},
        tableHeaderFields: [
            {
                key: 'date',
                label: 'Date'
            },
            {
                key: 'meal.name',
                label: 'Meal'
            },
            {
                key: 'tokens',
                label: 'Tokens'
            }
        ],
        isLoading: false,
        isDataLoaded: false
    }),
    methods: {
        showMobileAside () {
            this.$eventHub.$emit('show-mobile-profile-aside');
        },
        getTokens () {
            this.isLoading = true;
            api.dashboard.tokens.getTokens()
                .then(response => {
                    this.tokensInfo = { ...response };
                    this.isLoading = false;
                    this.isDataLoaded = true;
                })
                .catch(() => {
                    this.tokensInfo = {};
                    this.isLoading = false;
                    this.isDataLoaded = true;
                });
        }
    },
    created () {
        this.getTokens();
    },
    computed: {
        tokensAvailableStr: function () {
            if (!this.isDataLoaded || !this.tokensInfo) return '';
            if (!this.tokensInfo.available) return 'No tokens available.';
            return `${this.tokensInfo.available} token${this.tokensInfo.available === 1 ? '' : 's'} available.`;
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";

.tokens-table-wrapper {
    min-height: 300px;
    width: 100%;
    position: relative;

    @media screen and (max-width: $phoneBigWidth) {
        min-height: 200px;
    }
}
</style>
