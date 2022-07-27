<template>
  <div v-if="offerInfo && offerInfo.id">
    <b-alert
      @dismiss-count-down="countDownChanged"
      @dismissed="alert.show = 0"
      :show="alert.show"
      :variant="alert.variant"
      dismissible
      fade
      class="d-alert"
    >
      <p>{{ alert.msg }}</p>
    </b-alert>
    <div
      class="dashboard-hero hero-img-overlay offer-page-content-header"
      :style="{ backgroundImage: 'url(' + getHeaderBgImageUrl() + ')' }"
    >
      <loading
        :active.sync="isProcessing"
        :is-full-page="loaderOptions.IS_FULL_PAGE"
        :color="loaderOptions.COLOR"
        :background-color="loaderOptions.BACKGROUND_COLOR"
      />
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 text-center">
            <div class="title-size1 titleLightColor mb-2">
              {{ offerInfo.meal.name }}
            </div>
            <div class="cook-box">
              <div class="cook-info justify-content-center">
                <router-link
                  :to="{ path: '/dashboard/cook-profile/' + offerInfo.user.id }"
                  v-if="offerInfo.user && offerInfo.user.id"
                  class="d-flex"
                >
                  <div class="cook-info-img">
                    <template v-if="offerInfo.user.image && offerInfo.user.image.thumbnail && offerInfo.user.image.thumbnail.length">
                      <img
                        :src="offerInfo.user.image.thumbnail"
                        alt=""
                        class="img-fluid"
                      />
                    </template>
                    <template v-else>
                      <i class="fas fa-user-circle icon-placeholder"></i>
                    </template>
                  </div>
                  <div class="cook-info-part">
                    <div class="cook-info-name titleLightColor mr-2">
                      {{ offerInfo.user.username }}
                    </div>
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
                      <UserRating :rating="cookRating || offerInfo.user.rating" />
                    </div>
                  </div>
                </router-link>
              </div>
              <!-- <div class="cook-info justify-content-center" v-if="rating && rating.status=='opened'">
                <router-link :to="{ path: '/profile-rating/' + rating.uuid }">
                  Rate it
                </router-link>
              </div> -->
            </div>
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
                v-if="offerInfo.availableQuantity > 0 && !wasReserved && isAbleToReserve"
                @click="showReserveMealModal"
              >
                <span>Reserve Meal</span>
              </b-btn>

              <b-btn
                class="btnCGRed btnNormalSize btn100 text-uppercase hover-slide-left mb-4"
                style="width: 100%"
                v-else-if="isAbleToReserve === false"
                @click="openAddToNetworkDialog"
              >
                <span class="d-block pb-2 pt-3">
                  Add to Network
                  <p class="text-lowercase">to reserve a meal</p>
                </span>
              </b-btn>

              <div class="meal-reserved-info w-100 mb-4" v-if="wasReserved">
                Meal Reserved!
              </div>
              <b-btn
                class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mb-4"
                @click="showContactCookModal"
              >
                <span class="d-block pb-2 pt-3">
                  Contact cook
                  <p>(Private message)</p>
                </span>
              </b-btn>
              <b-btn
                class="btnNavyRedTransparent btnNormalSize btn100 hover-slide-left"
                v-if="wasReserved"
                @click="openConfirmCancelReservation"
              >
                <span>Cancel reservation</span>
              </b-btn>
            </div>

            <div class="box-btn d-flex mb-4" v-else>
              <b-btn
                class="btnGreen btnBigSize btn50 text-uppercase hover-slide-left mb-4"
                @click="redirectToEditMealPage(offerInfo.mealId)"
              >
                <span>Update</span>
              </b-btn>
              <b-btn
                class="btnGreen btnBigSize btn50 text-uppercase hover-slide-left mb-4 ml-2"
                @click="removeMeal"
              >
                <span>Cancel</span>
              </b-btn>
            </div>

            <div class="cook-box">
              <div class="cook-info-additional">
                <div class="serving-number mt-1">
                  <span class="mr-2">{{ offerInfo.availableQuantity }}</span> of
                  {{ offerInfo.quantity }} servings available
                </div>
                <div class="cook-time mt-2">
                  <SvgIcon icon="clock"></SvgIcon>
                  <span class="ml-2">{{ readyTimeStr }}</span>
                </div>
                <!-- address is visible only if it's my offer or if user've just reserved this meal for privacy concerns  -->
                <div v-if="isMyOffer || wasReserved" class="cook-location mt-2">
                  <SvgIcon icon="location"></SvgIcon>
                  <span class="ml-2">{{ offerInfo.place.address }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8 order-lg-1">
            <div class="dashboard-title-box mb-4">
              <div class="title-size3 titleGreenNavyColor">About this meal</div>
            </div>
            <div
              class="dashboard-text"
              v-if="offerInfo.meal.description && offerInfo.meal.description.length"
            >
              <p>{{ offerInfo.meal.description }}</p>
            </div>

            <template v-if="offerInfo.meal.dietaryNotes && offerInfo.meal.dietaryNotes.length">
              <div class="dashboard-title-box mb-3 mt-5">
                <div class="title-size3 titleGreenNavyColor">Dietary Notes</div>
              </div>
              <div class="dashboard-text">
                <ul class="list-style-circle">
                  <li
                    v-for="(note,i) in offerInfo.meal.dietaryNotes"
                    :key="i"
                  >
                    {{ note.text }}
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>

        <div
          class="row mb-5 meal-questions-row"
          v-bind:class="{ 'is-loading': isLoadingMealQuestions }"
        >
          <loading
            :active.sync="isLoadingMealQuestions"
            :is-full-page="loaderOptions.IS_FULL_PAGE"
            :color="loaderOptions.COLOR"
            :background-color="loaderOptions.BACKGROUND_COLOR"
          ></loading>
          <template v-if="mealQuestions && mealQuestions.length">
            <div class="col-md-12">
              <div class="dashboard-title-box mb-3">
                <div class="title-size3 titleGreenNavyColor">
                  {{ mealQuestions.length }} Question{{
                    mealQuestions.length !== 1 ? "s" : ""
                  }}
                </div>
              </div>
              <div class="questions">
                <div
                  class="questions-box"
                  v-for="(item,i) in mealQuestions"
                  :key="i"
                >
                  <div class="row">
                    <div class="col-sm-4 mb-2 mb-sm-0">
                      <div class="questions-box-author">
                        <template v-if="item.askedBy && item.askedBy.image && item.askedBy.image.thumbnail && item.askedBy.image.thumbnail.length">
                          <div class="questions-box-author-img mr-2 mr-xl-3">
                            <img
                              :src="item.askedBy.image.thumbnail"
                              alt=""
                              class="img-fluid"
                            />
                          </div>
                        </template>
                        <template v-else>
                          <div class="questions-box-author-img-placeholder mr-2 mr-xl-3">
                            <i class="fas fa-user-circle user-icon"></i>
                          </div>
                        </template>
                        <div class="questions-box-author-title">
                          <span class="username">
                            <template v-if="item.askedBy && item.askedBy.username">
                              {{ item.askedBy.username }}
                            </template>
                            <template v-else>User-{{ item.askedById }}</template>
                          </span>
                          <span v-if="item.createdAtDisplayDate">
                            {{ item.createdAtDisplayDate }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-8">
                      <div class="questions-box-text">
                        <p class="question mb-1">Q: {{ item.question }}</p>
                        <template v-if="isMyOffer">
                          <template v-if="item.answer && item.answer.length">
                            <p>You: {{ item.answer }}</p>
                          </template>
                          <template v-else>
                            <b-btn
                              class="btnGreenTransparent btnSmallSize hover-slide-left"
                              @click="showModalToAnswerQuestion(item)"
                            >
                              <span>Answer</span>
                            </b-btn>
                          </template>
                        </template>
                        <template v-else-if="item.answer && item.answer.length">
                          <p>
                            {{ offerInfo.user.username }}: {{ item.answer }}
                          </p>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div
          class="row mb-5 d-flex justify-content-end"
          v-if="shouldAllowAskQuestion && !isLoadingMealQuestions"
        >
          <div class="col-12 col-lg-4">
            <b-btn
              class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mb-4"
              @click="showAskQuestionModal"
            >
              <span class="d-block pb-2 pt-3">
                Ask question
                <p>(Posted publicly)</p>
              </span>
            </b-btn>
          </div>
        </div>

        <template v-if="shouldLoadMoreOffers">
          <div
            class="row more-offers-row"
            v-bind:class="{ 'is-loading': isLoadingMoreOffers }"
          >
            <loading
              :active.sync="isLoadingMoreOffers"
              :is-full-page="loaderOptions.IS_FULL_PAGE"
              :color="loaderOptions.COLOR"
              :background-color="loaderOptions.BACKGROUND_COLOR"
            ></loading>
            <template v-if="moreOffersFromSameCook && moreOffersFromSameCook.length">
              <div class="col-12">
                <div class="reserved">
                  <div class="dashboard-title-box mb-3">
                    <div class="title-size3 titleGreenNavyColor mb-3">
                      More from {{ offerInfo.user.username }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div class="carousel-reserved">
                  <CarouselContainer>
                    <OfferInfoBlock
                      v-for="(item,i) in moreOffersFromSameCook"
                      :offer-info="item"
                      :key="i"
                    />
                  </CarouselContainer>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Modals -->
    <ReserveMealModal
      :offer-info="{ ...this.offerInfo }"
      @onReserved="onReserved"
      @onModalHidden="onReserveMealModalHidden"
    />
    <ContactCookModal :meal-id="this.offerInfo.mealId || this.offerInfo.meal.id" />
    <ConfirmModal
      :id="modalId"
      :message="confirmCancelReservationMsg"
      @confirmed="onConfirmedCancelReservation"
    />
    <ConfirmModal
      id="addToNetworkDialog"
      message="Add cook to network?"
      @confirmed="addToNetwork"
    />
    <ConfirmModal
      :id="modalMealInfo.id"
      :message="modalMealInfo.msg"
      @confirmed="onModalMealConfirm"
    />
    <AskQuestionAboutMeal :meal-id="this.offerInfo.mealId || this.offerInfo.meal.id" />
    <AnswerQuestionModal
      :question-info="questionToAnswer"
      @answer-sent="onAnswerSent"
      @modal-hidden="onAnswerQuestionModalHidden"
    />
  </div>
</template>

<script>
import moment from 'moment';
import Loading from 'vue-loading-overlay';
import { mapGetters } from 'vuex';
import api from '../api';
import config from "../config";
import helpers from '../helpers';
import AnswerQuestionModal from '../components/modals/AnswerQuestionModal';
import UserRating from '../components/UserRating';
import EditBtn from '../components/EditBtn';
import HeroWave from './HeroWave';
import CarouselContainer from './CarouselContainer';
import OfferInfoBlock from './OfferInfoBlock';
import SvgIcon from './SvgIcon';
import AskQuestionAboutMeal from './modals/AskQuestionAboutMeal';
import ConfirmModal from './modals/ConfirmModal';
import ContactCookModal from './modals/ContactCookModal';
import ReserveMealModal from './modals/ReserveMealModal';

export default {
  name: "OfferPageContent",
  components: {
    ReserveMealModal,
    ContactCookModal,
    HeroWave,
    CarouselContainer,
    OfferInfoBlock,
    SvgIcon,
    ConfirmModal,
    AskQuestionAboutMeal,
    AnswerQuestionModal,
    Loading,
    UserRating,
    EditBtn,
  },
  props: [
    'rating',
    'offerInfo',
    'hiddenButtons',
    'isMealReservedOnInit',
    'bookingId',
    'bookedServingsNum',
    'shouldAllowAskQuestion',
    'isMyOffer',
    'shouldLoadMoreOffers',
    'cookRating'
  ],
  data: () => ({
    wasReserved: false,
    isProcessing: false,
    userToInvite: null,
    invitationId: null,
    isAbleToReserve: null,
    reservationId: '',
    numberOfServingsReserved: 0,
    confirmCancelReservationMsg: 'Are you sure you want to cancel reservation?',
    modalId: 'confirm-cancel-reservation',
    modalMealInfo: {
      id: 'confirm-remove-meal',
      msg: 'Are you sure you want to cancel this meal?'
    },
    mealQuestions: [],
    questionToAnswer: null,
    moreOffersFromSameCook: [],
    isLoadingMoreOffers: false,
    loaderOptions: { ...config.LOADER_OPTIONS },
    isLoadingMealQuestions: false,
    shouldRedirectToBookingPage: false,
    alert:{
      msg: "",
      variant: "success",
      show: 0
    }
  }),
  methods: {
    showReserveMealModal () {
      this.$bvModal.show('reserve-meal-modal');
    },
    showContactCookModal () {
      this.$bvModal.show('contact-cook-modal');
    },
      redirectToEditMealPage (id) {
        if (!id) return;
        this.$router.push({ path: `/dashboard/edit-meal/${id}` });
    },
    removeMeal () {
      this.$bvModal.show(this.modalMealInfo.id);
    },
    onModalMealConfirm () {
      const {id}=this.offerInfo
      if(!id) return
      api.dashboard.meals.removeMyMeal(id)
        .then(() => {
          this.alert = {
            msg: "Meal canceled",
            variant: "success",
            show: 5
          }
          this.$router.push("/dashboard")
        })
        .catch(err => {
          // TODO: handle error
          console.log('\n >> err > ', err);
        })
    },
    onReserved (id, numOfServings) {
      this.wasReserved = true;
      this.reservationId = id;
      this.numberOfServingsReserved = numOfServings;
      if (this.offerInfo['availableQuantity']) {
        this.offerInfo['availableQuantity'] -= this.numberOfServingsReserved;
      }

      if (!this.bookingId || !this.$route.path.includes('/booking/')) return;

      if (Number(this.bookingId) !== Number(this.reservationId)) {
        console.log('should redirect to new booking page later');
        this.shouldRedirectToBookingPage = true;
      }
    },
    onReserveMealModalHidden () {
      if (!this.reservationId || !this.$route.path.includes('/booking/')) return;
      if (this.shouldRedirectToBookingPage) {
        this.$router.push({ path: `/dashboard/booking/${this.reservationId}` }).catch(() => {});
      }
    },
    openConfirmCancelReservation () {
      const pickedTime = this.offerInfo.pickupTime;
      const pickupTime = moment(pickedTime).local();
      const now = moment().local();
      const timeDifference = pickupTime.diff(now, 'hours');
      if (timeDifference < 24) {
        this.confirmCancelReservationMsg = "This meal will be ready in less than 24 hours. If you cancel now the cook will get to keep your tokens. Do you still want to cancel?";
      }
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
    },
    getHeaderBgImageUrl () {
      let _url = '';
      if (!this.offerInfo || !this.offerInfo.meal) return _url;

      const images = this.offerInfo.meal.images;
      if (!images || !images.length) return _url;
      if (images[0] && images[0].path && images[0].path.length > 0) {
        _url = images[0].path;
      }
      return _url;
    },
    showAskQuestionModal () {
      this.$bvModal.show('ask-question-modal');
    },
    showModalToAnswerQuestion (item) {
      this.questionToAnswer = { ...item };
      this.$bvModal.show('answer-question-modal');
    },
    onAnswerQuestionModalHidden () {
      this.questionToAnswer = null;
    },
    onAnswerSent (result) {
      const _question = this.mealQuestions.find(item => Number(item.id) === Number(result.id));
      if (_question) {
        _question['answer'] = result.answer;
      }
      this.questionToAnswer = null;
    },
    openAddToNetworkDialog(){
      this.userToInvite = this.offerInfo.user;
      const { email } = this.userInfo;
      if (email) {
        api.invitations.generateInvitation({ email, type: "network" }).then(str => {
          const invitationId = str?str.split("code=")[1].split("&user-name")[0] : "";
          this.invitationId = invitationId;
          this.$bvModal.show("addToNetworkDialog"); 
        });
      }
    },
    addToNetwork () {
      this.isProcessing = true;
      const invitationId = this.invitationId;
      const { email } = this.userToInvite;
      const { id } = this.userInfo;
      const emailData = {
        invitationId,
        email: email,
        userId: id,
        type: "network"
      }
      api.invitations.sendInvitation(emailData).then(res1 => {
        this.alert = {
          msg: "Invitations sent",
          variant: "success",
          show: 5
        }
      }).finally(()=>{
        this.isProcessing = false;
      })
    },
    countDownChanged(dismissCountDown) {
      this.alert.show = dismissCountDown;
    },
    loadMoreOffersFromSameCook () {
      this.isLoadingMoreOffers = true;
      api.dashboard.offers.getAvailableOffersFromUser(this.offerInfo.user.id, this.offerInfo.id)
        .then(result => {
          if (result && result.data) {
            this.moreOffersFromSameCook = result.data.slice(0);
          }
          this.isLoadingMoreOffers = false;
        })
        .catch(err => {
          console.log('\n >> err load more offers > ', err);
          this.isLoadingMoreOffers = false;
        });
    },
    loadMealQuestions () {
      this.isLoadingMealQuestions = true;
      const _endpoint = this.isMyOffer
        ? api.dashboard.meals.getMyMealQuestions(this.offerInfo.meal.id)
        : api.dashboard.meals.getMealQuestions(this.offerInfo.meal.id, true);

      _endpoint
        .then(res => {
          if (res && res.mealQuestions) {
            this.mealQuestions = helpers.convertQuestionsDataResponse(res.mealQuestions, { key: 'createdAt', isDesc: true });
          }
          this.isLoadingMealQuestions = false;
        })
        .catch(err => {
          console.log('\n >> err load meal questions > ', err);
          this.isLoadingMealQuestions = false;
        });
    },
    loadInvitation() {
      const { id } = this.offerInfo.user;
      if (id) {
        api.dashboard.follows.getMyNetworks().then(result => {
          const allNetworks = result?.data?.length ? result.data : [];
          const currentCookIndex = allNetworks.findIndex(res => res.followerId == id || res.followingId == id);
          this.isAbleToReserve = currentCookIndex >= 0;
        });
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
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
    if (this.offerInfo && this.offerInfo.meal && this.offerInfo.meal.id) {
      this.loadMealQuestions();
    }
    if (this.shouldLoadMoreOffers && this.offerInfo && this.offerInfo.user && this.offerInfo.user.id) {
      this.loadMoreOffersFromSameCook();
    }

    this.loadInvitation();
  }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.offer-page-content-header {
  background-color: #b7b7b7;
}
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
.more-offers-row,
.meal-questions-row {
  position: relative;

  &.is-loading {
    min-height: 200px;
    width: 100%;
  }
}
.d-alert {
  position: absolute;
  width: calc(100% - 250px);
  z-index: 4;
}
</style>
