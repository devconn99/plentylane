<template>
    <div class="dashboard-content" v-if="cookInfo && cookInfo.id">
        <div class="container-fluid">
            <div class="row mb-5 align-items-center">
                <div class="col-sm-4 mb-4 mb-sm-0">
                    <div class="cook-box">
                        <div class="cook-box-bigimg">
                            <img src="../assets/images/data/images/avatars/civ_30.png" alt="" class="img-fluid">
                        </div>
                    </div>
                </div>
                <div class="col-sm-8">
                    <div class="cook-profile">
                        <div class="title-size1 mb-3 text-center text-sm-left">{{cookInfo.fullName}}</div>
                        <div class="cook-box">
                            <div class="cook-info mb-3">
                                <div class="cook-info-part">
                                    <div class="cook-info-benefits">
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit3"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit2"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit1"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box longbox">
                                            <SvgIcon icon="star"></SvgIcon>
                                            <span>4.3</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="cook-info-additional ml-2 ml-md-3">
                                    <div class="cook-location">
                                        <SvgIcon icon="location"></SvgIcon>
                                        <!-- TODO: where to get the location? -->
                                        <span class="ml-2">Austin, TX</span>
                                    </div>
                                </div>
                            </div>
                            <div class="cook-info-links mb-3">
                                <div class="mr-2 mr-md-3 link-item" @click="openContactCookModal">
                                    <SvgIcon icon="message"></SvgIcon>
                                    <span class="ml-1 link-item-text">Message</span>
                                </div>
                                <div class="mr-2 mr-md-3 link-item" @click="toggleFavorite">
                                    <!--<i class="far fa-heart link-item-icon"></i>-->
                                    <!-- TODO: use font awesome icon instead, add toggling class later -->
                                    <SvgIcon icon="heart"></SvgIcon>
                                    <span class="ml-1 link-item-text">Favorite</span>
                                </div>
                                <div class="mr-2 mr-md-3 link-item" @click="addToNetwork">
                                    <SvgIcon icon="network"></SvgIcon>
                                    <span class="ml-1 link-item-text">Add to Network</span>
                                </div>
                            </div>
                            <template v-if="cookInfo.bio && cookInfo.bio.length">
                                <div class="cook-info-name mb-2">Bio</div>
                                <p>{{cookInfo.bio}}</p>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <div class="position-relative">
                <loading
                        :active.sync="areOffersLoading"
                        :is-full-page="loaderOptions.IS_FULL_PAGE"
                        :color="loaderOptions.COLOR"
                ></loading>
                <template v-if="offers && offers.length">
                    <div class="row">
                        <div class="col-12">
                            <div class="dashboard-title-box mb-3 ">
                                <div class="title-size3 titleGreenNavyColor mb-3">{{numOfOffersStr}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-xl-4 mb-4" v-for="item in offers">
                            <OfferInfoBlock :offer-info="item" :avoid-redirect-to-cook-profile="true"></OfferInfoBlock>
                        </div>
                    </div>

                    <div class="row mb-5" v-if="!isLastPage">
                        <div class="col-md-6 col-lg-4 mx-auto mt-4">
                            <div class="btn-box">
                                <b-btn
                                        class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mb-4"
                                        @click="loadMoreOffers"
                                        ref="moreOffersBtn"
                                >
                                    <span>More Meals</span>
                                </b-btn>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- TODO: add review section when endpoint is ready -->
        </div>

        <!-- modals -->
        <ContactCookModal :cook-id="this.cookId"></ContactCookModal>
    </div>
</template>

<script>
import api from '../api';
import SvgIcon from '../components/SvgIcon';
import ContactCookModal from '../components/modals/ContactCookModal';
import Loading from 'vue-loading-overlay';
import OfferInfoBlock from '../components/OfferInfoBlock';
import config from "../config";
export default {
    name: "CookProfile",
    components: {SvgIcon, ContactCookModal, Loading, OfferInfoBlock},
    data: () => ({
        isLoaded: false,
        cookId: '',
        cookInfo: null,
        offers: [],
        areOffersLoading: false,
        isFavorite: false,
        isLastPage: false,
        currentPage: 1,
        totalOffers: 0,
        loaderOptions: { ...config.LOADER_OPTIONS }
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.clearData();
            const { id = '' } = vm.$route.params;
            vm.cookId = id;
            vm.loadPageData();
        })
    },
    beforeRouteUpdate (to, from, next) {
        const _loading = this.$loading.show();
        this.clearData();
        const { id = '' } = to.params;
        this.cookId = id;
        const cb = () => {
            next();
            if (_loading && _loading.hide) {
                _loading.hide();
            }
        };
        this.loadPageData(cb);
    },
    methods: {
        clearData () {
            this.isLoaded = false;
            this.cookInfo = null;
            this.offers = [];
            this.areOffersLoading = false;
            this.isFavorite = false;
            this.isLastPage = false;
            this.currentPage = 1;
            this.totalOffers = 0;
        },
        hideGlobalLoader () {
            if (this.$loader && this.$loader.hide) {
                setTimeout(() => {
                    this.$loader.hide()
                }, 0);
            }
        },
        errLoadingDataHandler (cb, err) {
            if (err) {
                if (err.data && err.data.statusCode === 404) {
                    this.isLoaded = true;
                    this.areOffersLoading = false;
                    this.hideGlobalLoader();
                    if (cb) cb();
                    return this.$router.push({ path: '/dashboard/not-found' }).catch(() => {});
                }
            }
            this.isLoaded = true;
            this.areOffersLoading = false;
            this.hideGlobalLoader();
            if (cb) cb();
        },
        loadPageData (cb) {
            if (!this.cookId) {
                this.errLoadingDataHandler(cb);
                return;
            }
            if (isNaN(this.cookId)) {
                this.errLoadingDataHandler(cb, { data: { statusCode: 404 } });
                return;
            }
            // TODO: load reviews (api is not ready?)
            api.dashboard.users.getUserInfo(this.cookId)
                .then(result => {
                    this.cookInfo = result;
                    this.isLoaded = true;
                    this.areOffersLoading = true;
                    return api.dashboard.offers.getAvailableOffersFromUser(this.cookId);
                })
                .then(offers => {
                    this.isLastPage = offers.page === offers.pageCount;
                    this.offers = offers.data;
                    this.currentPage = offers.page;
                    this.totalOffers = offers.total;
                    this.areOffersLoading = false;
                    this.hideGlobalLoader();
                    if (cb) cb();
                })
                .catch(err => {
                    this.errLoadingDataHandler(cb, err);
                });
        },
        openContactCookModal () {
            this.$bvModal.show('contact-cook-modal');
        },
        toggleFavorite () {
            // TODO: update icon styles
            // this.isFavorite = !this.isFavorite;
        },
        addToNetwork () {
            // TODO: show modal?
        },
        loadMoreOffers () {
            if (this.$refs['moreOffersBtn']) {
                this.$refs['moreOffersBtn'].blur();
            }
            this.areOffersLoading = true;
            this.currentPage++;
            api.dashboard.offers.getAvailableOffersFromUser(this.cookId, null, this.currentPage)
                .then(result => {
                    this.isLastPage = result.page === result.pageCount;
                    if (!this.offers || !this.offers.length) {
                        this.offers = [];
                    }
                    this.offers = this.offers.concat(result.data);
                    this.currentPage = result.page;
                    this.totalOffers = result.total;
                    this.areOffersLoading = false;
                })
                .catch(err => {
                    this.areOffersLoading = false;
                    console.log('\n >> err load more offers:', err);
                })
        }
    },
    computed: {
        numOfOffersStr: function () {
            return `${this.totalOffers} Meal${this.totalOffers === 1 ? '' : 's'}`;
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";

@media screen and (max-width: $phoneBigWidth) {
    .cook-profile {
        .cook-box {
            .cook-info, .cook-info-links {
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>
