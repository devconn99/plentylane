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

        if ($('#home-page #nav-landing').length || $('#dashboard-page #nav-dashboard').length || $('.header-link-search').length) {
            $('body').append('<div id="mobile-body-overly"></div>');

            $('.header-link-search-btn').on('click', function (e) {
                if ($('.header_search_container_mobile').length) {

                    if ($('#mobile-menu-box-toggle span').hasClass('hamburger-checked')) {
                        $('#mobile-body-overly').addClass('static');
                        $('#mobile-menu-box-toggle').trigger('click');
                    }

                    $('.header_search_container_mobile').toggleClass('active');
                    $('body').toggleClass('mobile-menu-box-active');
                    if ($('.header-link-search-btn .loop-icon').is(':visible')) {
                        $('.header-link-search-btn .loop-icon').hide();
                        $('.header-link-search-btn .close-icon').show();
                        if (!$('#mobile-body-overly').is(':visible')) {
                            $('#mobile-body-overly').fadeIn();
                        }
                    } else {
                        $('.header-link-search-btn .loop-icon').show();
                        $('.header-link-search-btn .close-icon').hide();
                        if (!$('#mobile-body-overly').hasClass('static')) {
                            $('#mobile-body-overly').fadeOut();
                        }
                    }
                    $('#mobile-body-overly').removeClass('static');
                }
            });

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
        }

        // TODO ??
        // Smooth scroll for the navigation menu and links with .scrollto classes
        /*
        var scrolltoOffset = $('.header').outerHeight();
        $(document).on('click', '.scrollto, #nav-landing a', function (e) {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                if (target.length) {
                    e.preventDefault();
                    var scrollto = target.offset().top - scrolltoOffset;

                    if ($(this).attr("href") == '.header') {
                        scrollto = 0;
                    }
                    $('html, body').animate({
                        scrollTop: scrollto
                    }, 1500, 'easeInOutExpo');

                    if ($(this).parents('.nav-menu-landing').length) {
                        $('.nav-menu-landing .active').removeClass('active');
                        $(this).closest('li').addClass('active');
                    }

                    if ($('body').hasClass('mobile-menu-box-active')) {
                        $('body').removeClass('mobile-menu-box-active');
                        $('.dashboard-aside').removeClass('show-aside');
                        $('.nav-landing').removeClass('show-nav');
                        $('#mobile-menu-box-toggle span').toggleClass('hamburger-checked hamburger');
                        $('#mobile-body-overly').fadeOut();
                    }
                    return false;
                }
            }
        });
        */

        // TODO: ??
        // Activate smooth scroll on page load with hash links in the url
        // if (window.location.hash) {
        //     var initial_nav = window.location.hash;
        //     if ($(initial_nav).length) {
        //         var scrollto = $(initial_nav).offset().top - scrolltoOffset;
        //         $('html, body').animate({
        //             scrollTop: scrollto
        //         }, 1500, 'easeInOutExpo');
        //     }
        // }

        $(window).on('scroll', function () {
            var scroll = $(window).scrollTop();
            if (scroll < 400) {
                $('#back-top').fadeOut(500);
            } else {
                $('#back-top').fadeIn(500);
            }
        });

        $(window).on('load', function () {
            $('#preloader-active').delay(600).fadeOut('slow');
            $('body').delay(600).css({
            });
        });
    }
}
</script>
