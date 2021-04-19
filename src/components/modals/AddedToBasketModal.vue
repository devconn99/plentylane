<template>
    <b-modal
            id="added-to-basket-modal"
            ref="addedToBasketModal"
            size="lg"
            centered
            modal-class="added-to-basket-modal modal-with-buttons"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 mb-md-5 text-center">Item added to your basket!</div>
            <div class="shop-box">
                <div class="shop-box-img">
                    <img src="../../assets/images/data/images/dashboard/shop/container-4pk.jpg" alt="" class="img-fluid">
                </div>
            </div>
        </div>
        <div slot="modal-title"></div>
        <div slot="modal-header-close">
            <div class="modal-popup-title-icon">
                <SvgIcon icon="closeModalIcon"></SvgIcon>
            </div>
        </div>
        <template slot="modal-footer">
            <b-btn class="btnGreenTransparent btnNormalSize hover-slide-left" @click="redirectTo('basket')">
                <span>View your basket</span>
            </b-btn>
            <b-btn class="btnGreen btnNormalSize hover-slide-left" @click="redirectTo('checkout')">
                <span>Checkout</span>
            </b-btn>
        </template>
    </b-modal>
</template>

<script>
import SvgIcon from '../SvgIcon';
export default {
    name: "AddedToBasketModal",
    components: {SvgIcon},
    methods: {
        closeModal () {
            this.$bvModal.hide('added-to-basket-modal');
        },
        redirectTo (to) {
            this.$router.push({ path: `/dashboard/shop/${to}` })
                .then(() => {
                    this.closeModal();
                })
                .catch(() => {
                    this.closeModal();
                })
        }
    }
}
</script>

<style scoped>

</style>
