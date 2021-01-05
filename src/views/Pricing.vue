<template>
    <div>
        <NavbarWrapper>
            <p class="header">Pricing</p>
        </NavbarWrapper>
        <Footer></Footer>
    </div>
</template>

<script>
import NavbarWrapper from '../components/NavbarWrapper.vue'
import Footer from "../components/Footer";
export default {
    name: "Pricing",
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
</style>
