<template>
    <div v-if="isLoaded && offerInfo && offerInfo.id">
        <OfferPageContent
                :offer-info="offerInfo"
                :more-offers="moreOffers"
                :questions="questions"
                :should-allow-ask-question="true"
        ></OfferPageContent>
    </div>
</template>

<script>
import api from '../api';
import helpers from '../helpers';
import OfferPageContent from '../components/OfferPageContent';
export default {
    name: "OfferPage",
    components: {OfferPageContent},
    data: () => ({
        offerId: '',
        offerInfo: {},
        isLoaded: false,
        questions: [],
        moreOffers: []
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.clearData();
            const { id = '' } = vm.$route.params;
            vm.offerId = id;
            vm.loadPageData();
        })
    },
    beforeRouteUpdate (to, from, next) {
        const _loading = this.$loading.show();
        this.clearData();
        const { id = '' } = to.params;
        this.offerId = id;
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
            this.offerInfo = {};
            this.offerId = '';
            this.questions = [];
            this.moreOffers = [];
        },
        errLoadingDataHandler (cb, err) {
            if (err) {
                if (err.data && err.data.statusCode === 404) {
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                    if (cb) cb();
                    return this.$router.push({ path: '/dashboard/not-found' }).catch(() => {});
                }
            }
            this.isLoaded = true;
            this.hideGlobalLoader();
            if (cb) cb();
        },
        loadPageData (cb) {
            if (!this.offerId) {
                this.errLoadingDataHandler(cb);
                return;
            }
            if (isNaN(this.offerId)) {
                this.errLoadingDataHandler(cb, { data: { statusCode: 404 } });
                return;
            }
            api.dashboard.offers.getOfferById(this.offerId)
                .then(offer => {
                    if (offer.meal && offer.meal.dietaryNotes && offer.meal.dietaryNotes.length) {
                        offer.meal.dietaryNotes = helpers.retrieveDietaryNotes(offer.meal.dietaryNotes);
                    }
                    this.offerInfo = { ...offer };
                    // TODO: maybe it's better to move loading more offers from same user to the OfferPageContent component?
                    return api.dashboard.offers.getAvailableOffersFromUser(this.offerInfo.user.id, this.offerId);
                })
                .then(offersResponse => {
                    if (offersResponse && offersResponse.data) {
                        this.moreOffers = offersResponse.data;
                    }
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                    if (cb) cb();
                    return true;
                })
                .catch(error => {
                    this.errLoadingDataHandler(cb, error);
                });

            /*
            const requests = [
                api.dashboard.offers.getOfferById(this.offerId),
                api.dashboard.meals.getMyMealQuestions(this.offerId)
            ];
            Promise.all(requests)
                .then(result => {
                    if (result && result[0]) {
                        // offer info
                        const offer = result[0];
                        if (offer.meal && offer.meal.dietaryNotes && offer.meal.dietaryNotes.length) {
                            offer.meal.dietaryNotes = helpers.retrieveDietaryNotes(offer.meal.dietaryNotes);
                        }
                        this.offerInfo = { ...offer };
                    }
                    if (result && result[1] && result[1].length) {
                        // transform questions, temp
                        this.questions = result[1].map(item => {
                            const _date = new Date(item.date);
                            item.date = `${_date.toLocaleDateString('en', { month: 'short' })} ${_date.getUTCDate()}`;
                            return item;
                        });
                    }
                    return true;
                })
                .then(() => {
                    // load more offers
                    return api.dashboard.offers.getAvailableOffersFromUser(this.offerInfo.user.id, this.offerId)
                        .then(res => {
                            if (res && res.data) {
                                this.moreOffers = res.data;
                            }
                            this.isLoaded = true;
                            this.hideGlobalLoader();
                            if (cb) cb();
                            return true;
                        })
                        .catch(error => {
                            this.errLoadingDataHandler(cb, error);
                        });
                })
                .catch(err => {
                    this.errLoadingDataHandler(cb, err);
                })
            */
        },
        hideGlobalLoader () {
            if (this.$loader && this.$loader.hide) {
                setTimeout(() => {
                    this.$loader.hide()
                }, 0);
            }
        }
    }
}
</script>

<style scoped lang="scss"></style>
