<template>
    <div id="home-page">
        <Header activeItem="privacy"></Header>

        <main>
            <section class="header-with-wave">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-12 mx-auto mb-5 mb-sm-0 text-center mt-md-4">
                            <h1 class="title-size1 titleGreenNavyColor mb-4">Privacy</h1>
                        </div>
                    </div>
                </div>

                <img class="header-img-doors" src="../assets/images/elements/landing/hero/header.svg" alt="">
            </section>

            <section class="faq pad-70">
                <div class="container">
                    <div class="row">
                        <PrivacyContent :class-name="'col-12 mx-auto'"></PrivacyContent>
                    </div>
                </div>
            </section>

            <PromoLogo></PromoLogo>
        </main>

        <Footer></Footer>

        <BackToTop></BackToTop>
    </div>
</template>

<script>
import Footer from '../components/homepage/Footer';
import Header from '../components/homepage/Header';
import BackToTop from '../components/BackToTop';
import PromoLogo from '../components/homepage/PromoLogo';
import PrivacyContent from '../components/PrivacyContent';

export default {
    name: "Privacy",
    components: {Footer, Header, BackToTop, PromoLogo, PrivacyContent}
}
</script>

<style scoped lang="scss">
</style>
