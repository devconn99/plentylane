<template>
    <section class="promo lightGreen-bg pad-40">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <img src="../../assets/images/landing/share-more-clean-less.svg" alt="" class="img-fluid">
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "PromoLogo"
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.promo {
    img {
        @media screen and (min-width: $tableWidth + 1) {
            max-width: 320px;
        }
        @media screen and (max-width: $tableWidth) {
            max-width: 280px;
        }
        @media screen and (max-width: $phoneBigWidth) {
            max-width: 190px;
        }
    }
}
</style>
