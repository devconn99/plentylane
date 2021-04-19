<template>
    <div class="row">
        <div class="col-12 col-lg-10 mx-auto" v-if="!isBasketEmpty && items && items.length">
            <div class="shop-order pt-3 pb-3" v-for="item in items" v-bind:key="item.id">
                <div class="row shop-order-wrapper">
                    <div class="col-7 col-sm-7 col-md-7 col-lg-8 col-xl-8">
                        <div class="shop-order-box">
                            <div class="shop-order-box-image mr-3 mr-md-4">
                                <img src="../../assets/images/data/images/dashboard/shop/container-4pk.jpg" alt="" class="img-fluid">
                            </div>
                            <div class="shop-order-box-info">
                                <div class="shop-order-box-info-title mb-1">{{item.title}}</div>
                                <div class="shop-order-box-info-price">{{item.currency || '$'}}{{item.price}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-5 col-sm-5 col-md-5 col-lg-4 col-xl-4">
                        <div class="shop-order-box shop-order-box-counter-wrapper justify-content-between">
                            <div class="shop-order-box-info-count">
                                <b-form class="form basket-form" @submit.stop.prevent>
                                    <b-form-group class="mb-0">
                                        <b-form-input
                                                name="count"
                                                class="count-value-input"
                                                type="number"
                                                pattern="[0-9]*"
                                                v-model="item.count"
                                                autocomplete="off"
                                                :min="minCount"
                                                :max="maxCount"
                                                step="1"
                                                @paste.prevent
                                                onkeypress="return event.code.includes('Digit')"
                                                v-on:change="onCountChanged($event, item)"
                                        ></b-form-input>
                                    </b-form-group>
                                </b-form>
                            </div>
                            <div class="shop-order-box-info-delete cursor-pointer" @click="removeFromBasket(item.id)">
                                <SvgIcon icon="close" :params="{ stroke: '#DA2E1D' }"></SvgIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-7 col-sm-6 col-xl-4 ml-auto">
                    <div class="shop-price-box">
                        <div class="shop-price-subtotal mb-3">
                            <div class="shop-price-subtotal-title">Subtotal</div>
                            <div class="shop-price-subtotal-price">{{subTotalCurrency}}</div>
                        </div>
                        <div class="shop-price-tax mb-3">
                            <div class="shop-price-tax-title">Tax</div>
                            <div class="shop-price-tax-price">{{taxCurrency}}</div>
                        </div>
                        <div class="shop-price-total mb-3">
                            <div class="shop-price-total-title">Total</div>
                            <div class="shop-price-total-price">{{totalCurrency}}</div>
                        </div>
                    </div>
                </div>
                <div class="clear-line"></div>
                <div class="col-12 col-sm-6 col-xl-4 ml-auto">
                    <div class="box-btn">
                        <router-link
                                :to="{ path: '/dashboard/shop/checkout' }"
                                tag="button"
                                class="btnGreen btnNormalSize btnUpper btn100 hover-slide-left"
                        >
                            <span>Checkout</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-8 col-md-10 col-lg-9 col-xl-8 mx-auto text-center" v-if="isBasketEmpty">
            <div class="dashboard-title-box mb-3">
                <div class="title-size3 titleGreenNavyColor">Your basket is empty.</div>
            </div>

            <div class="box-btn mt-5">
                <router-link
                        :to="{ path: '/dashboard/shop' }"
                        class="btnGreenTransparent btnHugeSize btn100 hover-slide-left"
                >
                    <span>Go to Shop</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon';
import helpers from '../../helpers';
export default {
    name: "Basket",
    components: {SvgIcon},
    data: () => ({
        items: [],
        isBasketEmpty: false,
        minCount: 0,
        maxCount: 1000,
        price: {
            subTotal: 0,
            tax: 0,
            total: 0
        }
    }),
    created () {
        const _basket = this.$store.getters.basket;
        if (_basket && _basket.length) {
            this.items = _basket.map(item => item);
            this.calculatePrice();
        } else {
            this.isBasketEmpty = true;
        }
    },
    methods: {
        removeFromBasket (id) {
            this.items = this.items.filter(item => Number(item.id) !== Number(id));
            this.$store.commit('removeFromBasket', id);
            if (!this.items.length) {
                this.isBasketEmpty = true;
            }
            this.calculatePrice();
        },
        onCountChanged (value, item) {
            if (typeof value !== 'number') {
                value = Number(value);
                if (isNaN(value)) {
                    item.count = 0;
                    value = 0;
                }
            }
            if (!Number.isInteger(value)) {
                value = Math.floor(this.minCount >= 0 ? Math.abs(value) : value);
                item.count = value;
            }
            if (value > this.maxCount) {
                item.count = this.maxCount;
                value = this.maxCount;
            } else if (value < this.minCount) {
                value = Math.abs(value);
                item.count = value;
            }
            this.$store.commit('updateItemCountInBasket', { count: Number(value), id: item.id });
            this.calculatePrice();
        },
        calculatePrice () {
            if (!this.items || !this.items.length) {
                this.price = { subTotal: 0, tax: 0, total: 0 };
                this.$eventHub.$emit('basket-updated', 0);
                return;
            }
            const koeff = 11.49;
            let _price = 0;
            this.items.forEach(item => {
                this.$nextTick(() => {
                    if (item.count < 0) {
                        item.count = 0;
                    }
                });
                _price += item.count * item.price;
            });
            this.price.subTotal = _price;
            this.price.tax = _price / koeff;
            this.price.total = this.price.subTotal + this.price.tax;
            this.$eventHub.$emit('basket-updated', this.price.subTotal);
        }
    },
    computed: {
        subTotalCurrency: function () {
            return helpers.convertCurrency(this.price.subTotal);
        },
        taxCurrency: function () {
            return helpers.convertCurrency(this.price.tax);
        },
        totalCurrency: function () {
            return helpers.convertCurrency(this.price.total);
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.shop-order {
    border-bottom: 1px solid rgba(138,135,125,0.25);

    .shop-order-wrapper {
        align-items: center;

        @media screen and (max-width: $phoneBigWidth) {
            align-items: flex-start;
        }

        .shop-order-box {
            display: flex;
            align-items: center;

            @media screen and (max-width: $phoneBigWidth) {
                &:not(.shop-order-box-counter-wrapper) {
                    align-items: flex-start;
                }
            }

            .shop-order-box-image {
                flex: none;
                img {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border: 1px solid rgba(161,112,103,0.3);
                    @media screen and (max-width: $phoneBigWidth) {
                        width: 48px;
                        height: 48px;
                    }
                }
            }
            .shop-order-box-info {
                .shop-order-box-info-title {
                    font-family: $FilsonProBold;

                    @media screen and (max-width: $phoneBigWidth) {
                        word-break: break-word;
                    }
                }
            }
            .shop-order-box-info-delete {
                a:hover svg g.possible-change-on-hover {
                    stroke: $greenLightColor;
                    -webkit-transition: .3s all ease;
                    -o-transition: .3s all ease;
                    transition: .3s all ease;
                }
            }
        }
        .basket-form {
            .form-group {
                width: 131px;

                .count-value-input {
                    padding-right: 25px;
                }
                @media screen and (max-width: $tableMinWidth) {
                    width: 66px !important;

                    .count-value-input {
                        padding-right: 10px;
                        padding-left: 13px;
                    }
                }
                @media screen and (max-width: $mdphoneWidth) {
                    width: 70px !important;
                }
            }
        }
    }
}
</style>
