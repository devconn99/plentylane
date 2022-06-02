<template>
  <div id="home-page">
    <Header activeItem="faqs" isGreenColor></Header>

    <main>
      <section class="hero green-bg">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-7 col-md-10 mx-auto text-center">
              <h1 class="title-size1 titleLightColor mb-4">FAQs</h1>
            </div>
          </div>
        </div>
        <HeroWave></HeroWave>
      </section>

      <section class="faq pad-70">
        <div class="container">
          <div class="row">
            <div class="col-xl-11 mx-auto">
              <div class="accordion" role="tablist">
                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-1
                      aria-expanded="true"
                    >
                      What happens if I can’t pick up a meal I reserved?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-1"
                    visible
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-1')"
                  >
                    <div class="faq-text">
                      If you cancel your reservation at least 24 hours before the meal is ready
                      to be picked up, no tokens will be deducted from your account.
                      However, if you don’t pick up a meal you reserved, or cancel within 24 hours of
                      the scheduled pickup time, the tokens will still be deducted from your account.
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-2
                      aria-expanded="true"
                    >
                      Do I still get tokens for cooking if someone who reserved my meal cancels within
                      24 hours or doesn’t show to pick up their serving(s)?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-2"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-2')"
                  >
                    <div class="faq-text">
                      Yes, you do. Diners must cancel at least 24 hours in advance of your pick up time window
                      or you will earn their tokens even if they don’t show.
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-3
                      aria-expanded="true"
                    >
                      How do I cancel a meal I signed up to cook?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-3"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-3')"
                  >
                    <div class="faq-text">
                      TBD
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-4
                      aria-expanded="true"
                    >
                      What do I do if I want to share more servings than the number of
                      Plenty Lane Snap containers I have?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-4"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-4')"
                  >
                    <div class="faq-text">
                      <p class="mb-2">
                        You are only able to share the number of servings that you have
                        Plenty Lane Snap containers to deliver meals in.
                        Please do not use your own containers. With that said, we have solutions!
                        You can:
                      </p>

                      <ul class="list-decimal">
                        <li>
                          Plan to pick up meals from other Plenty Lane cooks before you cook your own meal.
                          You get to enjoy someone else’s delicious food and get more containers - it’s a win-win!
                        </li>
                        <li>
                          You can always order more containers from the
                          <router-link :to="{ path: '/dashboard/shop' }">Shop</router-link>
                          page on our website. Delivery takes about three days,
                          depending on where you live, so we recommend planning accordingly.
                        </li>
                      </ul>
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-5
                      aria-expanded="true"
                    >
                      How do I change the plan I am on or cancel my account?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-5"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-5')"
                  >
                    <div class="faq-text">
                      Either of those things can be done on your Account page, in your Plenty Lane profile.
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-6
                      aria-expanded="true"
                    >
                      What if no one takes the meals I post?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-6"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-6')"
                  >
                    <div class="faq-text">
                      If no one has reserved your meals by the time you start cooking, you can cancel the post and
                      stick with making only enough to feed your household. If it’s a recipe you can’t cut down on,
                      keep in mind that someone could reserve at the last minute! Of course, you can always make
                      lemonade from lemons and take a few servings to a friend or a neighbor who’s not on Plenty Lane
                      yet. Give ‘em the details along with the meal, that way they’ll know exactly where they can find
                      your home-cooked creations in the future. Lastly, maybe it’s a learning opportunity.
                      While you might think your squid linguini is a fabulous meal, perhaps others are less drawn to
                      that particular dish. Try posting a different meal next time and see if you get different results.
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-7
                      aria-expanded="true"
                    >
                      Can I gift a Plenty Lane subscription to someone else?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-7"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-7')"
                  >
                    <div class="faq-text">
                      Absolutely! When you are creating an account (for the intended gift recipient), on the
                      Choose a Plan page click the box near the bottom that asks if it is a gift for someone else.
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-8
                      aria-expanded="true"
                    >
                      How do I report a problem with a Cook or Diner?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-8"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-8')"
                  >
                    <div class="faq-text">
                      Please send us an email asap to
                      <a class="href-mailto" href="mailto:info@plentylane.com">info@plentylane.com</a>,
                      marking it URGENT in the subject line.
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-9
                      aria-expanded="true"
                    >
                      What if I have a dietary restriction or food allergies?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-9"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-9')"
                  >
                    <div class="faq-text">
                      All are welcome here! We want everyone to be able to feel included at
                      Plenty Lane, so we ask that cooks identify any of the top allergens
                      when posting a meal. However, when it comes to serious allergies or
                      restrictions, we recommend contacting the cook directly through Plenty Lane
                      messaging to voice any concerns or ask questions about the ingredients.
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-10
                      aria-expanded="true"
                    >
                      What about Food Safety? What protocols should I follow and how safe is it to eat what others prepare?
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-10"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-10')"
                  >
                    <div class="faq-text">
                      Please review our <router-link to="/food-safety">Food Safety FAQs</router-link> page thoroughly.
                      While members agree to follow local Department of Health and Center for Disease Control guidelines
                      regarding food safety, ultimately only you can decide if you think the food is safe to eat.
                    </div>
                  </b-collapse>
                </div>

                <div class="faq-box">
                  <div class="faq-title" role="tab">
                    <a
                      class="title-size3 titleGreenNavyColor collapsible-link"
                      v-b-toggle.accordion-11
                      aria-expanded="true"
                    >
                      I still have a question that isn’t answered here.
                    </a>
                  </div>
                  <b-collapse
                    id="accordion-11"
                    accordion="my-accordion"
                    role="tabpanel"
                    @shown="onShown('accordion-11')"
                  >
                    <div class="faq-text">
                      No problem! Send us an email to
                      <a class="href-mailto" href="mailto:info@plentylane.com">info@plentylane.com</a>
                      and we’ll be happy to answer your other questions.
                    </div>
                  </b-collapse>
                </div>
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
  name: "FAQs",
  components: {Footer, Header, BackToTop, HeroWave, PromoLogo},
  methods: {
    onShown (collapseId) {
      const $collapse = $(`#${collapseId}`);
      const $card = $collapse.closest('.faq-box');
      if (!$card) return;
      const offsetTop = $card.offset().top;
      if (window.innerWidth <= 992) {
        $('html,body').animate({
          scrollTop: offsetTop - 66
        }, 500);
      } else if (window.innerWidth > 992) {
        $('html,body').animate({
          scrollTop: offsetTop - 88
        }, 500);
      }
    }
  },
  mounted () {
    window.scrollTo(0, 0); // temp
    this.$eventHub.$emit('mobile-side-nav-closed');
  }
}
</script>

<style scoped lang="scss">
</style>
