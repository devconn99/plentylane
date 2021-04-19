<template>
  <div id="home-page">
    <Header></Header>

    <main>
      <section class="hero hero-main green-bg">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6 col-sm-7 mr-auto mb-5 mb-sm-0 text-center text-sm-left order-sm-2">
              <h1 class="title-size1 titleLightColor mb-4">Tired of cooking dinner?</h1>
              <div class="description titleLightColor mb-4">
                <p class="description-sub-title">More Food, Less Work!</p>
                Plenty Lane’s meal swapping network helps friends and neighbors share home cooked meals.
              </div>
              <router-link to="/sign-up" class="btnLightRed btnNormalSize btn50 hover-slide-left">
                <span>Sign Up Today!</span>
              </router-link>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-5 ml-auto order-sm-1">
              <!-- TODO: remove this block when new graphics is ready -->
              <div class="empty-img-placeholder"></div>
              <!--<div class="hero-img">-->
                <!--<img src="../assets/images/landing/hero2.png" alt="" class="img-fluid">-->
              <!--</div>-->
            </div>
          </div>
        </div>
        <HeroWave></HeroWave>
      </section>

      <section class="welcome pad-70">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 col-md-10 mx-auto text-center">
              <h2 class="title-size2 titleGreenNavyColor mb-5">What is Plenty Lane?</h2>
              <div class="description">
                <p>Plenty Lane is a meal swapping network built to make sharing food with friends and neighbors
                  as easy as pie...or tacos...or whatever you’re in the mood for. We help you cut down on time
                  spent in the kitchen, reduce money spent on take out, and connect you with your community in
                  a new and meaningful way.</p>
                <p>When you’re cooking a little extra, go ahead and share it with your Plenty Lane community - they’ll
                  do the same. Next time you’d rather put on a robe than an apron, just pick up a meal from your
                  friends and neighbors, there’s plenty to go around!</p>
              </div>
            </div>
            <!-- TODO: insert actual video
            <div class="col-lg-9 col-md-10 mx-auto text-center mt-5">
              <p>Variant 1 - .mp4 or webm video</p>
              <div class="video-box video-shadow">
                <video class="video-js" loop autoplay preload muted playsinline
                       poster="../assets/images/landing/video.svg">
                  <source src="../assets/video/video_background.mp4" type="video/mp4">
                  </source>
                  <source src="" type="video/webm">
                  </source>
                </video>
              </div>
            </div>
            <div class="col-lg-9 col-md-10 mx-auto text-center mt-5">
              <p>Variant 2 - clickable image, will open popup with YouTube video</p>
              <a data-fancybox="gallery" href="https://www.youtube.com/watch?v=yQAZz3dYCDo">
                <img src="../assets/images/landing/video.svg" alt="" class="img-fluid" style="width: 100%">
              </a>
            </div>
            <div class="col-lg-9 col-md-10 mx-auto text-center mt-5">
              <p>Variant 3 - clickable button, will open popup with YouTube video</p>
              <div class="video-box-img">
                <img src="../assets/images/landing/video.svg" alt="" class="img-fluid"
                     style="width: 100%;">
                <div class="video-icon">
                  <a class="popup-video btn-icon" data-fancybox="gallery"
                     href="https://www.youtube.com/watch?v=up68UAfH0d0"><img
                          src="../assets/images/elements/landing/icons/play-button.svg" alt=""></a>
                </div>
              </div>
            </div>
            -->
          </div>
        </div>
      </section>

      <section class="benefits light-bg pad-70">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-7 col-md-10 mx-auto text-center">
              <h2 class="title-size2 titleGreenNavyColor mb-5">How it Works?</h2>
            </div>
          </div>

          <div class="row align-items-center">
            <div class="col-lg-5 col-sm-6 ml-auto text-center text-sm-left">
              <h3 class="title-size3 titleGreenNavyColor mb-3">As easy as Cook, Snap, Share!</h3>
              <p>Cook meals and give them to friends and neighbors for credits, then use those credits to take meals
                that others have made!</p>
            </div>
            <div class="col-lg-5 col-sm-6 mr-auto text-center mt-4 mt-sm-0">
              <img src="../assets/images/landing/img-cook-snap-share.svg" alt="" class="img-fluid">
            </div>
          </div>
        </div>
      </section>

      <section class="benefits pad-70">
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

          <div class="row">
            <div class="col-lg-7 col-md-10 mx-auto text-center">
              <div class="description">
                <p>Next time you want to lighten your load, try a new cuisine, or just take the night off from cooking,
                  visit Plenty Lane, find an enticing meal in your neighborhood, and use those credits you earned to
                  treat yourself. You’re worth it! </p>
              </div>
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
import Footer from "../components/homepage/Footer";
import Header from '../components/homepage/Header';
import BackToTop from '../components/BackToTop';
import HeroWave from '../components/HeroWave';
import PromoLogo from '../components/homepage/PromoLogo';

export default {
    name: 'Home',
    components: {Footer, Header, BackToTop, HeroWave, PromoLogo},
    mounted () {
        window.scrollTo(0, 0); // temp
        this.$eventHub.$emit('mobile-side-nav-closed');
    }
}
</script>

<style lang="scss" scoped>
</style>
