<template>
  <b-container class="container-fluid position-relative">
    <b-alert
      @dismiss-count-down="countDownChanged"
      :show="alert.show"
      fade dismissible
      class="d-alert position-absolute"
      style="width: 100%"
      :variant="alert.variant"
      @dismissed="alert.show = 0"
    >
      <p>{{ alert.msg }}</p>
    </b-alert>
    <div class="d-flex justify-content-center">
      <div class="p-5">
        <Rating v-model="rating.rating" />
        <span class="d-flex">
          <b-button
            size="sm"
            pill
            @click="updateRemarks(tag)"
            v-for="(tag, i) of reviewTags"
            :key="i"
            class="mt-2 btnGreen p-2 hover-slide-left"
            :class="{ 'ml-2': i > 0, active: tagSelected(tag) }"
          >
            <span>{{ tag }}</span>
          </b-button>
        </span>
        <b-form-group label="Review" class="mt-2">
          <b-textarea v-model="rating.review" rows="5" />
        </b-form-group>
        <span class="d-flex mt-2">
          <b-badge v-for="(remark,i) in selectedRemarks" :key="i" :class="{'ml-2':i>0}">
            {{remark}}
          </b-badge>
        </span>
        
        <b-button
          @click="updateRating()"
          class="mt-2 btnGreen btnBigSize btn50 text-uppercase hover-slide-left"
        >
          <span>Rate</span>
        </b-button>
      </div>
    </div>
  </b-container>
</template>

<script>
import api from '../api';
import SvgIcon from '../components/SvgIcon';
import Loading from 'vue-loading-overlay';
import config from "../config";
import Rating from '../components/rating'

export default {
  name: "RateProfile",
  components: { SvgIcon, Loading, Rating },
  data: () => ({
    alert: {
      show: 0,
      msg: "",
      variant: "success"
    },
    isLoaded: false,
    ratingUUID: '',
    ratingId:null,
    token: '',
    reviewTags: config.RATINGS.TAGS,
    rating: {
      rating: 0,
      remarks: [],
      review: "",
    },
    loaderOptions: { ...config.LOADER_OPTIONS },
    isProcessing: false,
  }),
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.clearData();
      const { rating, token } = vm.$route.query;
      vm.token = token
      localStorage.setItem("plAccessToken", token);
      vm.ratingUUID = rating;
      vm.loadPageData();
    })
  },
  beforeRouteUpdate(to, from, next) {
    const _loading = this.$loading.show();
    this.clearData();
    const { rating, token } = to.query;
    this.ratingUUID = rating;
    this.token = token
    localStorage.setItem("plAccessToken", token);
    const cb = () => {
      next();
      if (_loading && _loading.hide) {
        _loading.hide();
      }
    };
    this.loadPageData(cb);
  },
  mounted() {
    window.onbeforeunload = function() { 
      localStorage.removeItem("plAccessToken")
    };
  },
  computed:{
    selectedRemarks() {
      return this.rating.remarks;
    }
  },
  methods: {
    clearData() {
      this.isLoaded = false;
    },
    updateRemarks(tag) {
      const remarkIndex = this.rating.remarks.findIndex(res=> res == tag);
      if (remarkIndex >= 0) {
        this.rating.remarks.splice(remarkIndex, 1) 
      } else {
        this.rating.remarks.push(tag) 
      }
    },
    async loadPageData() {
      const uuid = this.ratingUUID;

      api.ratings.getRatingByUUID(uuid).then(res => {
        if (res.id) {
          this.ratingId=res.id
        }
      }).catch(err => {

      }).finally(() => {
        this.hideGlobalLoader()
      })
    },
    hideGlobalLoader() {
      if (this.$loader && this.$loader.hide) {
        setTimeout(() => {
          this.$loader.hide()
        }, 0);
      }
    },
    tagSelected(tag) {
      return this.rating.remarks.indexOf(tag) >= 0
    },
    updateRating() {
      const id = this.ratingId
      if (id && this.token) {
        this.rating['status']='reviewed'
        api.ratings.updateRating(id, this.rating).then(res => {
          this.alert = {
            variant: 'success',
            msg: "Rating post successful!",
            show: 5
          }
          localStorage.removeItem("plAccessToken")
          this.$router.push("/")
        }).catch(err => {
          this.alert = {
            variant: 'danger',
            msg: "Internal server error!",
            show: 5
          }
        })
      } else {
        this.alert = {
          variant: 'warning',
          msg: "Rating request not found!",
          show: 5
        }
      }
    },
    countDownChanged(dismissCountDown) {
      this.alert.show = dismissCountDown
    },
  }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
</style>
