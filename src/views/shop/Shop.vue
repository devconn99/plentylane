<template>
    <div>
        <div class="row mb-4">
            <div class="col-12">
                <div class="dashboard-title-box">
                    <div class="title-size3 titleGreenNavyColor">Shop containers</div>
                </div>
            </div>
        </div>
        <div class="row" v-if="isLoaded">
            <template v-if="items && items.length">
                <div class="col-sm-6 col-xl-4 mb-4" v-for="item in items">
                    <div class="shop-box">
                        <div class="shop-box-img">
                            <!-- TODO: use correct image for each item -->
                            <img src="../../assets/images/data/images/dashboard/shop/img-1.svg" alt=""
                                 class="img-fluid">
                        </div>
                        <div class="shop-box-info">
                            <div>
                                <div class="shop-box-title mb-1">{{item.title}}</div>
                                <div class="shop-box-price mb-1">{{item.currency || '$'}}{{item.price}}</div>
                            </div>
                            <div class="shop-box-btn">
                                <div class="btn-round cursor-pointer" @click="addItemToBasket(item)">
                                    <SvgIcon icon="plus"></SvgIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="col-12">
                    <!-- TODO: get back to it later -->
                    <p>There are no available items.</p>
                </div>
            </template>
        </div>

        <!-- Modals -->
        <AddedToBasketModal></AddedToBasketModal>
    </div>
</template>

<script>
import api from "../../api";
import SvgIcon from '../../components/SvgIcon';
import AddedToBasketModal from '../../components/modals/AddedToBasketModal';
export default {
    name: "Shop",
    components: {SvgIcon, AddedToBasketModal},
    data: () => ({
        items: [],
        isLoaded: false
    }),
    created () {
        this.loadShopItems();
    },
    methods: {
        hideGlobalLoading () {
            if (this.$loader && this.$loader.hide) {
                setTimeout(() => {
                    this.$loader.hide()
                }, 0);
            }
        },
        loadShopItems () {
            // TODO: temp endpoint
            api.dashboard.shop.getContainers()
                .then(result => {
                    this.items = result;
                    this.isLoaded = true;
                    this.hideGlobalLoading();
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isLoaded = true;
                    this.hideGlobalLoading();
                })
        },
        addItemToBasket (item) {
            this.$store.commit('addToBasket', { ...item, count: 1 });
            this.$eventHub.$emit('added-item-to-basket', item.price);
            this.$bvModal.show('added-to-basket-modal');
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.shop-box {
    box-shadow: 0 4px 16px rgba(69,53,38,0.15);
    background-color: $whiteColor;
    position: relative;
    font-family: $FilsonProRegular;
    -webkit-transition: .3s all ease;
    -o-transition: .3s all ease;
    transition: .3s all ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    &:hover {
        box-shadow: 0 6px 18px rgba(69,53,38,0.3);
        -webkit-transition: .3s all ease;
        -o-transition: .3s all ease;
        transition: .3s all ease;
    }
    .shop-box-img {
        position: relative;
        text-align: center;
        padding: 22px 50px;
        img {
            max-width: 100%;
            width: 160px;
            height: 160px;
            object-fit: cover;
        }
    }
    .shop-box-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 16px;

        .shop-box-title {
            font-family: $LacaProSemiBold;
            color: $textBlackColor;
            font-size: 24px;
            line-height: 24px;
        }
        .shop-box-price {
            color: $textBlackColor;
            font-size: 16px;
            line-height: 24px;
        }

        .shop-box-btn {
            display: flex;
            align-items: flex-end;
            flex-direction: column;

            .btn-round {
                width: 64px !important;
                height: 64px !important;
                -webkit-transition: background-color 0.3s ease;
                -moz-transition: background-color 0.3s ease;
                -ms-transition: background-color 0.3s ease;
                -o-transition: background-color 0.3s ease;
                transition: background-color 0.3s ease;
            }
        }
    }
}
</style>
