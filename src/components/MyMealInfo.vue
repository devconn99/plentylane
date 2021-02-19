<template>
    <div class="my-meal-info-wrapper" v-if="itemData && itemData.id">
        <div class="reserved-box p-2 p-xl-3">
            <div class="reserved-info">
                <div class="reserved-img mr-2 mr-xl-3">
                    <img
                            src="../assets/images/data/images/dashboard/reserved/soup.jpg"
                            alt=""
                            class="img-fluid cursor-pointer"
                            @click="redirect"
                    >
                </div>
                <div class="reserved-boxtitle">
                    <div class="reserved-title">
                        <div class="title-size3 titleDarkColor cursor-pointer" @click="redirect">{{itemData.meal.name}}</div>
                        <!-- TODO -->
                        <!--<div class="reserved-time title-size3 titleGreenLightColor">222h</div>-->
                    </div>
                    <div class="serving-number mt-1" v-html="numOfServingsHtml"></div>
                </div>
            </div>
            <div class="cook-box mt-3">
                <div class="cook-info-additional pl-3 pl-sm-4 pl-md-5 pr-3 pr-sm-4 pr-md-5">
                    <div class="cook-time">
                        <SvgIcon icon="clock"></SvgIcon>
                        <span class="ml-3">{{readyTimeStr}}</span>
                    </div>
                    <div class="cook-location mt-1 mt-md-2">
                        <SvgIcon icon="location"></SvgIcon>
                        <span class="ml-3 titleGreenLightColor text-underline'">{{itemData.place.address}}</span>
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
    name: "MyMealInfo",
    components: {SvgIcon},
    props: ['itemData', 'isMyMeal'],
    methods: {
        redirect () {
            if (!this.itemData || !this.itemData.id) return;
            const path = this.isMyMeal ? `/dashboard/my-offers/${this.itemData.id}` : `/dashboard/offers/${this.itemData.id}`;
            this.$router.push({ path: path }).catch(()=>{});
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
        }
    }
}
</script>

<style scoped lang="scss">
.my-meal-info-wrapper {
    + .my-meal-info-wrapper {
        margin-top: 20px;
    }
}
</style>
