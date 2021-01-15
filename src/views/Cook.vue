<template>
    <div class="cook-page">
        <div class="cook-page-header d-flex">
            <p class="title-size1">Let's get cooking!</p>
            <!--<div class="cook-page-header-fixed-bottom">-->
                <!--<img src="../assets/images/dashboard/scoop.svg" alt="bottom svg" class="img-fluid">-->
            <!--</div>-->
        </div>
        <div class="cook-page-buttons-container d-flex flex-column">
            <router-link to="cook/new-meal" tag="button" class="main-btn btn-green-bright hover-slide-left mb-3">
                <span>
                    <i class="fas fa-plus"></i>
                    New Meal
                </span>
            </router-link>
            <b-button class="main-btn btn-green-bright hover-slide-left transparent">
                <span>
                    <i class="fas fa-sync"></i>
                    Copy Meal
                </span>
            </b-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Cook"
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.cook-page {
    .cook-page-header {
        height: 256px;
        width: 100%;
        position: relative;
        background-color: $orangeColor;
        justify-content: center;
        align-items: center;
    }
    .cook-page-buttons-container {
        margin-top: 120px;
        justify-content: center;
        align-items: center;

        .main-btn {
            max-width: 400px;
            @media screen and (max-width: $phoneBigWidth) {
                max-width: 100%;
            }
        }
    }
}
</style>
