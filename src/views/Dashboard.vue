<template>
    <p>Dashboard page goes here...</p>
</template>

<script>
import api from '../api';
export default {
    name: "Dashboard",
    data: () => ({

    }),
    created () {
        this.getUserInfo();
    },
    methods: {
        getUserInfo () {
            api.dashboard.userInfo()
                .then((data) => {
                    this.$store.commit('userInfo', { ...data });
                    // TODO
                })
                .catch((err) => {});
        }
    }
}
</script>

<style scoped>

</style>
