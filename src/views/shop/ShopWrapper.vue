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

        <!-- TODO: show total amount at top-right corner for some pages -->
    </div>
</template>

<script>
import HeroWave from '../../components/HeroWave';
export default {
    name: "ShopWrapper",
    components: {HeroWave},
    data: () => ({
        headerTitle: ''
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.headerTitle = to.meta.headerTitle || 'Shop';
        })
    },
    beforeRouteUpdate (to, from, next) {
        this.headerTitle = to.meta.headerTitle || 'Shop';
        next();
    },
    methods: {

    },
    created () {

    }
}
</script>

<style scoped>

</style>
