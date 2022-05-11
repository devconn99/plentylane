<template>
    <div class="row">
        <div class="col-12 col-sm-8 col-md-10 col-lg-9 col-xl-8 mx-auto text-center">
            <div class="dashboard-title-box mb-3">
                <div class="title-size3 titleGreenNavyColor">Your order is complete!</div>
            </div>
            <p>Your plan is successfully updated.</p>
            <div class="title-size3 titleGreenNavyColor mt-5 mb-3">Now what?</div>
            <div class="box-btn">
                <router-link
                        :to="{ path: '/dashboard' }"
                        class="btnGreenTransparent btnHugeSize btn100 hover-slide-left"
                >
                    <span>Continue</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PlanSuccess"
    }
</script>
