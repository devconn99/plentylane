<template>
    <div v-if="cookInfo && cookInfo.id">{{cookInfo.fullName}}'s profile goes here...</div>
</template>

<script>
import api from '../api';
export default {
    name: "CookProfile",
    data: () => ({
        isLoaded: false,
        cookId: '',
        cookInfo: null
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.clearData();
            const { id = '' } = vm.$route.params;
            vm.cookId = id;
            vm.loadPageData();
        })
    },
    beforeRouteUpdate (to, from, next) {
        const _loading = this.$loading.show();
        this.clearData();
        const { id = '' } = to.params;
        this.cookId = id;
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
            this.isLoaded = false;
            this.cookInfo = null;
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
            this.isLoaded = true;
            this.hideGlobalLoader();
            if (cb) cb();
        },
        loadPageData (cb) {
            if (!this.cookId) {
                this.errLoadingDataHandler(cb);
                return;
            }
            // TODO: load user's offers (to show them as "Meals")
            // TODO: load reviews (api is not ready?)
            // TODO: add ability to load more offers, more reviews
            api.dashboard.users.getUserInfo(this.cookId)
                .then(result => {
                    this.cookInfo = result;
                    this.hideGlobalLoader();
                    if (cb) cb();
                })
                .catch(err => {
                    this.errLoadingDataHandler(cb, err);
                });
        }
    }
}
</script>

<style scoped>

</style>
