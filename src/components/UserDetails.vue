<template>
  <div class="dashboard-content" v-if="userInfo && userInfo.id">
    <div class="container-fluid cook-profile-page-container">
      <loading
        :active.sync="isProcessing"
        :is-full-page="loaderOptions.IS_FULL_PAGE"
        :color="loaderOptions.COLOR"
        :background-color="loaderOptions.BACKGROUND_COLOR
      />
      <div class="row mb-5 align-items-center">
        <div class="col-sm-4 mb-4 mb-sm-0" v-if="hasProfileImage()">
          <div class="cook-box">
            <div class="cook-box-bigimg">
              <img :src="userInfo.image.path || userInfo.image.thumbnail" alt="" class="img-fluid">
            </div>
          </div>
        </div>
        <div v-bind:class="hasProfileImage() ? 'col-sm-8' : 'col-12'">
          <div class="cook-profile cook-profile-top-info">
            <div class="title-size1 mb-3 text-center text-sm-left cook-profile-username">
              {{userInfo.fullName}}
            </div>
            <small>{{getAddress}}</small>
            <div class="cook-box">
              <template v-if="userInfo.bio && userInfo.bio.length">
                <div class="cook-info-name mb-2">Bio</div>
                <p>{{userInfo.bio}}</p>
              </template>
            </div>
          </div>
        </div>
        <b-container fluid>
          <b-row class="mt-2">
            <b-col cols="12" md="6">
              <div>
                <h3>Plan Details</h3>
                <div>Plan Name : {{getPlanName | kebabToTitleCase}}</div>
                <div>Price : {{getPlanPrice}}</div>
              </div>
            </b-col>
            <b-col cols="12" md="6">
              <div>
                <h3>Friends Invitations</h3>
                <b-table
                  v-if="getUserInvitations.length"
                  class="table-custom-border"
                  bordered
                  :items="getUserInvitations"
                  :fields="tableHeaderFields"
                />
                <h4 v-else>No invitations sent</h4>
              </div>
            </b-col>
            <b-col cols="12" md="6">
              <div >
                <h3>Meals</h3>
                <b-table
                  v-if="getUserMeals.length"
                  class="table-custom-border"
                  bordered
                  :items="getUserMeals"
                  :fields="mealsTableHeaderFields"
                />
                <h4 v-else>No meal created yet</h4>
              </div>
            </b-col>
            <b-col cols="12" md="6">
              <div >
                <h3>Reservations</h3>
                <b-table
                  v-if="getUserDinnerBookings.length"
                  class="table-custom-border"
                  bordered
                  :items="getUserDinnerBookings"
                  :fields="mealsTableHeaderFields"
                />
                <h4 v-else>No reservation yet</h4>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import api from '../api';
import SvgIcon from '../components/SvgIcon';
import config from "../config";

export default {
  name: "CookProfile",
  components: { SvgIcon, Loading },
  data: () => ({
    isLoaded: false,
    subscription:null,
    userId: '',
    userInfo: null,
    loaderOptions: { ...config.LOADER_OPTIONS },
    isProcessing: false,
    offers:[],
    bookings:[],
    myOffers:[],
    tableHeaderFields: [
      {
        key: 'email',
        label: 'Email'
      },
      {
        key: 'status',
        label: 'Status'
      },
    ],
    mealsTableHeaderFields: [
      {
        key: 'name',
        label: 'Name'
      },
      {
        key: 'description',
        label: 'Description'
      },
    ],
  }),
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.clearData();
      const { id = '' } = vm.$route.params;
      vm.userId = id;
      vm.loadPageData();
    })
  },
  beforeRouteUpdate(to, from, next) {
    const _loading = this.$loading.show();
    this.clearData();
    const { id = '' } = to.params;
    this.userId = id;
    const cb = () => {
      next();
      if (_loading && _loading.hide) {
        _loading.hide();
      }
    };
    this.loadPageData(cb);
  },
  methods: {
    hasProfileImage() {
      if (!this.userInfo || !this.userInfo.id) return false;
      if (!this.userInfo.image) return;
      const _img = this.userInfo.image;
      return (_img.path && _img.path.length > 0) || (_img.thumbnail && _img.thumbnail.length);
    },
    clearData() {
      this.isLoaded = false;
      this.userInfo = null;
    },
    hideGlobalLoader() {
      if (this.$loader && this.$loader.hide) {
        setTimeout(() => {
          this.$loader.hide()
        }, 0);
      }
    },
    errLoadingDataHandler(cb, err) {
      if (err && err.data && err.data.statusCode === 404) {
        this.isLoaded = true;
        this.hideGlobalLoader();
        if (cb) cb();
        return this.$router.push({ path: '/dashboard/not-found' }).catch(() => {});
      }

      this.isLoaded = true;
      this.hideGlobalLoader();
      if (cb) cb();
    },
    loadPageData(cb) {
      if (!this.userId) {
        this.errLoadingDataHandler(cb);
        return;
      }
      if (isNaN(this.userId)) {
        this.errLoadingDataHandler(cb, { data: { statusCode: 404 } });
        return;
      }
      api.dashboard.users.getUserInfo(this.userId).then(async data => {
        this.userInfo = { ...data };
        const { stripeCheckoutId } = this.userInfo;

        if (stripeCheckoutId) {
          try {
            const chckout = await api.payment.getCheckoutSession(stripeCheckoutId)
            if (chckout?.subscription) {
              this.subscription = await api.payment.getSubscriptionById(chckout.subscription)
            }
          } catch (error) {
            console.log(error);
          }
        }
        this.isLoaded = true;
        this.hideGlobalLoader();
        if (cb) cb();
      }).catch(err => {
        this.errLoadingDataHandler(cb, err);
      })
    },
    loadOffers (userId) {
      this.isLoaded = false;
      const requests = [
        api.dashboard.offers.getAvailableOffers(userId),
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
          this.isLoaded = true;
          this.hideGlobalLoader();
        });
    },
  },
  computed: {
    getUserInvitations() {
      return this.userInfo?.invitation || []
    },
    getUserMeals() {
      return this.userInfo?.meals || [];
    },
    getUserDinnerBookings(){
      let dinnersToReturn=[];
      let dineBookings= this.userInfo?.dineBookings
      dineBookings.forEach(res => {
        if(res.offerId){
          api.dashboard.offers.getMyOfferById(res.offerId).then(res1=>{
            dinnersToReturn.push(res1.meal)
          })
        }
      });
      return dinnersToReturn
    },
    getPlanName() {
      const planId=this.subscription?.plan?.id
      if (planId) {
        const obj = config.STRIPE_INFO.PRICE;
        const keyVal = Object.keys(obj).find((key)=> {
          return obj[key]['id'] === planId}
        );
        return keyVal || "none";
      } else {
        return "none";
      }
    },
    getPlanPrice() {
      const price = this.subscription?.plan?.amount;
      return price ? (price/100) : 0;
    },
    getAddress(){
      const { billingAddress } = this.userInfo;
      if (billingAddress?.line1) {
        const { city, country, line1, line2, postalCode, state } = billingAddress;
        return `${line1}, ${line2} - ${city} ${state} ${country} - ${postalCode}`;
      } else {
        return "";
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";

.cook-profile-page-container {
  position: relative;
  min-height: 500px;
  @media screen and (max-width: $phoneBigWidth) {
    min-height: 300px;
  }
}

.cook-profile.cook-profile-top-info {
  max-width: 100%;
  .cook-profile-username {
    max-width: 100%;
    overflow: hidden; // NOTE: text-overflow: ellipsis; is adding "...", but dots appear at the top right corner because of the font -
    // typically these dots are placed at the bottom right
  }
}

@media screen and (max-width: $phoneBigWidth) {
  .cook-profile {
    .cook-box {
      .cook-info,
      .cook-info-links {
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
