<template>
  <div v-if="offerInfo && offerInfo.id" class="offer-link">
    <router-link :to="{ path: isMyOffer ? '/dashboard/my-offers/'+ offerInfo.id: '/dashboard/offers/' + offerInfo.id }">
      <div class="recept-box">
        <div class="recept-box-img recept-box-img-overlay">
          <template v-if="hasMealImage()">
            <img :src="getMealImagePath()" alt="" class="img-fluid">
          </template>
          <template v-else>
            <!-- meal image placeholder -->
            <SvgIcon icon="mealPlaceholder"></SvgIcon>
          </template>

          <div class="recept-box-title" v-if="offerInfo && offerInfo.meal">
            <div class="meal-name title-size3 titleLightColor cursor-pointer">
              {{offerInfo.meal.name}}
            </div>
            <div class="serving-number mt-1 titleLightColor">
              <span class="titleLightColor">{{offerInfo.availableQuantity}}</span>
              {{offerInfo.availableQuantity !== 1 ? 'servings' : 'serving'}}
            </div>
          </div>
          <div class="recept-box-action-wrapper" v-if="showActionMenu && actions && actions.length">
            <b-dropdown
              size="sm"
              menu-class="recept-box-action-menu"
              toggle-class="recept-box-action-toggle text-decoration-none"
              no-caret
              variant="outline-secondary"
            >
              <template #button-content>
                <i class="fas fa-ellipsis-v"></i>
              </template>
              <template v-for="(action,i) in actions">
                <b-dropdown-item
                  :key="i"
                  @click="emitAction(action.name)"
                >
                  {{action.title}}
                </b-dropdown-item>
              </template>
            </b-dropdown>
          </div>
        </div>
        <div class="cook-box pb-2 pb-md-3">
          <div class="cook-info p-2 p-sm-3" v-if="offerInfo.user && offerInfo.user.id && !hiddenUserBlock">
            <template v-if="!avoidRedirectToCookProfile && offerInfo.user && offerInfo.user.id">
              <router-link :to="{ path: '/dashboard/cook-profile/' + offerInfo.user.id }" v-slot="{ href }">
                <a :href="href" class="cook-info-img">
                  <template v-if="offerInfo.user.image && offerInfo.user.image.thumbnail">
                    <img :src="offerInfo.user.image.thumbnail" alt="" class="img-fluid">
                  </template>
                  <template v-else>
                    <i class="fas fa-user-circle icon-placeholder"></i>
                  </template>
                </a>
              </router-link>
              <div class="cook-info-part">
                <router-link
                  :to="{ path: '/dashboard/cook-profile/' + offerInfo.user.id }"
                  class="cook-info-name mr-2"
                >{{offerInfo.user.username}}</router-link>

                <router-link :to="{ path: '/dashboard/cook-profile/' + offerInfo.user.id }" v-slot="{ href }">
                  <a :href="href" class="cook-info-benefits mt-1">
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
                    <UserRating :rating="offerInfo.user.rating"></UserRating>
                  </a>
                </router-link>
              </div>
            </template>

            <template v-else>
              <div class="cook-info-img">
                <template v-if="offerInfo.user.image && offerInfo.user.image.thumbnail">
                  <img :src="offerInfo.user.image.thumbnail" alt="" class="img-fluid">
                </template>
                <template v-else>
                  <i class="fas fa-user-circle icon-placeholder"></i>
                </template>
              </div>
              <div class="cook-info-part">
                <div class="cook-info-name mr-2">{{offerInfo.user.username}}</div>
                <div class="cook-info-benefits mt-1">
                  <UserRating :rating="offerInfo.user.rating"></UserRating>
                </div>
              </div>
            </template>
          </div>
          <div
            class="cook-info-additional pl-3 pr-3"
            v-bind:class="hiddenUserBlock || (!offerInfo.user || !offerInfo.user.id) ? 'pt-2 pt-sm-3' : 'pl-sm-4 pl-md-5'"
          >
            <div class="cook-time">
              <SvgIcon icon="clock"></SvgIcon>
              <span class="ml-3">Ready at {{readyTimeStr}}</span>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import helpers from '../helpers';
import SvgIcon from './SvgIcon';
import UserRating from './UserRating';

export default {
  name: "OfferInfoBlock",
  props: ['offerInfo', 'avoidRedirectToCookProfile', 'showActionMenu', 'actions', 'isMyOffer', 'hiddenUserBlock'],
  components: {SvgIcon, UserRating},
  computed: {
    readyTimeStr: function () {
      return helpers.parseDate(this.offerInfo.pickupTime, true);
    }
  },
  methods: {
    emitAction (name) {
      // NOTE: this method may not work if OfferInfoBlock is a part of owl-carousel
      this.$emit(`on-action-${name}`, this.offerInfo.id);
    },
    hasMealImage () {
      if (!this.offerInfo || !this.offerInfo.id) return false;
      if (!this.offerInfo.meal) return false;
      const images = this.offerInfo.meal.images;
      if (!images || !images.length) return false;
      const _image = images[0];
      return _image.path && _image.path.length > 0;
    },
    getMealImagePath () {
      if (!this.hasMealImage()) return '';
      return this.offerInfo.meal.images[0].path || '';
    }
  }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.offer-link + .offer-link > .recept-box {
  @media screen and (min-width: $tableMinWidth) {
    margin-top: 20px;
  }
}
.recept-box {
  box-shadow: 0 4px 16px rgba(69,53,38,0.15);
  background-color: $whiteColor;
  position: relative;
  font-family: $FilsonProRegular;
  -webkit-transition: .3s all ease;
  -o-transition: .3s all ease;
  transition: .3s all ease;
  &:hover {
    box-shadow: 0 6px 18px rgba(69,53,38,0.3);
    -webkit-transition: .3s all ease;
    -o-transition: .3s all ease;
    transition: .3s all ease;
  }
  .cook-box {
    .cook-info-name, a.cook-info-name {
      padding-top: 0;
    }
    .cook-info-part {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .recept-box-img {
    position: relative;
    max-height: 204px;
    overflow-y: hidden;
    img {
      width: 100%;
      min-height: 204px;
      object-fit: cover;
    }
    i.svg-icon-wrapper {
      width: 100%;
      height: 100%;
    }
    &.recept-box-img-overlay:after {
      position: absolute;
      content: '';
      background: linear-gradient(rgba(53,53,49,0), rgba(31,31,26,0.74));
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .recept-box-title {
      position: absolute;
      bottom: 9px;
      left: 16px;
      z-index: 2;
      padding-right: 16px;

      .meal-name {
        max-height: 144px;
        overflow-y: hidden;

        @media screen and (max-width: $tableWidth) {
          max-height: 153px;
        }
        @media screen and (max-width: $phoneBigWidth) {
          max-height: 140px;
        }
      }
    }
  }
  .cook-box {
    .cook-info-additional {
      @media screen and (max-width: $phoneBigWidth) {
        padding-left: 25px !important;
        margin-top: 6px;
      }
      @media screen and (min-width: $phoneBigWidth + 1) and (max-width: $tableMinWidth) {
        padding-left: 35px !important;
      }
    }
  }
}
</style>
