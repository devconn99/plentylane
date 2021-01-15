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
        toggleMobileNavMenu () {
            const $body = $('body');
            const $mobileBodyOverly = $('#mobile-body-overly');
            const $navLanding = $('.nav-landing');
            const $dashboardAside = $('.dashboard-aside');
            if ($('.header_search_container_mobile').hasClass('active')) {
                $mobileBodyOverly.addClass('static');
                $('.header-link-search-btn').trigger('click');
            }
            if (!$body.hasClass('mobile-menu-box-active')) {
                $body.addClass('mobile-menu-box-active');
                if (!$mobileBodyOverly.is(':visible')) {
                    $mobileBodyOverly.fadeIn();
                }
            } else {
                $body.removeClass('mobile-menu-box-active');
                if (!$mobileBodyOverly.hasClass('static')) {
                    $mobileBodyOverly.fadeOut();
                }
            }
            $('#mobile-menu-box-toggle span').toggleClass('hamburger-checked hamburger');
            if ($dashboardAside.hasClass('show-aside')) {
                $dashboardAside.removeClass('show-aside');
            } else {
                $dashboardAside.addClass('show-aside');
            }
            if ($navLanding.hasClass('show-nav')) {
                $navLanding.removeClass('show-nav');
            } else {
                $navLanding.addClass('show-nav');
            }
            $mobileBodyOverly.removeClass('static');
        }
    },
    mounted () {
        $('body').append('<div id="mobile-body-overly"></div>');

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


        // TODO: get back to it later (mobile nav + search toggling, click outside to hide them)
        /*
        $(document).on('click', '#mobile-menu-box-toggle', function (e) {
            if ($('.header_search_container_mobile').hasClass('active')) {
                $('#mobile-body-overly').addClass('static');
                $('.header-link-search-btn').trigger('click');
            }

            if (!$('body').hasClass('mobile-menu-box-active')) {
                $('body').addClass('mobile-menu-box-active');
                if (!$('#mobile-body-overly').is(':visible')) {
                    $('#mobile-body-overly').fadeIn();
                }
            } else {
                $('body').removeClass('mobile-menu-box-active');
                if (!$('#mobile-body-overly').hasClass('static')) {
                    $('#mobile-body-overly').fadeOut();
                }
            }
            $('#mobile-menu-box-toggle span').toggleClass('hamburger-checked hamburger');

            if ($('.dashboard-aside').hasClass('show-aside')) {
                $('.dashboard-aside').removeClass('show-aside');
            } else {
                $('.dashboard-aside').addClass('show-aside');
            }

            if ($('.nav-landing').hasClass('show-nav')) {
                $('.nav-landing').removeClass('show-nav');
            } else {
                $('.nav-landing').addClass('show-nav');
            }
            $('#mobile-body-overly').removeClass('static');
        });

        $(document).click(function (e) {
            var container = $("#mobile-menu-box-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('#mobile-menu-box-toggle span').hasClass('hamburger-checked')) {
                    $('#mobile-menu-box-toggle').trigger('click');
                }
            }
            var searchContainer = $('#gsearch,.header-link-search-btn');
            if (!searchContainer.is(e.target) && searchContainer.has(e.target).length === 0) {
                if ($('.header_search_container_mobile').hasClass('active')) {
                    $('.header-link-search-btn').trigger('click');
                }
            }
        });
        */
    }
}
</script>
