<template>
    <div class="row">
        <div class="col-12 col-lg-10 mx-auto position-relative" v-if="!isBasketEmpty">
            <loading
                    :active.sync="isLoading"
                    :is-full-page="loaderOptions.IS_FULL_PAGE"
                    :color="loaderOptions.COLOR"
            ></loading>
            <router-link :to="{ path: '/dashboard/shop/basket' }" class="shop-back d-inline-flex align-items-center">
                <SvgIcon icon="arrowLeft"></SvgIcon>
                <span class="ml-2">Basket</span>
            </router-link>
            <div class="row mt-5">
                <div class="col-12 col-sm-12 col-xl-8 pr-xl-5" v-if="isShippingLoaded">
                    <div class="checkout-shipping d-flex justify-content-between mb-3">
                        <div class="title-size3 titleGreenNavyColor">Shipping Info</div>
                        <div class="checkout-shipping-edit d-flex justify-content-between" @click="editShippingInfo()">
                            <SvgIcon icon="pencil"></SvgIcon>
                            <span class="ml-2 user-select-none">Edit</span>
                        </div>
                    </div>
                    <div class="checkout-shipping-box">
                        <div class="checkout-shipping-box-field">
                            <div class="checkout-shipping-box-field-icon">
                                <SvgIcon icon="user"></SvgIcon>
                            </div>
                            <div class="checkout-shipping-box-field-text">{{shippingInfo.fullName}}</div>
                        </div>
                        <div class="checkout-shipping-box-field">
                            <div class="checkout-shipping-box-field-icon">
                                <SvgIcon icon="location2"></SvgIcon>
                            </div>
                            <!-- TODO: use correct data to display -->
                            <div class="checkout-shipping-box-field-text">{{shippingInfo.address || '-'}}</div>
                        </div>
                        <div class="checkout-shipping-box-field">
                            <div class="checkout-shipping-box-field-icon">
                                <SvgIcon icon="phone"></SvgIcon>
                            </div>
                            <div class="checkout-shipping-box-field-text">{{shippingInfo.phoneNumber || '-'}}</div>
                        </div>
                    </div>

                    <div class="checkout-payment d-flex justify-content-between mt-5 mb-3">
                        <div class="title-size3 titleGreenNavyColor">Payment Method</div>
                        <div class="checkout-payment-edit d-flex justify-content-between" @click="editPaymentMethod()">
                            <SvgIcon icon="pencil"></SvgIcon>
                            <span class="ml-2 user-select-none">Edit</span>
                        </div>
                    </div>
                    <div class="checkout-payment-box">
                        <div class="checkout-payment-box-field">
                            <div class="checkout-payment-box-field-icon">
                                <SvgIcon icon="creditCard"></SvgIcon>
                            </div>
                            <div class="checkout-payment-box-field-text">{{paymentMethod.cardToken.placeholder}}</div>
                        </div>
                        <div class="checkout-payment-box-field">
                            <div class="checkout-payment-box-field-icon">
                                <b-form-checkbox
                                        class="checkbox-icon-size-24 cursor-pointer"
                                        v-model="paymentMethod.useShippingAddress"
                                        name="check"
                                ></b-form-checkbox>
                            </div>
                            <div
                                    class="checkout-payment-box-field-text cursor-pointer user-select-none"
                                    @click="paymentMethod.useShippingAddress = !paymentMethod.useShippingAddress"
                            >
                                Use Shipping Address
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-12 col-xl-4 mt-5 mt-xl-0 checkout-price-wrapper" v-if="isPriceLoaded">
                    <div class="shop-price-box">
                        <div class="shop-price-subtotal mb-3">
                            <div class="shop-price-subtotal-title">Subtotal</div>
                            <div class="shop-price-subtotal-price">{{priceInfo.subTotal.text}}</div>
                        </div>
                        <div class="shop-price-tax mb-3">
                            <div class="shop-price-tax-title">Tax</div>
                            <div class="shop-price-tax-price">{{priceInfo.tax.text}}</div>
                        </div>
                        <div class="shop-price-subtotal mb-3">
                            <div class="shop-price-subtotal-title">Shipping</div>
                            <div class="shop-price-subtotal-price">{{priceInfo.shipping.text}}</div>
                        </div>
                        <div class="shop-price-total mb-3">
                            <div class="shop-price-total-title">Total</div>
                            <div class="shop-price-total-price">{{priceInfo.total.text}}</div>
                        </div>
                    </div>

                    <div class="clear-line"></div>

                    <div class="box-btn">
                        <b-btn
                                class="btnGreen btnNormalSize btnUpper btn100 hover-slide-left"
                                :disabled="isSubmitting"
                                @click.stop.prevent="postOrder()"
                        >
                            <span>Place order</span>
                        </b-btn>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-8 col-md-10 col-lg-9 col-xl-8 mx-auto text-center" v-else>
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

        <!-- Modals -->
        <ShippingInfoModal :prev-values="modalShippingInfo" @shipping-info-saved="onShippingInfoSaved"></ShippingInfoModal>
    </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon';
import ShippingInfoModal from '../../components/modals/ShippingInfoModal';
import helpers from '../../helpers';
import Loading from 'vue-loading-overlay';
import config from '../../config';
import api from '../../api';
export default {
    name: "Checkout",
    components: {SvgIcon, Loading, ShippingInfoModal},
    data: () => ({
        loaderOptions: { ...config.LOADER_OPTIONS },
        isLoading: false,
        shippingInfo: {
            fullName: '',
            address: '5555 Main St. Austin, Texas 78741 USA',
            phoneNumber: ''
        },
        paymentMethod: {
            cardToken: {
                placeholder: '**** **** **** 5555',
                data: null
            },
            useShippingAddress: true
        },
        priceInfo: {
            subTotal: { value: 0, text: '$0' },
            tax: { value: 0, text: '$0' },
            shipping: { value: 0, text: '$0' },
            total: { value: 0, text: '$0' }
        },
        isBasketEmpty: false,
        basketItems: [],
        shippingPrice: 5,
        isPriceLoaded: false,
        isSubmitting: false,
        isShippingLoaded: false,
        modalShippingInfo: {
            fullName: '',
            address: '',
            phone: ''
        }
    }),
    created () {
        this.prepareData();
    },
    methods: {
        prepareData () {
            this.isLoading = true;
            const _basket = this.$store.getters.basket;
            if (!_basket || !_basket.length) {
                this.isBasketEmpty = true;
                this.isLoading = false;
                return;
            }
            this.basketItems = _basket.map(item => item);
            this.calculatePrice();
            const _shippingInfo = this.$store.getters.shippingInfo;
            if (_shippingInfo && Object.keys(_shippingInfo).length) {
                this.shippingInfo.fullName = _shippingInfo.fullName;
                this.shippingInfo.address = _shippingInfo.address;
                this.shippingInfo.phoneNumber = _shippingInfo.phoneNumber;
                this.isLoading = false;
                this.isShippingLoaded = true;
                return;
            }
            const _user = { ...this.$store.getters.userInfo };
            if (!_user || !_user.fullName) {
                api.dashboard.userInfo()
                    .then((data) => {
                        this.$store.commit('userInfo', { ...data });
                        this.shippingInfo.fullName = data.fullName;
                        this.shippingInfo.phoneNumber = data.phone || '';
                        this.$store.commit('shippingInfo', { ...this.shippingInfo });
                        this.isLoading = false;
                        this.isShippingLoaded = true;
                    })
                    .catch((err) => {
                        this.isLoading = false;
                        this.isShippingLoaded = true;
                    });
            } else {
                this.shippingInfo.fullName = _user.fullName;
                this.shippingInfo.phoneNumber = _user.phone || '';
                this.$store.commit('shippingInfo', { ...this.shippingInfo });
                this.isLoading = false;
                this.isShippingLoaded = true;
            }
        },
        calculatePrice () {
            if (!this.basketItems || !this.basketItems.length) return;
            const koeff = 11.49;
            let _price = 0;
            let _tax = 0;
            let _total = 0;
            this.basketItems.forEach(item => {
                _price += Number(item.count) * Number(item.price);
            });
            _tax = _price / koeff;
            _total = _price + _tax + this.shippingPrice;

            this.priceInfo.subTotal.value = _price;
            this.priceInfo.subTotal.text = helpers.convertCurrency(_price);
            this.priceInfo.tax.value = _tax;
            this.priceInfo.tax.text = helpers.convertCurrency(_tax);
            this.priceInfo.shipping.value = this.shippingPrice;
            this.priceInfo.shipping.text = helpers.convertCurrency(this.shippingPrice);
            this.priceInfo.total.value = _total;
            this.priceInfo.total.text = helpers.convertCurrency(_total);
            this.isPriceLoaded = true;
        },
        editShippingInfo () {
            this.modalShippingInfo.fullName = this.shippingInfo.fullName;
            this.modalShippingInfo.address = this.shippingInfo.address;
            this.modalShippingInfo.phone = this.shippingInfo.phoneNumber;
            this.$bvModal.show('shipping-info-modal');
        },
        editPaymentMethod () {
            // TODO
        },
        postOrder () {
            // TODO: use api when ready
            // temp
            this.isLoading = true;
            this.isSubmitting = true;
            setTimeout(() => {
                this.isLoading = false;
                this.isSubmitting = false;
                this.$store.commit('clearBasket');
                this.$store.commit('clearShippingInfo');
                this.$eventHub.$emit('basket-reset');
                this.$router.push({ path: '/dashboard/shop/success' });
            }, 3000);
        },
        onShippingInfoSaved (data) {
            if (data.fullName && data.fullName.length) {
                this.shippingInfo.fullName = data.fullName;
            }
            if (data.phone) {
                this.shippingInfo.phoneNumber = data.phone;
            }
            if (data.address && data.address.length) {
                this.shippingInfo.address = data.address;
            }
            this.$store.commit('shippingInfo', { ...this.shippingInfo });
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.checkout-shipping-box, .checkout-payment-box {
    background-color: $whiteColor;
    box-shadow: 0 4px 16px rgba(69,53,38,0.15);
    padding: 34px;
    border-radius: 4px;
}
.checkout-payment-box-field, .checkout-shipping-box-field {
    display: flex;
    margin-bottom: 24px;
    &:last-child {
        margin-bottom: 0;
    }
    .checkout-shipping-box-field-icon, .checkout-payment-box-field-icon {
        margin-right: 16px;
        flex: none;
    }
}
.checkout-shipping .checkout-shipping-edit, .checkout-payment .checkout-payment-edit {
    cursor: pointer;
    span {
        color: $greenColor;
        font-family: $LacaProSemiBold;
        font-size: 18px;
        letter-spacing: 0.6px;
        line-height: 24px;
    }
}
.checkout-price-wrapper {
    .box-btn {
        margin-top: 10px;
    }
    @media screen and (max-width: 1199px) {
        .shop-price-box {
            width: 50%;
            float: right;
            margin-bottom: 10px;
        }
        .clear-line {
            float: right;
        }
        .box-btn {
            float: none;
            clear: both;
            margin-top: 0;
        }
    }
}
</style>
