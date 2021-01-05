<template>
  <div class="home">
    <NavbarWrapper>
      <section class="top-section d-flex">
        <div class="img-holder d-flex flex-column">
          <img class="phone-img" src="../assets/phone-cropped.png" alt="Phone">
        </div>
        <div class="top-section-text-wrapper d-flex flex-column">
          <p class="title">Tired of cooking dinner?</p>
          <p class="section-text">Plenty Lane is launching a meal swapping network to lighten your load. It’s simple!</p>
          <button class="btn btn-sign-up" type="button">Sign Up Today!</button>
        </div>
      </section>
    </NavbarWrapper>
    <section class="promo-section d-flex flex-column align-items-center">
      <p class="title">What is Plenty Lane?</p>
      <p class="section-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed vehicula massa, vitae semper ante. Proin
        tincidunt et nunc sed iaculis.
      </p>
      <div class="video-wrapper"></div>
    </section>
    <section class="section-description d-flex justify-content-center align-items-center">
      <div class="text-wrapper d-flex flex-column">
        <p class="title">As easy as Cook, Snap, Share!</p>
        <p class="section-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed vehicula massa, vitae semper ante. Proin
          tincidunt et nunc sed iaculis. Pellentesque posuere molestie risus, at tempus orci molestie non. Nulla ut
          cursus est.
        </p>
      </div>
      <div class="img-holder d-flex flex-column">
        <img src="../assets/img-cook-snap-share.svg" alt="Image cook snap share">
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import NavbarWrapper from '../components/NavbarWrapper.vue'
import Footer from "../components/Footer";
export default {
  name: 'Home',
    components: {Footer, NavbarWrapper}
}
</script>

<style lang="scss" scoped>
section {
  width: 100%;
}
.title {
  color: #184E59;
}
.section-text {
  color: #181816;
}
.top-section {
  justify-content: center;
  align-items: flex-start;
  .img-holder {
    width: 100%;
    max-width: 286px;
    flex: 1 1 100%;
    margin-right: 35px;
    .phone-img {
      width: 100%;
      height: auto;
    }
  }
  .top-section-text-wrapper {
    max-width: 440px;
    width: 100%;
    flex: 1 1 100%;
    margin-left: 35px;
    margin-top: 60px;
    .title {
      color: #FEF8E6;
      font-size: 56px;
      line-height: 56px;
      letter-spacing: 0;
      text-align: left;
      font-weight: bold;
      margin-bottom: 25px;
      // TODO: check font family!
    }
    .section-text {
      color: #FEF8E6;
      font-size: 24px;
      letter-spacing: 0;
      line-height: 28.8px;
      text-align: left;
      margin-bottom: 20px;
    }
    .btn-sign-up {
      width: 240px;
      min-height: 48px;
      color: #FFFEFA;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 0.6px;
      line-height: 18px;
      background-color: #FF806D;
      border-color: #FF806D;
      border-radius: 0;
      margin-top: 15px;
    }
  }
}
.promo-section {
  background-color: #FEF8E6;
  padding-top: 64px;
  padding-bottom: 64px;

  .title {
    font-size: 40px;
    line-height: 40px;
  }
  .section-text {
    font-size: 24px;
    line-height: 28.8px;
    max-width: 70%; // TODO: temp
  }
  .video-wrapper {
    width: 800px;
    height: 450px;
    background: #181816 url('../assets/video-placeholder.svg') no-repeat;
    margin-top: 40px;
  }
}
.section-description {
  background-color: #FFFEFA;
  padding: 48px 160px;
  .text-wrapper {
    max-width: 400px;
    width: 100%;
    margin-right: 40px;
    flex: 1 1 100%;
    .title {
      font-size: 24px;
      line-height: 24px;
    }
    .section-text {
      font-size: 16px;
      line-height: 24px;
    }
  }
  .img-holder {
    margin-left: 40px;
    width: 100%;
    flex: 1 1 100%;
    max-width: 481px;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
