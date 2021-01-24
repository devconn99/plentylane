<template>
    <div id="home-page">
        <Header activeItem="faqs"></Header>

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
                                        <a class="title-size3 titleGreenNavyColor collapsible-link"
                                           v-b-toggle.accordion-1 aria-expanded="true"
                                           aria-controls="faq1">Who should join?</a>
                                    </div>
                                    <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel" @shown="onShown('accordion-1')">
                                        <div class="faq-text">
                                            <!-- strong or span tags for font bold-->
                                            <p><strong>Single people:</strong> It is HARD to cook a tasty meal for one.
                                                So don’t. Cook a
                                                meal for six, eat one and share the other five
                                                servings. Now you’ve got credit to take meals from neighbors on five
                                                other nights.</p>

                                            <p><strong>Couples:</strong> You are working hard, so give yourself a break.
                                                Instead of
                                                cooking for two, cook for four or six and give those
                                                extras away. Then on a night when you would otherwise order take out,
                                                grab meals neighbors have prepared instead.
                                                Variety and ease - double bonus.</p>

                                            <p><span>Families:</span> The practicalities of day to day living can wear
                                                you out.
                                                Jobs, laundry, homework, after school activities...
                                                And cooking a reasonably healthy dinner every single night on top of it?
                                                Exhausting! When you make dinner, prepare an
                                                extra serving or two and give them to neighbors. Put credits in reserve
                                                and on evenings when there is no time to cook -
                                                or you just can’t bear to - your community has you covered.</p>
                                        </div>
                                    </b-collapse>
                                </div>

                                <div class="faq-box">
                                    <div class="faq-title" role="tab">
                                        <a class="title-size3 titleGreenNavyColor collapsible-link"
                                           v-b-toggle.accordion-2 aria-expanded="true">What does it cost?</a>
                                    </div>
                                    <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel" @shown="onShown('accordion-2')">
                                        <div class="faq-text">
                                            Single people: It is HARD to cook a tasty meal for one. So don’t. Cook a
                                            meal for six, eat one and share the other five
                                            servings. Now you’ve got credit to take meals from neighbors on five
                                            other nights.

                                            Couples: You are working hard, so give yourself a break. Instead of
                                            cooking for two, cook for four or six and give those
                                            extras away. Then on a night when you would otherwise order take out,
                                            grab meals neighbors have prepared instead.
                                            Variety and ease - double bonus.

                                            Families: The practicalities of day to day living can wear you out.
                                            Jobs, laundry, homework, after school activities...
                                            And cooking a reasonably healthy dinner every single night on top of it?
                                            Exhausting! When you make dinner, prepare an
                                            extra serving or two and give them to neighbors. Put credits in reserve
                                            and on evenings when there is no time to cook -
                                            or you just can’t bear to - your community has you covered.
                                        </div>
                                    </b-collapse>
                                </div>

                                <div class="faq-box">
                                    <div class="faq-title" role="tab">
                                        <a class="title-size3 titleGreenNavyColor collapsible-link"
                                           v-b-toggle.accordion-3 aria-expanded="true">Can I join the beta test?</a>
                                    </div>
                                    <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel" @shown="onShown('accordion-3')">
                                        <div class="faq-text">
                                            Single people: It is HARD to cook a tasty meal for one. So don’t. Cook a
                                            meal for six, eat one and share the other five
                                            servings. Now you’ve got credit to take meals from neighbors on five
                                            other nights.

                                            Couples: You are working hard, so give yourself a break. Instead of
                                            cooking for two, cook for four or six and give those
                                            extras away. Then on a night when you would otherwise order take out,
                                            grab meals neighbors have prepared instead.
                                            Variety and ease - double bonus.

                                            Families: The practicalities of day to day living can wear you out.
                                            Jobs, laundry, homework, after school activities...
                                            And cooking a reasonably healthy dinner every single night on top of it?
                                            Exhausting! When you make dinner, prepare an
                                            extra serving or two and give them to neighbors. Put credits in reserve
                                            and on evenings when there is no time to cook -
                                            or you just can’t bear to - your community has you covered.
                                        </div>
                                    </b-collapse>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="promo lightGreen-bg pad-40">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-center">
                            <img src="../assets/images/landing/share-more-clean-less.svg" alt="" class="img-fluid">
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
    name: "FAQs",
    components: {Footer, Header, BackToTop, HeroWave},
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
