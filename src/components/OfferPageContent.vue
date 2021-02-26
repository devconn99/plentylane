<template>
    <div v-if="offerInfo && offerInfo.id">
        <div class="dashboard-hero hero-img-overlay" :style="{ backgroundImage: 'url(' + imageUrl + ')' }">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleLightColor mb-2">{{offerInfo.meal.name}}</div>
                        <router-link
                                class="cook-box"
                                :to="{ path: '/dashboard/cook-profile/' + offerInfo.user.id }"
                                v-if="offerInfo.user && offerInfo.user.id"
                        >
                            <div class="cook-info justify-content-center">
                                <div class="cook-info-img">
                                    <template v-if="offerInfo.user.image && offerInfo.user.image.thumbnail && offerInfo.user.image.thumbnail.length">
                                        <img :src="offerInfo.user.image.thumbnail" alt="" class="img-fluid">
                                    </template>
                                    <template v-else>
                                        <i class="fas fa-user-circle icon-placeholder"></i>
                                    </template>
                                </div>
                                <div class="cook-info-part">
                                    <div class="cook-info-name titleLightColor mr-2">{{userName}}</div>
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
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            <HeroWave></HeroWave>
        </div>

        <div class="dashboard-content">
            <div class="container-fluid">
                <div class="row mb-5">
                    <div class="col-lg-4 order-lg-2 mb-5 mb-lg-0">
                        <!-- TODO: I'm hiding this block if current user owns this order. I'll check it later -->
                        <div class="box-btn mb-4" v-if="!hiddenButtons">
                            <b-btn
                                    class="btnGreen btnBigSize btn100 text-uppercase hover-slide-left mb-4"
                                    v-if="offerInfo.availableQuantity > 0 && !wasReserved"
                                    @click="showReserveMealModal"
                            >
                                <span>Reserve Meal</span>
                            </b-btn>
                            <div class="meal-reserved-info w-100 mb-4" v-if="wasReserved">Meal Reserved!</div>
                            <b-btn class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mb-4" @click="showContactCookModal">
                                <span>Contact cook</span>
                            </b-btn>
                            <b-btn
                                    class="btnNavyRedTransparent btnNormalSize btn100 hover-slide-left"
                                    v-if="wasReserved"
                                    @click="openConfirmCancelReservation"
                            >
                                <span>Cancel reservation</span>
                            </b-btn>
                        </div>

                        <div class="cook-box">
                            <div class="cook-info-additional">
                                <div class="serving-number mt-1">
                                    <span class="mr-2">{{offerInfo.availableQuantity}}</span> of {{offerInfo.quantity}} servings available
                                </div>
                                <div class="cook-time mt-2">
                                    <SvgIcon icon="clock"></SvgIcon>
                                    <span class="ml-2">{{readyTimeStr}}</span>
                                </div>
                                <div class="cook-location mt-2">
                                    <SvgIcon icon="location"></SvgIcon>
                                    <span class="ml-2">{{offerInfo.place.address}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8 order-lg-1">
                        <div class="dashboard-title-box mb-4">
                            <div class="title-size3 titleGreenNavyColor">About this meal</div>
                        </div>
                        <div class="dashboard-text" v-if="offerInfo.meal.description && offerInfo.meal.description.length">
                            <p>{{offerInfo.meal.description}}</p>
                        </div>

                        <template v-if="offerInfo.meal.dietaryNotes && offerInfo.meal.dietaryNotes.length">
                            <div class="dashboard-title-box mb-3 mt-5">
                                <div class="title-size3 titleGreenNavyColor">Dietary Notes</div>
                            </div>
                            <div class="dashboard-text">
                                <ul class="list-style-circle">
                                    <li v-for="note in offerInfo.meal.dietaryNotes">{{note.text}}</li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- TODO: temp questions are displayed -->
                <div class="row mb-5" v-if="questions && questions.length">
                    <div class="col-md-12">
                        <div class="dashboard-title-box mb-3">
                            <div class="title-size3 titleGreenNavyColor">{{questions.length}} Questions</div>
                        </div>
                        <div class="questions">
                            <div class="questions-box" v-for="item in questions">
                                <div class="row">
                                    <div class="col-sm-4 mb-2 mb-sm-0">
                                        <div class="questions-box-author">
                                            <div class="questions-box-author-img mr-2 mr-xl-3">
                                                <img :src="item.from.img" alt="" class="img-fluid">
                                            </div>
                                            <div class="questions-box-author-title">
                                                {{ item.from.name }}
                                                <span>{{item.date}}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-8">
                                        <div class="questions-box-text">
                                            <p class="question mb-1">Q: {{item.questionText}}</p>
                                            <p>{{offerInfo.user.firstName}}: {{item.answer}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row" v-if="moreOffers && moreOffers.length">
                    <div class="col-12">
                        <div class="reserved">
                            <div class="dashboard-title-box mb-3 ">
                                <div class="title-size3 titleGreenNavyColor mb-3">More from {{userName}}</div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="carousel-reserved">
                            <CarouselContainer>
                                <OfferInfoBlock v-for="item in moreOffers" :offer-info="item"></OfferInfoBlock>
                            </CarouselContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <ReserveMealModal :offer-info="{ ...this.offerInfo }" @onReserved="onReserved"></ReserveMealModal>
        <ContactCookModal :cook-id="this.offerInfo.user.id" :offer-id="this.offerInfo.id"></ContactCookModal>
        <ConfirmModal :id="modalId" :message="confirmCancelReservationMsg" @confirmed="onConfirmedCancelReservation"></ConfirmModal>
    </div>
</template>

<script>
import api from '../api';
import helpers from '../helpers';
import ReserveMealModal from './modals/ReserveMealModal';
import ContactCookModal from './modals/ContactCookModal';
import HeroWave from './HeroWave';
import CarouselContainer from './CarouselContainer';
import OfferInfoBlock from './OfferInfoBlock';
import SvgIcon from './SvgIcon';
import ConfirmModal from './modals/ConfirmModal';
export default {
    name: "OfferPageContent",
    components: {ReserveMealModal, ContactCookModal, HeroWave, CarouselContainer, OfferInfoBlock, SvgIcon, ConfirmModal},
    props: ['offerInfo', 'hiddenButtons', 'isMealReservedOnInit', 'questions', 'moreOffers', 'bookingId', 'bookedServingsNum'],
    data: () => ({
        // TODO: temp image url
        imageUrl: "https://cdn.pixabay.com/photo/2017/09/28/18/13/bread-2796393_960_720.jpg",
        wasReserved: false,
        reservationId: '',
        numberOfServingsReserved: 0,
        confirmCancelReservationMsg: 'Are you sure you want to cancel reservation?',
        modalId: 'confirm-cancel-reservation'
    }),
    methods: {
        showReserveMealModal () {
            this.$bvModal.show('reserve-meal-modal');
        },
        showContactCookModal () {
            this.$bvModal.show('contact-cook-modal');
        },
        onReserved (id, numOfServings) {
            this.wasReserved = true;
            this.reservationId = id;
            this.numberOfServingsReserved = numOfServings;
            if (this.offerInfo['availableQuantity']) {
                this.offerInfo['availableQuantity'] -= this.numberOfServingsReserved;
            }
        },
        openConfirmCancelReservation () {
            this.$bvModal.show(this.modalId);
        },
        onConfirmedCancelReservation () {
            api.dashboard.bookings.deleteDine(this.reservationId)
                .then(() => {
                    this.offerInfo['availableQuantity'] += this.numberOfServingsReserved;
                    this.wasReserved = false;
                    this.reservationId = '';
                    this.numberOfServingsReserved = 0;
                })
                .catch(err => {
                    console.log('\n >> err cancel reservation:', err);
                })
        }
    },
    computed: {
        userName: function () {
            return helpers.userNameWithShortLastName(this.offerInfo['user']);
        },
        readyTimeStr: function () {
            if (!this.offerInfo || !this.offerInfo.pickupTime) return '';
            return `Ready at ${helpers.parseDate(this.offerInfo.pickupTime, true)}`;
        }
    },
    created () {
        if (this.isMealReservedOnInit) {
            this.wasReserved = true;
        }
        if (this.bookingId) {
            this.reservationId = this.bookingId;
        }
        if (this.bookedServingsNum) {
            this.numberOfServingsReserved = this.bookedServingsNum;
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.meal-reserved-info {
    height: 64px;
    background-color: $yellowColor;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $textBlackColor;
    font-family: $LacaProSemiBold;
    font-size: 22px;
    letter-spacing: 1.15px;
    line-height: 26px;
    text-transform: uppercase;
}
</style>
