<template>
    <div class="dashboard-content" v-if="cookInfo && cookInfo.id">
        <div class="container-fluid cook-profile-page-container">
            <loading
                    :active.sync="isProcessing"
                    :is-full-page="loaderOptions.IS_FULL_PAGE"
                    :color="loaderOptions.COLOR"
                    :background-color="loaderOptions.BACKGROUND_COLOR"
            ></loading>
            <div class="row mb-5 align-items-center">
                <div class="col-sm-4 mb-4 mb-sm-0" v-if="hasProfileImage()">
                    <div class="cook-box">
                        <div class="cook-box-bigimg">
                            <img :src="cookInfo.image.path || cookInfo.image.thumbnail" alt="" class="img-fluid">
                        </div>
                    </div>
                </div>
                <div v-bind:class="hasProfileImage() ? 'col-sm-8' : 'col-12'">
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
                            <div class="cook-info-links">
                                <div class="mr-2 mr-md-3 link-item" @click="openContactCookModal">
                                    <SvgIcon icon="message"></SvgIcon>
                                    <span class="ml-1 link-item-text">Message</span>
                                </div>
                                <div class="mr-2 mr-md-3 link-item" @click="toggleFavorite">
                                     <i class="fa-heart link-item-icon" v-bind:class="{ fas: isFavorite, far: !isFavorite }"></i>
                                    <span class="ml-1 link-item-text">Favorite</span>
                                </div>
                                <div class="link-item" @click="onClickNetworkBtn">
                                    <SvgIcon icon="network"></SvgIcon>
                                    <span class="ml-1 link-item-text">
                                        <template v-if="!isCookInMyNetwork">
                                            Add to Network
                                        </template>
                                        <template v-else>Remove from Network</template>
                                    </span>
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
                        :background-color="loaderOptions.BACKGROUND_COLOR"
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

                <div class="row" v-if="reviewsPage.loaded">
                    <template v-if="reviews && reviews.length">
                        <div class="col-12">
                            <div class="dashboard-title-box mb-3">
                                <div class="title-size3 titleGreenNavyColor">{{numOfReviewsStr}}</div>
                            </div>
                            <div class="questions">
                                <div class="questions-box" v-for="review in reviews" v-bind:key="review.id">
                                    <div class="row">
                                        <div class="col-sm-4 mb-2 mb-sm-0">
                                            <div class="questions-box-author">
                                                <div class="questions-box-author-img-placeholder mr-2 mr-xl-3">
                                                    <i class="fas fa-user-circle user-icon"></i>
                                                </div>
                                                <div class="questions-box-author-title">
                                                    {{review.from.fullName}}
                                                    <span>{{review.from.date}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-8">
                                            <div class="questions-box-text">
                                                <div class="questions-box-stars">
                                                    <b-form-rating
                                                            inline
                                                            no-border
                                                            v-model="review.rating"
                                                            readonly
                                                    >
                                                        <template slot="icon-full">
                                                            <SvgIcon icon="ratingStarFull"></SvgIcon>
                                                        </template>
                                                        <template slot="icon-half">
                                                            <SvgIcon icon="ratingStarHalf"></SvgIcon>
                                                        </template>
                                                        <template slot="icon-empty">
                                                            <SvgIcon icon="ratingStarEmpty"></SvgIcon>
                                                        </template>
                                                    </b-form-rating>
                                                </div>
                                                <p class="question mb-1">{{review.title}}</p>
                                                <p>{{review.comment}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mx-auto mt-4" v-if="!reviewsPage.isLastPage">
                            <div class="btn-box">
                                <b-btn
                                        class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mb-4"
                                        @click="loadMoreReviews"
                                >
                                    <span>More Reviews</span>
                                </b-btn>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="col-12">
                            <div class="dashboard-title-box mb-3">
                                <div class="title-size3 titleGreenNavyColor">No Reviews</div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- TODO: add review section when endpoint is ready -->
        </div>

        <!-- modals -->
        <ContactCookModal :cook-id="this.cookId"></ContactCookModal>
        <ConfirmModal :id="modalId" :message="confirmRemoveMsg" @confirmed="onConfirmedRemoveFromNetwork"></ConfirmModal>
    </div>
</template>

<script>
import api from '../api';
import SvgIcon from '../components/SvgIcon';
import ContactCookModal from '../components/modals/ContactCookModal';
import Loading from 'vue-loading-overlay';
import OfferInfoBlock from '../components/OfferInfoBlock';
import config from "../config";
import ConfirmModal from '../components/modals/ConfirmModal';
export default {
    name: "CookProfile",
    components: {SvgIcon, ContactCookModal, Loading, OfferInfoBlock, ConfirmModal},
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
        loaderOptions: { ...config.LOADER_OPTIONS },
        isCookInMyNetwork: false,
        isProcessing: false,
        confirmRemoveMsg: 'Are you sure you want to remove this person from your network?',
        modalId: 'confirm-remove-from-network',
        reviewsPage: {
            total: 0,
            page: 1,
            pageCount: 1,
            loaded: false,
            isLastPage: false
        },
        reviews: []
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
        hasProfileImage () {
            if (!this.cookInfo || !this.cookInfo.id) return false;
            if (!this.cookInfo.image) return;
            const _img = this.cookInfo.image;
            return (_img.path && _img.path.length > 0) || (_img.thumbnail && _img.thumbnail.length);
        },
        clearData () {
            this.isLoaded = false;
            this.cookInfo = null;
            this.offers = [];
            this.areOffersLoading = false;
            this.isFavorite = false;
            this.isLastPage = false;
            this.currentPage = 1;
            this.totalOffers = 0;
            this.isCookInMyNetwork = false;
            this.isProcessing = false;
            this.reviews = [];
            this.reviewsPage = {
                total: 0,
                page: 1,
                pageCount: 1,
                loaded: false,
                isLastPage: false
            };
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
            const requests = [
                api.dashboard.users.getUserInfo(this.cookId),
                api.dashboard.offers.getAvailableOffersFromUser(this.cookId),
                api.dashboard.users.getReviews(this.cookId)
            ];
            const _myNetwork = this.$store.getters.myNetwork;
            if (_myNetwork && _myNetwork.length) {
                this.isCookInMyNetwork = this.$store.getters.isUserInMyNetwork(this.cookId);
            } else {
                requests.push(api.dashboard.follows.getMyConnections());
            }
            Promise.all(requests)
                .then(results => {
                    for (const [index, data] of results.entries()) {
                        switch (index) {
                            case 0:
                                // cook info
                                this.cookInfo = { ...data };
                                break;
                            case 1:
                                // offers
                                const _offers = { ...data };
                                this.isLastPage = _offers.page === _offers.pageCount;
                                this.offers = _offers.data;
                                this.currentPage = _offers.page;
                                this.totalOffers = _offers.total;
                                break;
                            case 2:
                                // reviews
                                // TODO: temp values
                                const dataPage = { ...data };
                                this.reviewsPage.total = dataPage.total;
                                this.reviewsPage.page = dataPage.page;
                                this.reviewsPage.pageCount = dataPage.pageCount;
                                this.reviewsPage.isLastPage = dataPage.isLastPage;
                                this.reviews = this.reviews.concat(dataPage.data);
                                this.reviewsPage.loaded = true;
                                break;
                            case 3:
                                // my network
                                const _network = data['following'] || [];
                                this.$nextTick(() => {
                                    this.$store.commit('setMyNetwork', _network);
                                    this.isCookInMyNetwork = this.$store.getters.isUserInMyNetwork(this.cookId);
                                });
                                break;
                        }
                    }
                    this.isLoaded = true;
                    this.areOffersLoading = true;
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
            if (this.isProcessing) return;
            // TODO: it's temp
            this.isProcessing = true;
            setTimeout(() => {
                this.isFavorite = !this.isFavorite;
                this.isProcessing = false;
            }, 500);
        },
        onClickNetworkBtn () {
            if (!this.cookId) return;
            if (this.isCookInMyNetwork) {
                return this.openConfirmModal();
            }
            return this.addToNetwork();
        },
        addToNetwork () {
            this.isProcessing = true;
            api.dashboard.follows.followUser(this.cookId)
                .then(result => {
                    if (result && result.following && result.following.length) {
                        this.$store.commit('setMyNetwork', result.following.slice(0));
                    }
                    this.isProcessing = false;
                    this.isCookInMyNetwork = true;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isProcessing = false;
                })
        },
        removeFromNetwork () {
            this.isProcessing = true;
            api.dashboard.follows.unFollowUser(this.cookId)
                .then(() => {
                    this.isProcessing = false;
                    this.isCookInMyNetwork = false;
                    this.$store.commit('removeUserFromNetwork', this.cookId)
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isProcessing = false;
                })
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
        },
        openConfirmModal () {
            this.$bvModal.show(this.modalId);
        },
        onConfirmedRemoveFromNetwork () {
            this.removeFromNetwork();
        },
        loadMoreReviews () {
            // TODO
        }
    },
    computed: {
        numOfOffersStr: function () {
            return `${this.totalOffers} Meal${this.totalOffers === 1 ? '' : 's'}`;
        },
        numOfReviewsStr: function () {
            return `${this.reviews.length} Review${this.reviews === 1 ? '' : 's'}`;
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.cook-profile-page-container {
    position: relative;
    min-height: 500px;

    @media screen and (max-width: $phoneBigWidth) {
        min-height: 300px;
    }
}

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
