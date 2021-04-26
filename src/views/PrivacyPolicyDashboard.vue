<template>
    <div class="privacy-page-wrapper">
        <div class="dashboard-content">
            <div class="container-fluid position-relative">
                <PrivacyContent></PrivacyContent>
            </div>
        </div>
    </div>
</template>

<script>
import PrivacyContent from '../components/PrivacyContent';
export default {
    name: "PrivacyPolicyDashboard",
    components: {PrivacyContent}
}
</script>

<style scoped lang="scss">
.privacy-page-wrapper {
    width: 100%;
    overflow: hidden;
}
</style>
