<template>
    <div id="home-page">
        <Header activeItem="works"></Header>

        <main>
            <section class="hero green-bg">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-7 col-md-10 mx-auto text-center">
                            <h1 class="title-size1 titleLightColor mb-4">How it Works</h1>
                        </div>
                    </div>
                </div>
                <HeroWave></HeroWave>
            </section>

            <section class="welcome pad-70">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-7 col-md-10 mx-auto text-center">
                            <div class="background-element pad-70b">
                                <div class="spoon"></div>
                            </div>
                            <div class="description">
                                <p>A meal swapping network built to make sharing food as easy as pie… or lasagna… or
                                    whatever you and your family are in
                                    the mood for!</p>

                                <p>So how does Plenty Lane work? It’s delightfully simple. Cook meals for credits, and
                                    then
                                    use those credits to claim
                                    meals from other Plenty Laners. It’s that easy.</p>
                            </div>
                            <div class="background-element pad-70t">
                                <div class="fork"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="benefits">
                <div class="container">
                    <div class="row align-items-center pad-70b">
                        <div class="col-lg-5 col-sm-6 ml-auto text-center text-sm-left">
                            <h3 class="title-size3 titleGreenNavyColor mb-3">Cook</h3>
                            <p>Head over to Plenty Lane and let your fellow Laners know what you plan on cooking! Then
                                pick
                                a favorite recipe and cook
                                a few extra servings to give away.</p>
                        </div>
                        <div class="col-lg-5 col-sm-6 mr-auto text-center mt-4 mt-sm-0">
                            <img src="../assets/images/landing/img-cook.png" alt="" class="img-fluid">
                        </div>
                    </div>

                    <div class="row align-items-center pad-70b">
                        <div class="col-lg-5 col-sm-6 order-sm-2 mr-auto text-center text-sm-left">
                            <h3 class="title-size3 titleGreenNavyColor mb-3">Snap</h3>
                            <p>Put the meals in the Plenty Lane glass containers that come with your membership (and
                                enjoy the snap of that lid!). Now,
                                just sit back and relax while your neighbors claim your delicious grub!</p>
                        </div>
                        <div class="col-lg-5 col-sm-6 order-sm-1 ml-auto text-center mt-4 mt-sm-0">
                            <img src="../assets/images/landing/img-snap.svg" alt="" class="img-fluid">
                        </div>
                    </div>

                    <div class="row align-items-center pad-70b">
                        <div class="col-lg-5 col-sm-6 ml-auto text-center text-sm-left">
                            <h3 class="title-size3 titleGreenNavyColor mb-3">Share</h3>
                            <p>Your neighbors will come pick up the food and viola! Use your newly earned credits to
                                lighten your load on a busy day,
                                treat yourself to a cuisine you don’t usually eat, or just take a night off from
                                cooking!</p>
                        </div>
                        <div class="col-lg-5 col-sm-6 mr-auto text-center mt-4 mt-sm-0">
                            <img src="../assets/images/landing/img-share.png" alt="" class="img-fluid">
                        </div>
                    </div>
                </div>
            </section>

            <section class="promo lightGreen-bg pad-40">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-center">
                            <img src="../assets/images/landing/plenty-to-share.svg" alt="" class="img-fluid">
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <Footer></Footer>

        <BackToTop></BackToTop>
    </div>
</template>

<script>
/***
 * @deprecated
 */
import Footer from "../components/homepage/Footer";
import Header from "../components/homepage/Header";
import BackToTop from '../components/BackToTop';
import HeroWave from '../components/HeroWave';
export default {
    name: "HowItWorks",
    components: {Footer, Header, BackToTop, HeroWave},
    mounted () {
        window.scrollTo(0, 0); // temp
        this.$eventHub.$emit('mobile-side-nav-closed');
    }
}
</script>

<style scoped lang="scss">
</style>
