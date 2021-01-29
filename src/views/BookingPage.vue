<template>
    <div class="booking-page" v-if="isLoaded">
        <template v-if="bookingInfo && bookingInfo.id && offerInfo && offerInfo.id">
            <OfferPageContent
                    :offer-info="offerInfo"
                    :booking-id="bookingInfo.id"
                    :is-meal-reserved-on-init="true"
                    :booked-servings-num="bookingInfo.servings"
                    :questions="questions"
                    :more-offers="moreOffers"
            ></OfferPageContent>
        </template>
        <!-- temp 404 error block -->
        <!-- TODO: move to separate component -->
        <div class="booking-page-not-found" v-if="showPageNotFoundError">
            <p class="title-size1">404 error:</p>
            <p class="title-size2">page is not found.</p>
            <router-link
                    :to="{ path: '/dashboard' }"
                    tag="button"
                    class="btnLightGreen btnHugeSize hover-slide-left mb-3"
            >
                <span>Go to dashboard</span>
            </router-link>
        </div>
    </div>
</template>

<script>
import api from '../api';
import helpers from '../helpers';
import OfferPageContent from '../components/OfferPageContent';
export default {
    name: "BookingPage",
    components: {OfferPageContent},
    data: () => ({
        isLoaded: false,
        bookingId: '',
        bookingInfo: null,
        offerInfo: null,
        isBookingCanceled: false,
        showPageNotFoundError: false
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.clearData();
            const { id = '' } = vm.$route.params;
            vm.bookingId = id;
            vm.loadPageData();
        })
    },
    beforeRouteUpdate (to, from, next) {
        const _loading = this.$loading.show();
        this.clearData();
        const { id = '' } = to.params;
        this.bookingId = id;
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
            this.bookingInfo = null;
            this.offerInfo = null;
            this.isBookingCanceled = false;
            this.showPageNotFoundError = false;
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
                    this.showPageNotFoundError = true;
                    this.isLoaded = true;
                    this.bookingInfo = null;
                    this.offerInfo = null;
                } else {
                    console.log('\n >> err loading booking/offer info:', err);
                }
            }
            this.isLoaded = true;
            this.hideGlobalLoader();
            if (cb) cb();
        },
        loadPageData (cb) {
            if (!this.bookingId) {
                this.errLoadingDataHandler(cb);
                return;
            }
            const offerRequests = [];
            api.dashboard.bookings.getBookingInfo(this.bookingId)
                .then(result => {
                    this.bookingInfo = result;
                    const _offerId = this.bookingInfo.offerId || this.bookingInfo.offer.id;
                    const _cookId = this.bookingInfo.cookId || this.bookingInfo.cook.id;

                    offerRequests.push(api.dashboard.offers.getOfferById(_offerId));
                    offerRequests.push(api.dashboard.offers.getOfferQuestions(_offerId));
                    offerRequests.push(api.dashboard.offers.getAvailableOffersFromUser(_cookId, _offerId));
                    return Promise.all(offerRequests);
                })
                .then((result) => {
                    if (!result || !result.length) {
                        this.isLoaded = true;
                        this.hideGlobalLoader();
                        if (cb) cb();
                        return true;
                    }
                    if (result[0]) {
                        const offer = result[0];
                        if (offer.meal && offer.meal.dietaryNotes && offer.meal.dietaryNotes.length) {
                            offer.meal.dietaryNotes = helpers.retrieveDietaryNotes(offer.meal.dietaryNotes);
                        }
                        this.offerInfo = { ...offer };
                    }
                    if (result[1] && result[1].length) {
                        // transform questions, temp
                        this.questions = result[1].map(item => {
                            const _date = new Date(item.date);
                            item.date = `${_date.toLocaleDateString('en', { month: 'short' })} ${_date.getUTCDate()}`;
                            return item;
                        });
                    }
                    if (result[2] && result[2].data && result[2].data.length) {
                        this.moreOffers = result[2].data;
                    }
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                    if (cb) cb();
                })
                .catch(err => {
                    this.errLoadingDataHandler(cb, err);
                });
        }
    }
}
</script>

<style scoped lang="scss">
.booking-page {
    .booking-page-not-found {
        display: flex;
        flex-direction: column;
        max-width: 400px;
        justify-content: center;
        align-items: center;
        margin: 60px auto;

        .booking-page-not-found-text {

        }
        button {
            margin-top: 40px;
        }
    }
}
</style>
