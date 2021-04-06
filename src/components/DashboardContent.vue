<template>
    <div class="dashboard-content">
        <div class="container-fluid">
            <!-- TODO: refactor navigation, check other elements. -->
            <div class="row pad-70b">
                <div class="col-lg-6 mb-5 mb-lg-0">
                    <div class="order padr-25">
                        <div class="dashboard-title-box mb-3">
                            <div class="title-size3 titleGreenNavyColor">I want to:</div>
                        </div>

                        <div class="box-btn">
                            <router-link
                                    :to="{ path: '/dashboard/eat' }"
                                    tag="button"
                                    class="btnLightGreen btnHugeSize btn100 hover-slide-left mb-3"
                            >
                                <span>
                                    <SvgIcon icon="eat" :params="{ fill: '#FEF8E6' }"></SvgIcon>
                                    Eat
                                </span>
                            </router-link>
                            <router-link
                                    :to="{ path: '/dashboard/cook' }"
                                    tag="button"
                                    class="btnGreen btnHugeSize btn100 hover-slide-left"
                            >
                                <span>
                                    <SvgIcon icon="cook" :params="{ fill: '#FEF8E6' }"></SvgIcon>
                                    Cook
                                </span>
                            </router-link>
                        </div>
                    </div>
                </div>
                <!-- notifications are not included in MVP -->
                <!--
                <div class="col-lg-6">
                    <div class="notification padl-25">
                        <div class="dashboard-title-box mb-3">
                            <div class="title-size3 titleGreenNavyColor mb-3">Notifications</div>
                        </div>
                        <NotificationsContent tempVisibleItems="3" @on-show-messages="showMessagesModal"></NotificationsContent>
                    </div>
                </div>
                -->
            </div>
            <div class="row pad-70b">
                <div class="col-lg-6 mb-5 mb-lg-0">
                    <div class="reserved padr-25">
                        <div class="dashboard-title-box mb-3">
                            <div class="title-additional mb-1">Get ready to feast!</div>
                            <div class="title-size3 titleGreenNavyColor">Meals you’ve reserved</div>
                        </div>

                        <template v-if="isLoaded && bookings && bookings.length">
                            <BookingInfoBlock
                                    v-for="(item, index) in bookings"
                                    :booking-info="item"
                                    :is-small="index > 0"
                            ></BookingInfoBlock>
                        </template>

                        <template v-else>
                            <div class="reserved-box empty">
                                <div class="reserved-title-empty">No reserved meals</div>
                                <div class="reserved-img-empty">
                                    <img src="../assets/images/dashboard/home/empty-posted.svg" alt=""
                                         class="img-fluid">
                                </div>
                                <div class="box-btn w100">
                                    <!-- TODO: use correct path to the page -->
                                    <router-link
                                            :to="{ path: '/dashboard/eat' }"
                                            tag="button"
                                            class="btnGreenTransparent btnBigSize btn100 text-uppercase hover-slide-left"
                                    >
                                        <span>LET’S GET RESERVING!</span>
                                    </router-link>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="reserved padl-25">
                        <div class="dashboard-title-box mb-3 ">
                            <div class="title-additional mb-1">Waiting for hungry neighbors!</div>
                            <div class="title-size3 titleGreenNavyColor">Meals you’ve posted</div>
                        </div>

                        <template v-if="isLoaded && myOffers && myOffers.length">
                            <MyMealInfo v-for="item in myOffers" :item-data="item" :is-my-meal="true"></MyMealInfo>
                        </template>

                        <template v-else>
                            <div class="reserved-box empty">
                                <div class="reserved-title-empty">No posted meals</div>
                                <div class="reserved-img-empty">
                                    <img src="../assets/images/dashboard/home/empty-posted.svg" alt=""
                                         class="img-fluid">
                                </div>
                                <div class="box-btn w100">
                                    <router-link
                                            :to="{ path: '/dashboard/cook' }"
                                            tag="button"
                                            class="btnGreenTransparent btnBigSize btn100 text-uppercase hover-slide-left"
                                    >
                                        <span>LET’S GET COOKING!</span>
                                    </router-link>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <div class="row" v-if="offers && offers.length">
                <div class="col-12">
                    <div class="dashboard-title-box mb-3">
                        <div class="title-additional mb-1">Hungry?</div>
                        <div class="title-size3 titleGreenNavyColor">Reserve a Meal</div>
                    </div>

                    <div class="carousel-reserved" v-if="isLoaded && offers && offers.length">
                        <CarouselContainer>
                            <OfferInfoBlock v-for="item in offers" :offer-info="item"></OfferInfoBlock>
                        </CarouselContainer>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <!-- TODO: import MessagesModal component if it's needed to be shown -->
        <!-- <MessagesModal :user-name="modalDataUserName" @on-hidden="onMessagesModalHidden"></MessagesModal> -->
    </div>
</template>

<script>
import SvgIcon from './SvgIcon';
import api from '../api';
import OfferInfoBlock from './OfferInfoBlock';
import BookingInfoBlock from './BookingInfoBlock';
import MyMealInfo from './MyMealInfo';
import CarouselContainer from './CarouselContainer';
export default {
    name: "DashboardContent",
    components: {SvgIcon, OfferInfoBlock, BookingInfoBlock, MyMealInfo, CarouselContainer},
    data: () => ({
        offers: [],
        bookings: [],
        myOffers: [],
        isLoaded: false,
        userId: '',
        modalDataUserName: ''
    }),
    mounted () {
        this.userId = localStorage.getItem('plUserId') || this.$store.getters.userId || '';
        this.loadOffers();
    },
    methods: {
        hideGlobalLoader () {
            if (this.$loader && this.$loader.hide) {
                this.$loader.hide();
            }
        },
        loadOffers () {
            this.isLoaded = false;
            const requests = [
                api.dashboard.offers.getAvailableOffers(this.userId),
                api.dashboard.bookings.getMyDines(true),
                api.dashboard.offers.getMyOffers(true)
            ];
            const dataKeys = ['offers', 'bookings', 'myOffers'];

            Promise.all(requests)
                .then(responses => {
                    responses.map((response, index) => {
                        this[dataKeys[index]] = response.data || [];
                    });
                    return true;
                })
                .then(() => {
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                })
                .catch(error => {
                    console.log('\n >> error > ', error);
                    this.isLoaded = true;
                    this.hideGlobalLoader();
                });
        },
        /*
        showMessagesModal (data) {
            // TODO: open a modal with messages only
            this.modalDataUserName = helpers.userNameWithShortLastName(data);
            this.$bvModal.show('messages-modal');
        },
        onMessagesModalHidden () {
            this.modalDataUserName = '';
        }
        */
    }
}
</script>

<style scoped lang="scss">

</style>
