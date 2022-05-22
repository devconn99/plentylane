<template>
  <div class="booking-page" v-if="isLoaded">
    <template v-if="bookingInfo && bookingInfo.id && offerInfo && offerInfo.id">
      <OfferPageContent
        :offer-info="offerInfo"
        :booking-id="bookingInfo.id"
        :is-meal-reserved-on-init="true"
        :booked-servings-num="bookingInfo.servings"
        :should-load-more-offers="true"
        :should-allow-ask-question="true"
        :rating="rating"
      ></OfferPageContent>
    </template>
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
    rating: null,
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
    },
    hideGlobalLoader () {
      if (this.$loader && this.$loader.hide) {
        setTimeout(() => {
          this.$loader.hide()
        }, 0);
      }
    },
    errLoadingDataHandler (cb, err) {
      if (err && err.data && err.data.statusCode === 404) {
        this.isLoaded = true;
        this.bookingInfo = null;
        this.offerInfo = null;
        this.hideGlobalLoader();
        if (cb) cb();
        return this.$router.push({ path: '/dashboard/not-found' }).catch(() => {});
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
      if (isNaN(this.bookingId)) {
        this.errLoadingDataHandler(cb, { data: { statusCode: 404 } });
        return;
      }
      api.dashboard.bookings.getBookingInfo(this.bookingId)
        .then(result => {
          this.bookingInfo = result;
          const _offerId = this.bookingInfo.offerId || this.bookingInfo.offer.id;
          return api.dashboard.offers.getOfferById(_offerId);
        })
        .then((offerInfo) => {
          if (offerInfo) {
              if (offerInfo.meal && offerInfo.meal.dietaryNotes && offerInfo.meal.dietaryNotes.length) {
                offerInfo.meal.dietaryNotes = helpers.retrieveDietaryNotes(offerInfo.meal.dietaryNotes);
              }
              this.offerInfo = { ...offerInfo };
              const id = offerInfo.user?.id;
              if(id) {
                api.ratings.getRatingByUserId(id).then(res=>{
                  this.rating = res;
                })
              }
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
