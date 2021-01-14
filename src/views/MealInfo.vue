<template>
    <div class="meal-info-page">
        <div v-if="isLoaded">

        </div>
        <div v-if="errLoadingOffer" class="text-danger">Sorry, but we can't load offer info. Please try again later.</div>
    </div>
</template>

<script>
import api from '../api';
export default {
    name: "MealInfo",
    data: () => ({
        mealId: '',
        mealUuid: '',
        offerId: '',
        offerUuid: '',
        isLoaded: false,
        errLoadingOffer: false,
        testUuid: '',
        userInfo: {},
        tempOfferInfo: {
            id: 10,
            mealId: 18,
            pickupTime: "2021-01-25T13:01:00.000Z",
            placeId: 5,
            quantity: 33,
            userId: 2,
            uuid: "05fd16fb-19e9-454c-a934-55f8dd07a1e9"
        }
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const { uuid = '' } = vm.$route.params;
            vm.offerUuid = uuid;
            vm.getOfferInfo();
        });
    },
    created () {
    },
    methods: {
        getOfferInfo () {
            if (!this.offerUuid) {
                this.errLoadingOffer = true;
                return;
            }
            api.dashboard.offers.getOfferByUuid(this.offerUuid)
                .then(offer => {
                    console.log('\n >> offer > ', offer);
                    this.isLoaded = true;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.errLoadingOffer = true;
                })
        }
    }
}
</script>

<style scoped lang="scss">

</style>
