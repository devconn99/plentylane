<template>
    <div id="home-page">
        <Header activeItem="pricing"></Header>

        <main>
            <section class="hero green-bg">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-7 col-md-10 mx-auto text-center">
                            <h1 class="title-size1 titleLightColor mb-4">Pricing</h1>
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
                                <p>Our pricing model was crafted to make sure that no matter what plan you are on, you
                                    can swap as much as you want with
                                    the people in your network. Want to expand your network to swap with more people? Go
                                    for our Casual Plan! Ready to
                                    unlock everything Plenty Lane has to offer and swap with every Laner out there? Jump
                                    aboard our Unlimited Plan!</p>
                            </div>
                            <div class="background-element pad-70t">
                                <div class="fork"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="price pad-70b">
                <div class="container">
                    <div class="row">
                        <div class="col-xl-11 mx-auto">
                            <div class="row">
                                <div class="col-md-6 col-lg-4 mx-auto mb-4 mb-lg-0">
                                    <div class="price-box text-center">
                                        <div class="price-info">
                                            <h3 class="title-size2 titleGreenNavyColor mb-3">Starter</h3>
                                            <div class="price-member mb-3">
                                                Swap with
                                                <span>7</span>
                                                other members
                                            </div>
                                            <div class="price-plan mb-4">$0/mo</div>
                                            <ul class="price-benefits mb-3">
                                                <li>$28.25 Signup Fee</li>
                                                <li>Includes 4 containers</li>
                                            </ul>
                                        </div>
                                        <div class="price-btn">
                                            <router-link to="/sign-up" class="btnLightRed btnNormalSize btn100 hover-slide-left">
                                                <span>Sign up with Starter</span>
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-4 mx-auto mb-4 mb-lg-0">
                                    <div class="price-box text-center">
                                        <div class="price-info">
                                            <h3 class="title-size2 titleGreenNavyColor mb-3">Casual</h3>
                                            <div class="price-member mb-3">
                                                Swap with
                                                <span>20</span>
                                                other members
                                            </div>
                                            <div class="price-plan mb-4">$4.95/mo</div>
                                            <ul class="price-benefits mb-3">
                                                <li>$28.25 Signup Fee</li>
                                                <li>Includes 4 containers</li>
                                            </ul>
                                        </div>
                                        <div class="price-btn">
                                            <router-link to="/sign-up" class="btnLightRed btnNormalSize btn100 hover-slide-left">
                                                <span>Sign up with Casual</span>
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 col-lg-4 mx-auto mb-4 mb-lg-0">
                                    <div class="price-box text-center">
                                        <div class="price-info">
                                            <h3 class="title-size2 titleGreenNavyColor mb-3">Unlimited</h3>
                                            <div class="price-member mb-3">
                                                Swap with
                                                <span>Unlimited</span>
                                                other members
                                            </div>
                                            <div class="price-plan mb-4">$8.95/mo</div>
                                            <ul class="price-benefits mb-3">
                                                <li>$28.25 Signup Fee</li>
                                                <li>Includes 4 containers</li>
                                            </ul>
                                        </div>
                                        <div class="price-btn">
                                            <router-link to="/sign-up" class="btnLightRed btnNormalSize btn100 hover-slide-left">
                                                <span>Sign up with Unlimited</span>
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3 mt-lg-5">
                        <div class="col-lg-7 col-md-10 mx-auto text-center">
                            <p>Additional text here about discounts or other pricing info… Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit.
                                Duis sed vehicula massa, vitae semper ante. Proin tincidunt et nunc sed iaculis.
                                Pellentesque posuere molestie risus, at
                                tempus orci molestie non. Nulla ut cursus est.</p>
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
import Footer from "../components/homepage/Footer";
import Header from "../components/homepage/Header";
import BackToTop from '../components/BackToTop';
import HeroWave from '../components/HeroWave';
export default {
    name: "Pricing",
    components: {Footer, Header, BackToTop, HeroWave},
    mounted () {
        window.scrollTo(0, 0); // temp
        this.$eventHub.$emit('mobile-side-nav-closed');
    }
}
</script>

<style scoped lang="scss">
</style>
