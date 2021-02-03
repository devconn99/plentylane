<template>
    <p class="m-5">Edit meal page goes here...</p>
</template>

<script>
import api from '../api';
export default {
    name: "EditMeal",
    data: () => ({
        mealId: '',
        mealOriginalInfo: null
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.clearData();
            const { id = '' } = vm.$route.params;
            vm.mealId = id;
            vm.loadPageData();
        })
    },
    beforeRouteUpdate (to, from, next) {
        const _loading = this.$loading.show();
        this.clearData();
        const { id = '' } = to.params;
        this.mealId = id;
        const cb = () => {
            next();
            if (_loading && _loading.hide) {
                _loading.hide();
            }
        };
        this.loadPageData(cb);
    },
    methods: {
        clearData () {
            // TODO
            this.mealOriginalInfo = null;
        },
        hideGlobalLoader () {
            if (this.$loader && this.$loader.hide) {
                setTimeout(() => {
                    this.$loader.hide()
                }, 0);
            }
        },
        errLoadingDataHandler (cb, err) {
            if (err) {
                console.log('\n >> err > ', err);
            }
            this.hideGlobalLoader();
            if (cb) cb();
        },
        loadPageData (cb) {
            if (!this.mealId) {
                this.errLoadingDataHandler(cb);
                return;
            }
            api.dashboard.meals.getMealById(this.mealId)
                .then(result => {
                    this.mealOriginalInfo = { ...result };
                    this.hideGlobalLoader();
                    if (cb) cb();
                })
                .catch(err => {
                    this.errLoadingDataHandler(cb ? cb : null, err);
                });
        }
    }
}
</script>

<style scoped>

</style>
