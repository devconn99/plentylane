<template>
    <div class="reserved-box-wrapper" v-if="bookingInfo && bookingInfo.id">
        <div class="reserved-box p-2 p-xl-3">
            <template v-if="!isSmall">
                <div class="reserved-info">
                    <div class="reserved-img mr-2 mr-xl-3">
                        <img
                                src="../assets/images/data/images/dashboard/reserved/meat.jpg"
                                alt=""
                                class="img-fluid cursor-pointer"
                                @click="redirectToBookingPage"
                        >
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
                        <div class="cook-info-img mr-2 mr-xl-3 cursor-pointer" @click="redirectToCookProfile">
                            <img src="../assets/images/data/images/avatars/cook2.jpg" alt="" class="img-fluid">
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
                                <div class="cook-info-benefits-box longbox">
                                    <SvgIcon icon="star"></SvgIcon>
                                    <span>4.3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cook-info-additional pl-3 pr-3 pl-sm-4 pr-sm-4 pl-md-5 pr-md-5">
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
                    <div class="reserved-img mr-2 mr-xl-3">
                        <img
                                src="../assets/images/data/images/dashboard/reserved/meat.jpg"
                                alt=""
                                class="img-fluid cursor-pointer"
                                @click="redirectToBookingPage"
                        >
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
export default {
    name: "BookingInfoBlock",
    components: {SvgIcon},
    props: ['isSmall', 'bookingInfo', 'showActionMenu', 'actions'],
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
        }
    }
}
</script>

<style scoped lang="scss">
.reserved-box-wrapper {
    + .reserved-box-wrapper {
        margin-top: 20px;
    }
}
</style>
