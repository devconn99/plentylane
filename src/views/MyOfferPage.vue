<template>
    <div v-if="isLoaded && offerInfo && offerInfo.id">
        <OfferPageContent
                :offer-info="offerInfo"
                :more-offers="[]"
                :questions="questions"
                :hidden-buttons="true"
        ></OfferPageContent>
    </div>
</template>

<script>
import api from '../api';
import helpers from '../helpers';
import OfferPageContent from '../components/OfferPageContent';
export default {
    name: "MyOfferPage",
    components: {OfferPageContent},
    data: () => ({
        offerId: '',
        offerInfo: {},
        isLoaded: false,
        questions: [],
        currentUser: {}
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
            // no need to clear this.currentUser
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
            const requests = [
                api.dashboard.offers.getMyOfferById(this.offerId),
                api.dashboard.offers.getOfferQuestions(this.offerId)
            ];
            if (!this.currentUser || !this.currentUser.id) {
                const _user = this.$store.getters.userInfo;
                if (_user && _user.id) {
                    this.currentUser = { ..._user };
                } else {
                    // need to load current user data
                    requests.push(api.dashboard.userInfo());
                }
            }
            Promise.all(requests)
                .then(result => {
                    if (result && result[0]) {
                        // offer info
                        const offer = result[0];
                        if (offer.meal && offer.meal.dietaryNotes && offer.meal.dietaryNotes.length) {
                            offer.meal.dietaryNotes = helpers.retrieveDietaryNotes(offer.meal.dietaryNotes);
                        }
                        // NOTE, offer response doesn't have user data here (/api/me/offers/${id})
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
                    if (result && result[2]) {
                        const user = { ...result[2] };
                        this.currentUser = { ...user };
                        this.$store.commit('userInfo', { ...user });
                        this.offerInfo['user'] = { ...user };
                    } else {
                        this.offerInfo['user'] = { ...this.currentUser };
                    }
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                    if (cb) cb();
                    return true;
                })
                .catch(err => {
                    this.errLoadingDataHandler(cb, err);
                })
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

<style scoped>

</style>
