<template>
    <div class="row">
        <div class="col-12">
            <div class="dashboard-title-box flex-row align-items-center mb-5 mt-2 mt-lg-3">
                <div class="dashboard-profile-title-back mr-2 mr-md-3">
                    <div class="cursor-pointer" @click="showMobileAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                    </div>
                </div>
                <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">Orders</div>
            </div>

            <!-- temp -->
            <p>Orders page content goes here...</p>
        </div>
    </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon';
export default {
    name: "Orders",
    components: {SvgIcon},
    methods: {
        showMobileAside () {
            this.$eventHub.$emit('show-mobile-profile-aside');
        }
    }
}
</script>

<style scoped>

</style>
