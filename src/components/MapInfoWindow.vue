<template>
    <div class="map-info-window-wrapper" v-if="itemData && itemData.id">
        <div class="reserved-box">
            <div class="reserved-info">
                <div class="reserved-img">
                    <img
                            src="../assets/images/data/images/dashboard/reserved/soup.jpg"
                            alt=""
                            class="img-fluid cursor-pointer"
                            @click="redirectToOffer"
                    >
                </div>
                <div class="reserved-boxtitle">
                    <div class="reserved-title">
                        <div class="title-size3 titleDarkColor cursor-pointer" @click="redirectToOffer">{{itemData.meal.name}}</div>
                        <!-- TODO -->
                        <!--<div class="reserved-time title-size3 titleGreenLightColor">222h</div>-->
                    </div>
                    <div class="serving-number mt-1" v-html="numOfServingsHtml"></div>
                </div>
            </div>
            <div class="cook-box mt-3">
                <div class="cook-info pl-2 pr-2 pb-2 pl-sm-3 pr-sm-3 pb-sm-3 pt-1" v-if="itemData.user && itemData.user.id">
                    <div class="cook-info-img cursor-pointer" @click="redirectToCookProfile">
                        <template v-if="itemData.user.image && itemData.user.image.thumbnail">
                            <img :src="itemData.user.image.thumbnail" alt="" class="img-fluid">
                        </template>
                        <template v-else>
                            <i class="fas fa-user-circle icon-placeholder"></i>
                        </template>
                    </div>
                    <div class="cook-info-part">
                        <div class="cook-info-name cursor-pointer pr-2" @click="redirectToCookProfile">{{userName}}</div>
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
                <div class="cook-info-additional pl-3 pl-sm-4 pl-md-5">
                    <div class="cook-time">
                        <SvgIcon icon="clock"></SvgIcon>
                        <span class="ml-3">{{readyTimeStr}}</span>
                    </div>
                    <div class="cook-location mt-1 mt-md-2">
                        <SvgIcon icon="location"></SvgIcon>
                        <span class="ml-3">{{itemData.place.address}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from './SvgIcon';
import helpers from '../helpers';
export default {
    name: "MapInfoWindow",
    props: ['itemData'],
    components: {SvgIcon},
    methods: {
        redirectToOffer () {
            if (!this.itemData || !this.itemData.id) return;
            this.$eventHub.$emit('marker-info-window_redirect-to-offer', this.itemData.id);
        },
        redirectToCookProfile () {
            if (!this.itemData || !this.itemData.id) return;
            this.$eventHub.$emit('marker-info-window_redirect-to-cook', this.itemData.id, this.itemData.user.id);
        }
    },
    computed: {
        readyTimeStr: function () {
            return `Ready at ${helpers.parseDate(this.itemData.pickupTime, true)}`;
        },
        numOfServingsHtml: function () {
            let num = 0;
            if (this.itemData && this.itemData.quantity) {
                num = this.itemData.quantity;
            }
            return `<span>${num}</span> serving${num === 1 ? '' : 's'}`;
        },
        userName: function () {
            return helpers.userNameWithShortLastName(this.itemData.user);
        }
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.map-info-window-wrapper {
    max-width: 400px;
    background-color: #FFFFFF;

    .reserved-box {
        box-shadow: none !important;
        padding: 0 !important;

        .reserved-title {
            padding-right: 25px;
        }
    }

    @media screen and (max-width: $phoneBigWidth) {
        min-width: 250px;
    }

    .cook-box {
        .cook-info-part {
            flex-wrap: wrap;
        }
        .cook-info-part .cook-info-name,
        .cook-info-additional .cook-time span,
        .cook-info-additional .cook-location span {
            font-size: 16px;
            line-height: 24px;

            @media screen and (max-width: $phoneBigWidth) {
                font-size: 14px;
                line-height: 20px;
            }
        }

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
