<template>
    <div id="home-page">
        <Header activeItem="terms"></Header>

        <main>
            <section class="hero green-bg">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-7 col-md-10 mx-auto text-center">
                            <h1 class="title-size1 titleLightColor mb-4">Food Safety</h1>
                        </div>
                    </div>
                </div>

                <HeroWave></HeroWave>
            </section>

            <section class="faq pad-70">
                <div class="container">
                    <div class="row">
                        <div class="col-12 mx-auto">
                            <p>Page content goes here...</p>
                        </div>
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
import HeroWave from '../components/HeroWave';
import PromoLogo from '../components/homepage/PromoLogo';

export default {
    name: "FoodSafety",
    components: {Footer, Header, BackToTop, HeroWave, PromoLogo}
}
</script>

<style scoped>

</style>
