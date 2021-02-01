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
                Plenty Lane is launching a meal swapping network to lighten your load. It’s simple!
              </div>
              <router-link to="/sign-up" class="btnLightRed btnNormalSize btn50 hover-slide-left">
                <span>Sign Up Today!</span>
              </router-link>
            </div>
            <div class="col-lg-4 col-md-5 col-sm-5 ml-auto order-sm-1">
              <div class="hero-img">
                <img src="../assets/images/landing/hero2.png" alt="" class="img-fluid">
              </div>
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
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed vehicula massa,
                  vitae
                  semper ante. Proin tincidunt et
                  nunc sed iaculis.</p>
              </div>
            </div>
            <div class="col-lg-9 col-md-10 mx-auto text-center mt-5">
              <p>Variant 1 - .mp4 or webm video</p>
              <!-- You can delete class video-shadow -->
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
          </div>
        </div>
      </section>

      <section class="benefits light-bg pad-70">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-5 col-sm-6 ml-auto text-center text-sm-left">
              <h3 class="title-size3 titleGreenNavyColor mb-3">As easy as Cook, Snap, Share!</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed vehicula massa, vitae
                semper ante. Proin tincidunt et
                nunc sed iaculis. Pellentesque posuere molestie risus, at tempus orci molestie non.
                Nulla ut
                cursus est.</p>
            </div>
            <div class="col-lg-5 col-sm-6 mr-auto text-center mt-4 mt-sm-0">
              <img src="../assets/images/landing/img-cook-snap-share.svg" alt="" class="img-fluid">
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
import Header from '../components/homepage/Header';
import BackToTop from '../components/BackToTop';
import HeroWave from '../components/HeroWave';
export default {
    name: 'Home',
    components: {Footer, Header, BackToTop, HeroWave},
    mounted () {
        window.scrollTo(0, 0); // temp
        this.$eventHub.$emit('mobile-side-nav-closed');
    }
}
</script>

<style lang="scss" scoped>
</style>
