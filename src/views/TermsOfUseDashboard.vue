<template>
    <div class="terms-page-wrapper">
        <div class="dashboard-content">
            <div class="container-fluid position-relative">
                <TermsContent></TermsContent>
            </div>
        </div>
    </div>
</template>

<script>
import TermsContent from '../components/TermsContent';
export default {
    name: "TermsOfUseDashboard",
    components: {TermsContent}
}
</script>

<style scoped lang="scss">
.terms-page-wrapper {
    width: 100%;
    overflow: hidden;
}
</style>
