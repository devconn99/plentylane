<template>
    <div>
        <div class="dashboard-hero dashboard-shop-bg">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="title-size1 titleDarkColor">{{headerTitle}}</div>
                    </div>
                </div>
            </div>
            <HeroWave></HeroWave>
        </div>
        <div class="dashboard-content">
            <div class="container-fluid">
                <router-view></router-view>
            </div>
        </div>

        <template v-if="shouldShowBasket && price > 0 && priceToDisplay">
            <router-link :to="{ path: '/dashboard/shop/basket' }" class="cart-count">
                <SvgIcon icon="cart"></SvgIcon>
                <span>${{priceToDisplay}}</span>
            </router-link>
        </template>
    </div>
</template>

<script>
import HeroWave from '../../components/HeroWave';
import SvgIcon from '../../components/SvgIcon';
export default {
    name: "ShopWrapper",
    components: {HeroWave, SvgIcon},
    data: () => ({
        headerTitle: '',
        shouldShowBasket: false,
        price: 0,
        priceToDisplay: ''
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.headerTitle = to.meta.headerTitle || 'Shop';
            vm.getBasketInfo();
        })
    },
    beforeRouteUpdate (to, from, next) {
        this.headerTitle = to.meta.headerTitle || 'Shop';
        this.getBasketInfo();
        next();
    },
    methods: {
        prepareBasketPriceToDisplay () {
            if (!this.price) {
                this.priceToDisplay = '';
                this.shouldShowBasket = false;
                return;
            }
            this.priceToDisplay = Number.isInteger(this.price) ? this.price : Number(this.price).toFixed(2);
            this.shouldShowBasket = true;
        },
        getBasketInfo () {
            const _price = this.$store.getters.totalPrice;
            this.cartInfoHandler(_price);
        },
        cartInfoHandler (price) {
            if (isNaN(price) || !price) {
                this.resetCartInfo();
                return;
            }
            this.price = price;
            this.prepareBasketPriceToDisplay();
        },
        resetCartInfo () {
            this.shouldShowBasket = false;
            this.price = 0;
            this.priceToDisplay = '';
        }
    },
    created () {
        this.$eventHub.$on('basket-updated', (price) => {
            this.cartInfoHandler(price);
        });
        this.$eventHub.$on('added-item-to-basket', (price) => {
            if (isNaN(price)) {
                this.resetCartInfo();
                return;
            }
            this.price += price;
            this.prepareBasketPriceToDisplay();
        });
    },
    beforeDestroy () {
        this.$eventHub.$off('basket-updated');
        this.$eventHub.$off('added-item-to-basket');
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.cart-count {
    position: fixed;
    top: 40px;
    right: 80px;
    padding: 20px 23px 17px;
    color: $whiteColor;
    background-color: $redColor;
    border-radius: 32px;
    box-shadow: 0 2px 10px rgba(24,24,22,0.2);
    -webkit-transition: .3s all ease;
    -o-transition: .3s all ease;
    transition: .3s all ease;
    display: flex;
    @media screen and (max-width: $tableWidth) {
        top: 40px;
        right: 40px;
    }
    @media screen and (max-width: $tableMinWidth) {
        top: 74px;
        right: 8px;
        padding: 8px 13px 4px;
    }
    span {
        font-family: $FilsonProBold;
        font-size: 24px;
        line-height: 24px;
        display: block;
        padding-top: 3px;
        margin-left: 10px;
        @media screen and (max-width: $tableMinWidth) {
            font-size: 16px;
            line-height: 16px;
        }
    }
    &:hover {
        color: $whiteColor;
        box-shadow: 0 2px 12px  rgba(24,24,22,0.4);
        -webkit-transition: .3s all ease;
        -o-transition: .3s all ease;
        transition: .3s all ease;
    }
}
</style>
