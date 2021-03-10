<template>
    <div v-if="isLoaded && offerInfo && offerInfo.id">
        <OfferPageContent
                :offer-info="offerInfo"
                :should-load-more-offers="true"
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
        isLoaded: false
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
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                    if (cb) cb();
                    return true;
                })
                .catch(error => {
                    this.errLoadingDataHandler(cb, error);
                });
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
