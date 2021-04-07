<template>
    <div class="reserved-box-wrapper" v-if="bookingInfo && bookingInfo.id">
        <div class="reserved-box">
            <template v-if="!isSmall">
                <div class="reserved-info">
                    <div class="reserved-img">
                        <template v-if="hasMealImage()">
                            <img :src="getMealImageThumbnail()" alt="" class="img-fluid cursor-pointer" @click="redirectToBookingPage">
                        </template>
                        <template v-else>
                            <!-- meal image placeholder -->
                            <img
                                    src="../assets/images/data/images/dashboard/recepts/meal-placeholder_rect.png"
                                    alt=""
                                    class="img-fluid cursor-pointer"
                                    @click="redirectToBookingPage"
                            >
                        </template>
                    </div>
                    <div class="reserved-boxtitle">
                        <div class="reserved-title">
                            <div
                                    class="title-size3 titleDarkColor cursor-pointer"
                                    @click="redirectToBookingPage"
                            >{{bookingInfo.offer.meal.name}}</div>
                            <!-- TODO -->
                            <!--<div class="reserved-time title-size3 titleGreenLightColor">222h</div>-->
                        </div>
                        <div class="serving-number mt-1" v-html="numOfServingsHtml"></div>
                        <div class="rating-wrapper mt-2" v-if="shouldAllowRate">
                            <b-form-rating
                                    inline
                                    no-border
                                    v-model="rating"
                                    :disabled="isSavingRating"
                                    @change="onChangeRating"
                            >
                                <template slot="icon-full">
                                    <SvgIcon icon="ratingStarFull"></SvgIcon>
                                </template>
                                <template slot="icon-empty">
                                    <SvgIcon icon="ratingStarEmpty"></SvgIcon>
                                </template>
                            </b-form-rating>
                        </div>
                    </div>
                    <div class="reserved-action-wrapper" v-if="showActionMenu && actions && actions.length">
                        <b-dropdown
                                size="sm"
                                menu-class="reserved-action-menu"
                                toggle-class="reserved-action-toggle text-decoration-none"
                                no-caret
                                variant="outline-secondary"
                        >
                            <template #button-content>
                                <i class="fas fa-ellipsis-v"></i>
                            </template>
                            <template v-for="action in actions">
                                <b-dropdown-item @click="emitAction(action.name)">{{action.title}}</b-dropdown-item>
                            </template>
                        </b-dropdown>
                    </div>
                </div>
                <div class="cook-box">
                    <div class="cook-info p-2 p-sm-3">
                        <div class="cook-info-img cursor-pointer" @click="redirectToCookProfile">
                            <template v-if="bookingInfo.cook && bookingInfo.cook.image && bookingInfo.cook.image.thumbnail">
                                <img :src="bookingInfo.cook.image.thumbnail" alt="" class="img-fluid">
                            </template>
                            <template v-else>
                                <i class="fas fa-user-circle icon-placeholder"></i>
                            </template>
                        </div>
                        <div class="cook-info-part">
                            <div class="cook-info-name mr-2 cursor-pointer" @click="redirectToCookProfile">{{userName}}</div>
                            <div class="cook-info-benefits cursor-pointer" @click="redirectToCookProfile">
                                <div class="cook-info-benefits-box">
                                    <SvgIcon icon="benefit3"></SvgIcon>
                                </div>
                                <div class="cook-info-benefits-box">
                                    <SvgIcon icon="benefit2"></SvgIcon>
                                </div>
                                <div class="cook-info-benefits-box">
                                    <SvgIcon icon="benefit1"></SvgIcon>
                                </div>
                                <UserRating :rating="bookingInfo.cook.rating"></UserRating>
                            </div>
                        </div>
                    </div>
                    <div class="cook-info-additional pl-3 pl-sm-4 pl-md-5">
                        <div class="cook-time">
                            <SvgIcon icon="clock"></SvgIcon>
                            <span class="ml-3">{{readyTimeStr}}</span>
                        </div>
                        <div class="cook-location mt-1 mt-md-2">
                            <SvgIcon icon="location"></SvgIcon>
                            <span class="ml-3 titleGreenLightColor text-underline">{{bookingInfo.offer.place.address}}</span>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="reserved-info">
                    <div class="reserved-img">
                        <template v-if="hasMealImage()">
                            <img :src="getMealImageThumbnail()" alt="" class="img-fluid cursor-pointer" @click="redirectToBookingPage">
                        </template>
                        <template v-else>
                            <!-- meal image placeholder -->
                            <img
                                    src="../assets/images/data/images/dashboard/recepts/meal-placeholder_rect.png"
                                    alt=""
                                    class="img-fluid cursor-pointer"
                                    @click="redirectToBookingPage"
                            >
                        </template>
                    </div>
                    <div class="reserved-boxtitle">
                        <div class="reserved-title">
                            <div
                                    class="title-size3 titleDarkColor cursor-pointer"
                                    @click="redirectToBookingPage"
                            >{{bookingInfo.offer.meal.name}}</div>
                            <!-- TODO -->
                            <!--<div class="reserved-time title-size3 titleGreenLightColor">1d 222h</div>-->
                        </div>
                        <div class="serving-number mt-1" v-html="numOfServingsHtml"></div>
                    </div>
                    <div class="reserved-action-wrapper" v-if="showActionMenu && actions && actions.length">
                        <b-dropdown
                                size="sm"
                                menu-class="reserved-action-menu"
                                toggle-class="reserved-action-toggle text-decoration-none"
                                no-caret
                                variant="outline-secondary"
                        >
                            <template #button-content>
                                <i class="fas fa-ellipsis-v"></i>
                            </template>
                            <template v-for="action in actions">
                                <b-dropdown-item @click="emitAction(action.name)">{{action.title}}</b-dropdown-item>
                            </template>
                        </b-dropdown>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import SvgIcon from './SvgIcon';
import helpers from '../helpers';
import UserRating from './UserRating';
export default {
    name: "BookingInfoBlock",
    components: {SvgIcon, UserRating},
    props: ['isSmall', 'bookingInfo', 'showActionMenu', 'actions', 'shouldAllowRate', 'ratingValue'],
    data: () => ({
        rating: 0,
        isSavingRating: false
    }),
    computed: {
        readyTimeStr: function () {
            return `Ready at ${helpers.parseDate(this.bookingInfo.offer.pickupTime, true)}`;
        },
        userName: function () {
            return helpers.userNameWithShortLastName(this.bookingInfo.cook);
        },
        numOfServingsHtml: function () {
            let num = 0;
            if (this.bookingInfo && this.bookingInfo.servings) {
                num = this.bookingInfo.servings;
            }
            return `<span>${num}</span> serving${num === 1 ? '' : 's'}`;
        }
    },
    created () {
        if (this.ratingValue) {
            this.rating = this.ratingValue;
        }
        this.$eventHub.$on('booking-rating-saved', bookingId => this.enableRatingForm(bookingId));
        this.$eventHub.$on('booking-rating-failed-saving', bookingId => this.enableRatingForm(bookingId));
        this.$eventHub.$on('booking-need-to-update-cook-rating', eventData => this.updateCookRating(eventData));
    },
    methods: {
        redirectToCookProfile () {
            if (!this.bookingInfo || !this.bookingInfo.id) return;
            let cookId = '';
            if (this.bookingInfo.cook && this.bookingInfo.cook.id) {
                cookId = this.bookingInfo.cook.id;
            } else if (this.bookingInfo.cookId) {
                cookId = this.bookingInfo.cookId;
            } else {
                return;
            }
            this.$router.push({ path: `/dashboard/cook-profile/${cookId}` });
        },
        redirectToBookingPage () {
            if (!this.bookingInfo || !this.bookingInfo.id) return;
            this.$router.push({ path: `/dashboard/booking/${this.bookingInfo.id}` }).catch(()=>{});
        },
        emitAction (name) {
            this.$emit(`on-action-${name}`, this.bookingInfo.id);
        },
        hasMealImage () {
            if (!this.bookingInfo || !this.bookingInfo.id) return false;
            if (!this.bookingInfo.offer || !this.bookingInfo.offer.meal) return false;
            const images = this.bookingInfo.offer.meal.images;
            if (!images || !images.length) return false;
            const _image = images[0];
            return _image && _image.thumbnail && _image.thumbnail.length > 0;
        },
        getMealImageThumbnail () {
            if (!this.hasMealImage()) return '';
            const images = this.bookingInfo.offer.meal.images;
            if (!images || !images.length) return '';
            return images[0].thumbnail || '';
        },
        onChangeRating (val) {
            this.isSavingRating = true;
            this.$emit('on-rating-changed', val);
        },
        enableRatingForm (bookingId) {
            if (!this.shouldAllowRate) return;
            if (bookingId !== this.bookingInfo.id) return;
            this.isSavingRating = false;
        },
        updateCookRating (eventData) {
            if (!this.bookingInfo || !this.bookingInfo.id || !this.bookingInfo.cook) return;
            const { cookId, rating } = eventData;
            if (Number(this.bookingInfo.cook.id) !== Number(cookId)) return;
            if (Number(this.bookingInfo.cook.rating) !== Number(rating)) {
                this.$nextTick(() => {
                    this.bookingInfo.cook.rating = rating;
                });
            }
        }
    },
    beforeDestroy () {
        this.$eventHub.$off('booking-rating-saved');
        this.$eventHub.$off('booking-rating-failed-saving');
        this.$eventHub.$off('booking-need-to-update-cook-rating');
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.reserved-box-wrapper {
    + .reserved-box-wrapper {
        margin-top: 20px;
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
        .cook-info-part {
            flex-wrap: wrap;
        }
    }
}
.rating-wrapper {
    .b-rating {
        height: 100%;
        background-color: #FFFFFF;
        padding: 0;

        .b-rating-star {
            color: #131311;
            &:first-of-type {
                padding-left: 0;
            }
            &.b-rating-star-empty {
                color: #B7B2A1;
            }
        }
    }
}
</style>
