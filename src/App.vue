<template>
  <div id="app">
    <router-view/>
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
        },
        prepareBrowserLocation () {
            let vm = this;
            const _options = {
                enableHighAccuracy: true,
                timeout: 4000,
                maximumAge: 0
            };
            let errCounter = 0;
            function _successHandler (pos) {
                if (!pos || !pos.coords) return;
                const data = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                vm.$store.commit('browserCoordinates', data);
                vm.$eventHub.$emit('browser-coordinates', data);
            }
            function _errorHandler (err) {
                if (errCounter === 0) {
                    navigator.geolocation.getCurrentPosition(_successHandler, _errorHandler, _options);
                }
                errCounter++;
            }
            navigator.geolocation.getCurrentPosition(_successHandler, _errorHandler, _options);
        },
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
        this.prepareBrowserLocation();
        this.$eventHub.$on('mobile-search-opened', () => {
            this.addClassToBodyOnMobile();
        });
        this.$eventHub.$on('mobile-search-closed', () => {
            this.removeClassFromBodyOnMobile();
        });
        this.$eventHub.$on('mobile-side-nav-opened', () => {
            this.addClassToBodyOnMobile();
        });
        this.$eventHub.$on('mobile-side-nav-closed', () => {
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
