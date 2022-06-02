<template>
  <div id="home-page">
    <Header activeItem="pricing" isGreenColor></Header>

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
                <p>Our pricing model was crafted to fit any budget.</p>
                <ul>
                  <li>Want to swap easily with just a few people for free? Join our Starter Plan!</li>
                  <li>Want to expand your network to swap with more people? Go for our Casual Plan!</li>
                  <li>Ready to unlock everything Plenty Lane has to offer? Jump aboard our Unlimited Plan!</li>
                </ul>
                <p>Your first month is on us, to give you time to build your swapping network.</p>
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
                      <div class="price-plan w-100">&nbsp;</div>
                      <div class="price-plan mb-4">$0/mo</div>
                      <ul class="price-benefits mb-3">
                        <li>Plus $29.50 for <br/>
                        four Plenty Lane containers* to swap meals in</li>
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
                      <div class="price-plan">$4.95/mo</div>
                      <div class="price-plan mb-4">$49.50/yr</div>
                      <ul class="price-benefits mb-3">
                        <li>Plus $29.50 for <br/> four Plenty Lane containers* to swap meals in</li>
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
                      <div class="price-plan">$8.95/mo</div>
                      <div class="price-plan mb-4">$89.50/yr</div>
                      <ul class="price-benefits mb-3">
                        <li>Plus $29.50 for <br/> four Plenty Lane containers* to swap meals in</li>
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
              <p style="font-size: 24px; line-height: 28.5px;">
                * Everyone swaps in the Plenty Lane Snap containers to set a standard for meal size and
                so you don't have to chase down your personal containers when the meal is done.
              </p>

              <div class="row mb-4">
                <img src="../assets/images/landing/container1.jpg" alt="" class="col-12 col-md-6 img-fluid" />
                <img src="../assets/images/landing/container2.jpg" alt="" class="col-12 col-md-6 img-fluid" />
              </div>

              <p>
                You can cancel at any time and the unused portion of your subscription will be refunded.
              </p>
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
import Header from "../components/homepage/Header";
import BackToTop from '../components/BackToTop';
import HeroWave from '../components/HeroWave';
import PromoLogo from '../components/homepage/PromoLogo';

export default {
  name: "Pricing",
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
    margin: 0 50px 25px 50px;
    li {
      list-style-type: circle;
    }
  }
}
</style>
