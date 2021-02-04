<template>
    <div v-if="offerInfo && offerInfo.id" class="offer-link">
        <div class="recept-box">
            <div class="recept-box-img recept-box-img-overlay">
                <!-- TODO: use meal's image later -->
                <img src="../assets/images/data/images/dashboard/recepts/card__img-placeholder.svg" alt="" class="img-fluid">
                <div class="recept-box-title">
                    <div
                            class="title-size3 titleLightColor cursor-pointer"
                            @click="redirectToOffer"
                    >{{offerInfo.meal.name}}</div>
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
                        <template v-for="action in actions">
                            <b-dropdown-item @click="emitAction(action.name)">{{action.title}}</b-dropdown-item>
                        </template>
                    </b-dropdown>
                </div>
            </div>
            <div class="cook-box pb-2 pb-md-3">
                <div class="cook-info p-2 p-sm-3">
                    <div
                            class="cook-info-img mr-2 mr-xl-3"
                            v-bind:class="{ 'cursor-pointer': !avoidRedirectToCookProfile }"
                            @click="redirectToCookProfile"
                    >
                        <!-- TODO: use real user's avatar later -->
                        <img src="../assets/images/data/images/avatars/cook2.jpg" alt="" class="img-fluid">
                    </div>
                    <div class="cook-info-part">
                        <div
                                class="cook-info-name mr-2"
                                v-bind:class="{ 'cursor-pointer': !avoidRedirectToCookProfile }"
                                @click="redirectToCookProfile"
                        >{{userName}}</div>
                        <div
                                class="cook-info-benefits mt-1"
                                v-bind:class="{ 'cursor-pointer': !avoidRedirectToCookProfile }"
                                @click="redirectToCookProfile"
                        >
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
                        <span class="ml-3">Ready at {{readyTimeStr}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import helpers from '../helpers';
import SvgIcon from './SvgIcon';
export default {
    name: "OfferInfoBlock",
    props: ['offerInfo', 'avoidRedirectToCookProfile', 'showActionMenu', 'actions'],
    components: {SvgIcon},
    data: () => ({
        placeholderImg: '../assets/images/data/images/dashboard/recepts/card__img-placeholder.svg',
    }),
    computed: {
        readyTimeStr: function () {
            return helpers.parseDate(this.offerInfo.pickupTime, true);
        },
        userName: function () {
            return helpers.userNameWithShortLastName(this.offerInfo.user);
        }
    },
    methods: {
        redirectToOffer () {
            if (this.offerInfo && this.offerInfo.id) {
                this.$router.push({ path: `/dashboard/offers/${this.offerInfo.id}` }).catch(()=>{});
            }
        },
        redirectToCookProfile () {
            if (this.avoidRedirectToCookProfile) return;
            if (this.offerInfo && this.offerInfo.user && this.offerInfo.user.id) {
                this.$router.push({ path: `/dashboard/cook-profile/${this.offerInfo.user.id}` }).catch(()=>{});
            }
        },
        emitAction (name) {
            this.$emit(`on-action-${name}`, this.offerInfo.id);
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
        img {
            width: 100%;
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
        }
    }
}
</style>
