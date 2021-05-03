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
                    <div class="cook-profile cook-profile-top-info">
                        <div class="title-size1 mb-3 text-center text-sm-left cook-profile-username">{{cookInfo.username}}</div>
                        <div class="cook-box">
                            <div class="cook-info mb-3">
                                <div class="cook-info-part">
                                    <div class="cook-info-benefits">
                                        <!-- hardcoded symbols should be hidden -->
                                        <!--
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit3"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit2"></SvgIcon>
                                        </div>
                                        <div class="cook-info-benefits-box">
                                            <SvgIcon icon="benefit1"></SvgIcon>
                                        </div>
                                        -->
                                        <UserRating :rating="cookInfo.rating"></UserRating>
                                    </div>
                                </div>
                                <!-- should be hidden at the moment -->
                                <!--
                                <div class="cook-info-additional ml-2 ml-md-3">
                                    <div class="cook-location">
                                        <SvgIcon icon="location"></SvgIcon>
                                        <span class="ml-2">Austin, TX</span>
                                    </div>
                                </div>
                                -->
                            </div>
                            <div class="cook-info-links" v-if="!isCurrentUserCookPage()">
                                <!-- should be hidden at the moment  -->
                                <!--
                                <div class="mr-2 mr-md-3 link-item" @click="openContactCookModal">
                                    <SvgIcon icon="message"></SvgIcon>
                                    <span class="ml-1 link-item-text">Message</span>
                                </div>
                                -->
                                <div class="mr-2 mr-md-3 link-item" @click="toggleFavorite">
                                     <i class="fa-heart link-item-icon" v-bind:class="{ fas: isFavorite, far: !isFavorite }"></i>
                                    <span class="ml-1 link-item-text">Favorite</span>
                                </div>
                                <div class="link-item" @click="onClickNetworkBtn">
                                    <SvgIcon icon="network"></SvgIcon>
                                    <span class="ml-1 link-item-text">
                                        <template v-if="!isFriend">
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

                <!-- Reviews sections should be hidden -->
                <!--
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
                -->
            </div>
        </div>

        <!-- modals -->
        <!--<ContactCookModal></ContactCookModal>-->
        <ConfirmModal :id="modalIdNetwork" :message="confirmRemoveFromNtwMsg" @confirmed="onConfirmedRemoveFromNetwork"></ConfirmModal>
        <ConfirmModal :id="modalIdFavorite" :message="confirmRemoveFromFvrMsg" @confirmed="onConfirmedRemoveFromFavorite"></ConfirmModal>
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
import UserRating from '../components/UserRating';
export default {
    name: "CookProfile",
    components: {SvgIcon, ContactCookModal, Loading, OfferInfoBlock, ConfirmModal, UserRating},
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
        isProcessing: false,
        confirmRemoveFromNtwMsg: 'Are you sure you want to remove this person from your network?',
        modalIdNetwork: 'confirm-remove-from-network',
        confirmRemoveFromFvrMsg: 'Are you sure you want to remove this person from your favorite list?',
        modalIdFavorite: 'confirm-remove-from-favorite-list',
        reviewsPage: {
            total: 0,
            page: 1,
            pageCount: 1,
            loaded: false,
            isLastPage: false
        },
        reviews: [],
        currentUserId: '',
        isFriend: false
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
            this.isFriend = false;
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
        isCurrentUserCookPage () {
            if (!this.currentUserId || !this.cookId) return false;
            return Number(this.currentUserId) === Number(this.cookId);
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
            this.currentUserId = localStorage.getItem('plUserId') || this.$store.getters.userId || '';
            const requests = [
                api.dashboard.users.getUserInfo(this.cookId),
                api.dashboard.offers.getAvailableOffersFromUser(this.cookId)
            ];
            if (!this.isCurrentUserCookPage()) {
                requests.push(api.dashboard.follows.getUserConnection(this.cookId));
            }
            Promise.all(requests)
                .then(results => {
                    for (const [index, data] of results.entries()) {
                        switch (index) {
                            case 0:
                                // cook info
                                this.cookInfo = { ...data };
                                if (this.isCurrentUserCookPage()) {
                                    // update current user info in $store
                                    this.$store.commit('userInfo', { ...data });
                                }
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
                                // user connection
                                const { isFriend = false, isFavorite = false } = data;
                                this.$nextTick(() => {
                                    this.isFriend = isFriend;
                                    this.isFavorite = isFavorite;
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
        /*
        openContactCookModal () {
            this.$bvModal.show('contact-cook-modal');
        },
        */
        toggleFavorite () {
            if (this.isProcessing) return;
            if (this.isFavorite) {
                this.openConfirmRemoveFromFvrModal();
            } else {
                this.addToFavorites();
            }
        },
        addToFavorites () {
            this.isProcessing = true;
            api.dashboard.follows.addUserToFavorites(this.cookId)
                .then(() => {
                    this.isFavorite = true;
                    this.isProcessing = false;
                })
                .catch(() => {
                    this.isProcessing = false;
                });
        },
        removeFromFavorites () {
            this.isProcessing = true;
            api.dashboard.follows.removeUserFromFavorites(this.cookId)
                .then(() => {
                    this.isFavorite = false;
                    this.isProcessing = false;
                })
                .catch(() => {
                    this.isProcessing = false;
                });
        },
        onClickNetworkBtn () {
            if (!this.cookId) return;
            if (this.isFriend) {
                return this.openConfirmRemoveFromNtwModal();
            }
            return this.addToNetwork();
        },
        addToNetwork () {
            this.isProcessing = true;
            api.dashboard.follows.followUser(this.cookId)
                .then(() => {
                    this.isProcessing = false;
                    this.isFriend = true;
                })
                .catch(() => {
                    this.isProcessing = false;
                });
        },
        removeFromNetwork () {
            this.isProcessing = true;
            api.dashboard.follows.unFollowUser(this.cookId)
                .then(() => {
                    this.isProcessing = false;
                    this.isFriend = false;
                })
                .catch(() => {
                    this.isProcessing = false;
                });
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
        openConfirmRemoveFromNtwModal () {
            this.$bvModal.show(this.modalIdNetwork);
        },
        onConfirmedRemoveFromNetwork () {
            this.removeFromNetwork();
        },
        openConfirmRemoveFromFvrModal () {
            this.$bvModal.show(this.modalIdFavorite);
        },
        onConfirmedRemoveFromFavorite () {
            this.removeFromFavorites();
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
.cook-profile.cook-profile-top-info {
    max-width: 100%;

    .cook-profile-username {
        max-width: 100%;
        overflow: hidden;
        // NOTE: text-overflow: ellipsis; is adding "...", but dots appear at the top right corner because of the font -
        // typically these dots are placed at the bottom right
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
