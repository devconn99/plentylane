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
                <template v-if="tokensPagination.loaded">
                    <p>{{userCreditsStr}}</p>

                    <template v-if="tokens && tokens.length">
                        <b-table
                                class="table-custom-border"
                                bordered
                                :items="tokens"
                                :fields="tableHeaderFields"
                        >
                            <template #cell(offer.pickupTime)="data">
                                {{ getPickupTimeDate(data.item.offer.pickupTime) }}
                            </template>
                            <template #cell(servings)="data">
                                {{ getTokensStr(data.item) }}
                            </template>
                        </b-table>
                        <b-btn
                                v-if="!tokensPagination.isLastPage"
                                class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                                @click="loadMoreTokens">
                            <span>Load more</span>
                        </b-btn>
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
import helpers from '../../helpers';
export default {
    name: "Tokens",
    components: {SvgIcon, Loading},
    data: () => ({
        loaderOptions: { ...config.LOADER_OPTIONS },
        tableHeaderFields: [
            {
                key: 'offer.pickupTime',
                label: 'Date'
            },
            {
                key: 'offer.meal.name',
                label: 'Meal'
            },
            {
                key: 'servings',
                label: 'Tokens'
            }
        ],
        isLoading: false,
        tokens: [],
        tokensPagination: {
            total: 0,
            page: 1,
            pageCount: 1,
            loaded: false,
            isLastPage: false
        },
        currentUser: {}
    }),
    methods: {
        showMobileAside () {
            this.$eventHub.$emit('show-mobile-profile-aside');
        },
        loadInitialPageData () {
            this.isLoading = true;
            const requests = [
                api.dashboard.tokens.getTokens(this.tokensPagination.page),
                api.dashboard.profile.userInfo()
            ];
            Promise.all(requests)
                .then(result => {
                    if (result && result[0]) {
                        // tokens info
                        this.tokensResponseHandler(result[0]);
                    }
                    if (result && result[1]) {
                        // user info
                        const user = { ...result[1] };
                        this.currentUser = { ...user };
                        this.$store.commit('userInfo', { ...user });
                    }
                    return true;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isLoading = false;
                    this.tokensPagination.loaded = true;
                });
        },
        loadMoreTokens () {
            if (this.tokensPagination.isLastPage) return;
            this.tokensPagination.page++;
            this.$nextTick(() => {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
            });
            this.isLoading = true;
            api.dashboard.tokens.getTokens(this.tokensPagination.page)
                .then(response => {
                    this.tokensResponseHandler(response);
                })
                .catch((err) => {
                    console.log('\n >> err > ', err);
                    this.isLoading = false;
                });
        },
        tokensResponseHandler (response) {
            if (response && response.data && response.data.length) {
                this.tokens = this.tokens.concat(response.data);
            }
            this.tokensPagination.total = response.total;
            this.tokensPagination.pageCount = response.pageCount;
            this.tokensPagination.isLastPage = response.page === response.pageCount;
            this.tokensPagination.loaded = true;
            this.isLoading = false;
        },
        getPickupTimeDate (dateStr) {
            return helpers.parseDateForTokensTable(dateStr);
        },
        getTokensStr (item) {
            const _str = Number(this.currentUser.id) === Number(item.cookId) ? 'earned' : 'spent';
            return `${_str} ${item.servings} token${item.servings === 1 ? '' : 's'}`;
        }
    },
    created () {
        this.loadInitialPageData();
    },
    computed: {
        userCreditsStr: function () {
            if (!this.currentUser) return;
            const _val = Number(this.currentUser.credits) || 0;
            return `${_val} token${_val === 1 ? '' : 's'} available.`;
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
