<template>
    <div class="row">
        <div class="col-12">
            <div class="dashboard-title-box flex-row align-items-center mb-4 mb-lg-5 mt-2 mt-lg-3">
                <div class="dashboard-profile-title-back mr-2 mr-md-3">
                    <div class="cursor-pointer" @click="showMobileAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                    </div>
                </div>
                <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">My Dishes</div>
            </div>

            <b-tabs nav-class="custom-tabs" content-class="mt-4" v-model="activeTabIndex" @input="onTabSwitched">
                <b-tab title="Dishes" :disabled="isLoadingReservations || isLoadingOffers">
                    <div class="tab-content-wrapper">
                        <loading
                                :active.sync="isLoadingMeals"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                                :background-color="loaderOptions.BACKGROUND_COLOR"
                        ></loading>
                        <div v-if="mealPagination.loaded">
                            <p>You have {{mealPagination.total}} dish{{mealPagination.total === 1 ? '' : 'es'}}</p>
                            <div class="my-meal-wrapper" v-if="meals && meals.length">
                                <div class="my-meal-item p-2 p-xl-3" v-for="item in meals" v-bind:key="item.id">
                                    <div class="my-meal-item-info">
                                        <div class="my-meal-item-img-wrapper mr-2 mr-xl-3">
                                            <template v-if="hasMealImage(item)">
                                                <img
                                                        :src="getMealImageThumbnail(item)"
                                                        alt=""
                                                        class="img-fluid cursor-pointer"
                                                        @click="redirectToEditMealPage(item.id)"
                                                >
                                            </template>
                                            <template v-else>
                                                <!-- meal image placeholder -->
                                                <img
                                                        src="../../assets/images/data/images/dashboard/recepts/meal-placeholder_rect.png"
                                                        alt=""
                                                        class="img-fluid cursor-pointer"
                                                        @click="redirectToEditMealPage(item.id)"
                                                >
                                            </template>
                                        </div>
                                        <div class="my-meal-title-wrapper">
                                            <div class="my-meal-title">
                                                <div
                                                        class="title-size3 titleDarkColor cursor-pointer"
                                                        @click="redirectToEditMealPage(item.id)"
                                                >{{item.name}}</div>
                                            </div>
                                        </div>
                                        <div class="my-meal-action-wrapper">
                                            <b-dropdown
                                                    size="sm"
                                                    menu-class="my-meal-action-menu"
                                                    toggle-class="my-meal-action-toggle text-decoration-none"
                                                    no-caret
                                                    variant="outline-secondary"
                                            >
                                                <template #button-content>
                                                    <i class="fas fa-ellipsis-v"></i>
                                                </template>
                                                <b-dropdown-item @click="redirectToEditMealPage(item.id)">Edit</b-dropdown-item>
                                                <b-dropdown-item @click="removeMeal(item.id)">Remove</b-dropdown-item>
                                            </b-dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <b-btn
                                    v-if="!mealPagination.isLastPage"
                                    class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                                    @click="loadMoreMeals">
                                <span>Load more</span>
                            </b-btn>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="Reservations" :disabled="isLoadingMeals || isLoadingOffers">
                    <div class="tab-content-wrapper">
                        <loading
                                :active.sync="isLoadingReservations"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                                :background-color="loaderOptions.BACKGROUND_COLOR"
                        ></loading>
                        <div v-if="dinesPagination.loaded">
                            <p>You have {{dinesPagination.total}} reservation{{dinesPagination.total === 1 ? '' : 's'}}</p>
                            <div v-if="reservations && reservations.length">
                                <BookingInfoBlock
                                        v-for="item in reservations"
                                        v-bind:key="item.id"
                                        :booking-info="item"
                                        :actions="dineActions"
                                        :show-action-menu="true"
                                        :should-allow-rate="shouldShowRatingForm(item)"
                                        :rating-value="item.rating"
                                        @on-action-view="onActionView"
                                        @on-action-cancel="onActionCancel"
                                        @on-rating-changed="onBookingRatingChanged($event, item.id)"
                                ></BookingInfoBlock>
                            </div>
                            <b-btn
                                    v-if="!dinesPagination.isLastPage"
                                    class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                                    @click="loadMoreReservations"
                            >
                                <span>Load more</span>
                            </b-btn>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="Meals" :disabled="isLoadingMeals || isLoadingReservations">
                    <div class="tab-content-wrapper">
                        <loading
                                :active.sync="isLoadingOffers"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                                :background-color="loaderOptions.BACKGROUND_COLOR"
                        ></loading>
                        <div v-if="offersPagination.loaded">
                            <p>You have {{offersPagination.total}} meal{{offersPagination.total === 1 ? '' : 's'}}</p>

                            <div class="row">
                                <template v-if="offers && offers.length">
                                    <div class="col-sm-12 col-lg-6 col-xl-4 mb-4" v-for="item in offers" v-bind:key="item.id">
                                        <OfferInfoBlock
                                                :offer-info="item"
                                                :show-action-menu="true"
                                                :actions="offerActions"
                                                :is-my-offer="true"
                                                :hidden-user-block="true"
                                                @on-action-edit="onActionEditOffer"
                                                @on-action-remove="onActionRemoveOffer"
                                        ></OfferInfoBlock>
                                    </div>
                                </template>
                            </div>

                            <b-btn
                                    v-if="!offersPagination.isLastPage"
                                    class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                                    @click="loadMoreOffers"
                            >
                                <span>Load more</span>
                            </b-btn>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
        </div>

        <!-- Modals -->
        <ConfirmModal
                :id="modalMealInfo.id"
                :message="modalMealInfo.msg"
                @confirmed="onModalMealConfirm"
                @canceled="onModalMealCancel"
        ></ConfirmModal>
        <ConfirmModal
                :id="modalDineInfo.id"
                :message="modalDineInfo.msg"
                @confirmed="onModalDineConfirm"
                @canceled="onModalDineCancel"
        ></ConfirmModal>
        <ConfirmModal
                :id="modalOfferInfo.id"
                :message="modalOfferInfo.msg"
                @confirmed="onModalOfferConfirm"
                @canceled="onModalOfferCancel"
        ></ConfirmModal>
    </div>
</template>

<script>
import api from '../../api';
import Loading from 'vue-loading-overlay';
import BookingInfoBlock from '../../components/BookingInfoBlock';
import ConfirmModal from '../../components/modals/ConfirmModal';
import OfferInfoBlock from '../../components/OfferInfoBlock';
import config from "../../config";
import SvgIcon from '../../components/SvgIcon';
export default {
    name: "MyMeals",
    components: {Loading, BookingInfoBlock, ConfirmModal, OfferInfoBlock, SvgIcon},
    data: () => ({
        loaderOptions: { ...config.LOADER_OPTIONS },
        activeTabIndex: 0,
        isLoadingMeals: false,
        isLoadingReservations: false,
        isLoadingOffers: false,
        meals: [],
        reservations: [],
        offers: [],
        mealPagination: {
            total: 0,
            page: 1,
            pageCount: 1,
            loaded: false,
            isLastPage: false
        },
        dinesPagination: {
            total: 0,
            page: 1,
            pageCount: 1,
            loaded: false,
            isLastPage: false
        },
        offersPagination: {
            total: 0,
            page: 1,
            pageCount: 1,
            loaded: false,
            isLastPage: false
        },
        mealToRemove: '',
        modalMealInfo: {
            id: 'confirm-remove-meal',
            msg: 'Are you sure you want to remove this meal?'
        },
        modalDineInfo: {
            id: 'confirm-cancel-reservation',
            msg: 'Are you sure you want to cancel this reservation?'
        },
        modalOfferInfo: {
            id: 'confirm-remove-offer',
            msg: 'Are you sure you want to remove this offer?'
        },
        reservationToRemove: '',
        dineActions: [{ title: 'View', name: 'view' }, { title: 'Cancel', name: 'cancel' }],
        offerActions: [{ title: 'Edit', name: 'edit' }, { title: 'Remove', name: 'remove' }],
        offerToRemove: ''
    }),
    created () {
        const _index = this.$store.getters.myOffersActiveTabIndexOnInit;
        if (_index !== 0) {
            this.$store.commit('myOffersActiveTabIndexOnInit', 0);
            this.$nextTick(() => {
                this.activeTabIndex = _index;
            });
            return;
        }
        this.loadMeals();
    },
    methods: {
        loadMeals () {
            this.isLoadingMeals = true;
            api.dashboard.meals.getMyMeals(this.mealPagination.page)
                .then(result => {
                    if (result && result.data && result.data.length) {
                        this.meals = this.meals.concat(result.data);
                    }
                    this.mealPagination.total = result.total;
                    this.mealPagination.pageCount = result.pageCount;
                    this.mealPagination.isLastPage = result.page === result.pageCount;
                    this.mealPagination.loaded = true;
                    this.isLoadingMeals = false;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isLoadingMeals = false;
                })
        },
        loadMoreMeals () {
            if (this.mealPagination.isLastPage) return;
            this.mealPagination.page++;
            this.$nextTick(() => {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
            });
            this.loadMeals();
        },
        loadReservations () {
            this.isLoadingReservations = true;
            // need to include all bookings, even in past (first argument of `getMyDines` should be false)
            api.dashboard.bookings.getMyDines(false, false, this.dinesPagination.page)
                .then(result => {
                    if (result && result.data && result.data.length) {
                        this.reservations = this.reservations.concat(result.data);
                    }
                    this.dinesPagination.total = result.total;
                    this.dinesPagination.pageCount = result.pageCount;
                    this.dinesPagination.isLastPage = result.page === result.pageCount;
                    this.dinesPagination.loaded = true;
                    this.isLoadingReservations = false;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isLoadingReservations = false;
                })
        },
        loadMoreReservations () {
            if (this.dinesPagination.isLastPage) return;
            this.dinesPagination.page++;
            this.$nextTick(() => {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
            });
            this.loadReservations();
        },
        onTabSwitched (tabIndex) {
            switch (tabIndex) {
                case 0:
                    if (!this.mealPagination.loaded) {
                        return this.loadMeals();
                    }
                    break;
                case 1:
                    if (!this.dinesPagination.loaded) {
                        return this.loadReservations();
                    }
                    break;
                case 2:
                    if (!this.offersPagination.loaded) {
                        return this.loadOffers();
                    }
                    break;
                default:
                    break;
            }
        },
        redirectToEditMealPage (id) {
            if (!id) return;
            this.$router.push({ path: `/dashboard/edit-meal/${id}` });
        },
        removeMeal (id) {
            this.mealToRemove = id;
            this.$bvModal.show(this.modalMealInfo.id);
        },
        onModalMealConfirm () {
            if (!this.mealToRemove) return;
            this.isLoadingMeals = true;
            api.dashboard.meals.removeMyMeal(this.mealToRemove)
                .then(() => {
                    this.meals = this.meals.filter(item => Number(item.id) !== Number(this.mealToRemove));
                    this.mealPagination.total = this.meals.length;
                    this.isLoadingMeals = false;
                    this.mealToRemove = '';
                })
                .catch(err => {
                    // TODO: handle error
                    console.log('\n >> err > ', err);
                    this.isLoadingMeals = false;
                    this.mealToRemove = '';
                })
        },
        onModalMealCancel () {
            this.mealToRemove = '';
        },
        onActionView (id) {
            if (!id) return;
            this.$router.push({ path: `/dashboard/booking/${id}` }).catch(()=>{});
        },
        onActionCancel (id) {
            if (!id) return;
            this.openConfirmCancelReservationModal(id);
        },
        openConfirmCancelReservationModal (id) {
            this.reservationToRemove = id;
            this.$bvModal.show(this.modalDineInfo.id);
        },
        onModalDineConfirm () {
            if (!this.reservationToRemove) return;
            this.isLoadingReservations = true;

            api.dashboard.bookings.deleteDine(this.reservationToRemove)
                .then(() => {
                    this.reservations = this.reservations.filter(item => Number(item.id) !== Number(this.reservationToRemove));
                    this.dinesPagination.total = this.reservations.length;
                    this.reservationToRemove = '';
                    this.isLoadingReservations = false;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.reservationToRemove = '';
                    this.isLoadingReservations = false;
                })
        },
        onModalDineCancel () {
            this.reservationToRemove = '';
        },
        loadOffers () {
            this.isLoadingOffers = true;
            api.dashboard.offers.getMyOffers(false, false, this.offersPagination.page)
                .then(result => {
                    if (result && result.data && result.data.length) {
                        this.offers = this.offers.concat(result.data);
                    }
                    this.offersPagination.total = result.total;
                    this.offersPagination.pageCount = result.pageCount;
                    this.offersPagination.isLastPage = result.page === result.pageCount;
                    this.offersPagination.loaded = true;
                    this.isLoadingOffers = false;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isLoadingOffers = false;
                })
        },
        loadMoreOffers () {
            if (this.offersPagination.isLastPage) return;
            this.offersPagination.page++;
            this.$nextTick(() => {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
            });
            this.loadOffers();
        },
        openConfirmRemoveOfferModal (id) {
            this.offerToRemove = id;
            this.$bvModal.show(this.modalOfferInfo.id);
        },
        onActionRemoveOffer (id) {
            if (!id) return;
            this.openConfirmRemoveOfferModal(id);
        },
        onActionEditOffer (id) {
            if (!id) return;
            this.$router.push({ path: `/dashboard/edit-offer/${id}` }).catch(()=>{});
        },
        onModalOfferCancel () {
            this.offerToRemove = '';
        },
        onModalOfferConfirm () {
            if (!this.offerToRemove) return;
            this.isLoadingOffers = true;

            api.dashboard.offers.removeOffer(this.offerToRemove)
                .then(() => {
                    this.offers = this.offers.filter(item => Number(item.id) !== Number(this.offerToRemove));
                    this.offersPagination.total = this.offers.length;
                    this.offerToRemove = '';
                    this.isLoadingOffers = false;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.offerToRemove = '';
                    this.isLoadingOffers = false;
                })
        },
        showMobileAside () {
            this.$eventHub.$emit('show-mobile-profile-aside');
        },
        hasMealImage (item) {
            if (!item || !item.id) return false;
            const images = item.images;
            if (!images || !images.length) return false;
            return images[0].thumbnail && images[0].thumbnail.length > 0;
        },
        getMealImageThumbnail (item) {
            if (!this.hasMealImage(item)) return '';
            return item.images[0].thumbnail || '';
        },
        shouldShowRatingForm (booking) {
            if (!booking || !booking.id) return false;
            if (!booking.offer || !booking.offer.pickupTime) return false;
            return new Date(booking.offer.pickupTime).getTime() < new Date().getTime();
        },
        onBookingRatingChanged (ratingValue, bookingId) {
            api.dashboard.bookings.changeRating(bookingId, ratingValue)
                .then(result => {
                    this.$eventHub.$emit('booking-rating-saved', bookingId);
                    if (result && result.cook && result.cook.id) {
                        this.$eventHub.$emit('booking-need-to-update-cook-rating', {
                            cookId: result.cook.id,
                            rating: result.cook.rating
                        });
                    }
                })
                .catch(err => {
                    console.log('\nFailed to update rating, error: ', err);
                    this.$eventHub.$emit('booking-rating-failed-saving', bookingId);
                });
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.my-meal-wrapper {
    .my-meal-item {
        background-color: $whiteColor;
        box-shadow: 0 4px 16px rgba(69,53,38,0.15);
        margin-bottom: 16px;
        display: block;
        font-family: $FilsonProRegular;
        &:last-child {
            margin-bottom: 0;
        }
        &:hover {
            box-shadow: 0 6px 18px  rgba(69,53,38,0.30);
        }
        @media screen and (max-width: $phoneWidth) {
            padding: 12px;
            margin-bottom: 12px;
        }

        .my-meal-item-info {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;

            .my-meal-item-img-wrapper {
                flex: none;
                img {
                    width: 64px;
                    height: 64px;
                    object-fit: cover;
                    border-radius: 2px;
                    @media screen and (max-width: $tableMinWidth) {
                        width: 48px;
                        height: 48px;
                    }
                    @media screen and (max-width: $phoneBigWidth) {
                        width: 44px;
                        height: 44px;
                    }
                }
            }
            .my-meal-title-wrapper {
                width: 100%;
                margin-right: 5px;
                align-self: center;

                .my-meal-title {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;

                    .title-size3 {
                        font-family: $LacaProSemiBold;
                        letter-spacing: 0;
                    }
                }
            }
        }
    }
}
.tab-content-wrapper {
    min-height: 300px;
    width: 100%;
    position: relative;
}
</style>
