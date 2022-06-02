<template>
  <div id="home-page">
    <Header activeItem="works" isGreenColor></Header>

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
                <p>
                  A meal swapping network built to make sharing food as easy as pie…
                  or lasagna… or whatever you and your family are in the mood for!
                </p>
                <span>
                  So how does Plenty Lane work?
                  <ul>
                    It’s delightfully simple:
                    <li>Cook meals and share them with neighbors for "tokens".</li>
                    <li>Use those tokens to claim meals from other cooks.</li>
                  </ul>
                </span>
                <div class="mb-4">
                  <img src="../assets/images/landing/tokens.png" alt="" class="img-fluid" />
                </div>
                <p>It’s that easy! No money is involved.</p>
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
            <div class="col-lg-4 col-sm-6 ml-auto text-center text-sm-left">
              <h3 class="title-size3 titleGreenNavyColor mb-3">Cook</h3>
              <p>
                Head over to Plenty Lane and let your neighbors know what you plan on cooking!
                Then cook a few extra servings to give away.
              </p>
            </div>
            <div class="col-lg-4 col-sm-6 mr-auto text-center mt-4 mt-sm-0">
              <img src="../assets/images/landing/img-cook1.png" alt="" class="img-fluid">
            </div>
          </div>

          <div class="row align-items-center pad-70b">
            <div class="col-lg-5 col-sm-6 order-sm-2 mr-auto text-center text-sm-left">
              <h3 class="title-size3 titleGreenNavyColor mb-3">Snap</h3>
              <p>Put the meals in the Plenty Lane Snap containers that come with your membership.</p>
            </div>
            <div class="col-lg-4 col-sm-6 order-sm-1 ml-auto text-center mt-4 mt-sm-0">
              <img src="../assets/images/landing/img-snap1.png" alt="" class="img-fluid">
            </div>
          </div>

          <div class="row align-items-center pad-70b">
            <div class="col-lg-5 col-sm-6 ml-auto text-center text-sm-left">
              <h3 class="title-size3 titleGreenNavyColor mb-3">Share</h3>
              <p>
                Your neighbors will come pick up the food at a time and place of your choosing and voila!
                Use your newly earned tokens to lighten your load on a busy day, treat yourself to a cuisine
                you don’t usually eat, or just take a night off from cooking!
              </p>
            </div>
            <div class="col-lg-4 col-sm-6 mr-auto text-center mt-4 mt-sm-0">
              <img src="../assets/images/landing/img-share1.png" alt="" class="img-fluid">
            </div>
          </div>

          <div class="align-items-center pad-70b">
            <router-link to="/login" class="btnLightRed btnNormalSize w-25 hover-slide-left mx-auto">
              <span>Join Plenty Lane</span>
            </router-link>
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
/***
 * @deprecated
 */
import Footer from "../components/homepage/Footer";
import Header from "../components/homepage/Header";
import BackToTop from '../components/BackToTop';
import HeroWave from '../components/HeroWave';
import PromoLogo from '../components/homepage/PromoLogo';

export default {
  name: "HowItWorks",
  components: {Footer, Header, BackToTop, HeroWave, PromoLogo},
  mounted () {
    window.scrollTo(0, 0); // temp
    this.$eventHub.$emit('mobile-side-nav-closed');
  }
}
</script>

<style scoped lang="scss">
.description {
  ul {
    text-align: left;
    margin: 10px 50px 25px 50px;
    li {
      list-style-type: circle;
    }
  }
}
</style>
