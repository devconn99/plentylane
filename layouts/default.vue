<template>
  <div id="app">
    <client-only>
      <nuxt />
  </client-only>
  </div>
</template>

<style lang="scss">
@import "./scss/style";
</style>

<script>
export default {
  
  data: () => ({}),
  methods: {
    addClassToBodyOnMobile () {
      const $body = $('body');
      $body.addClass('mobile-menu-box-active');
    },
    removeClassFromBodyOnMobile () {
      const $body = $('body');
      if ($body.hasClass('mobile-menu-box-active')) {
          $body.removeClass('mobile-menu-box-active');
      }
    }
  },
  mounted () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 80) {
        $('.header').not('#authorization-page .header').addClass('header-scrolled');
      } else {
        $('.header').removeClass('header-scrolled');
      }
    });
    if ($(window).scrollTop() > 80) {
      $('.header').not('#authorization-page .header').addClass('header-scrolled');
    }

    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();
      if (scroll < 400) {
        $('#back-top').fadeOut(500);
      } else {
        $('#back-top').fadeIn(500);
      }
    });
  },
  created () {
    this.$eventHub && this.$eventHub.$on('mobile-search-opened', () => {
      this.addClassToBodyOnMobile();
    });
    this.$eventHub && this.$eventHub.$on('mobile-search-closed', () => {
      this.removeClassFromBodyOnMobile();
    });
    this.$eventHub && this.$eventHub.$on('mobile-side-nav-opened', () => {
      this.addClassToBodyOnMobile();
    });
    this.$eventHub && this.$eventHub.$on('mobile-side-nav-closed', () => {
      this.removeClassFromBodyOnMobile();
    });
  },
  beforeDestroy() {
    this.$eventHub.$off('mobile-search-opened');
    this.$eventHub.$off('mobile-search-closed');
    this.$eventHub.$off('mobile-side-nav-opened');
    this.$eventHub.$off('mobile-side-nav-closed');
  },
}
</script>
