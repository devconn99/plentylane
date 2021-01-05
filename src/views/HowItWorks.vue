<template>
    <div>
        <NavbarWrapper>
            <p class="header">How It Works</p>
        </NavbarWrapper>
        <!--<section class="content-section">-->
            <!-- TODO: add content -->
        <!--</section>-->
        <Footer></Footer>
    </div>
</template>

<script>
import NavbarWrapper from '../components/NavbarWrapper.vue'
import Footer from "../components/Footer";
export default {
    name: "HowItWorks",
    components: {Footer, NavbarWrapper}
}
</script>

<style scoped lang="scss">
.header {
    color: #FEF8E6;
    font-weight: bold;
    font-size: 56px;
    letter-spacing: 0;
    line-height: 56px;
    text-align: center;
    margin-top: 35px;
}
/*.content-section {*/
    /*min-height: 494px;*/
    /*background-color: #FEF8E6;*/
/*}*/
</style>
