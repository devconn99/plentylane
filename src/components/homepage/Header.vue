<template>
    <header class="header">
        <div class="container">
            <div class="header-box">
                <div class="logo-block">
                    <router-link to="/">
                        <img src="../../assets/images/logo/logo_red.svg" alt="" class="img-fluid">
                    </router-link>
                </div>

                <div class="header-links">
                    <div class="header-link-nav">
                        <div class="mobile-button">
                            <button type="button" id="mobile-menu-box-toggle">
                                <span class="hamburger"></span>
                            </button>
                        </div>
                        <nav id="nav-landing" class="nav-landing">
                            <ul class="nav-menu-landing">
                                <li v-for="item in menuItems" v-bind:class="{ active: item.name === activeMenuName }">
                                    <router-link :to="item.to">{{item.text}}</router-link>
                                </li>
                                <li class="register-btn">
                                    <router-link to="/sign-up" tag="a" class="btnLightRed btnNormalSize hover-slide-left">
                                        <span>Sign Up</span>
                                    </router-link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        name: "Header",
        props: ['activeItem'],
        data: () => ({
            menuItems: [
                { to: '/how-it-works', text: 'How it works', name: 'works' },
                { to: '/pricing', text: 'Pricing', name: 'pricing' },
                { to: '/faqs', text: 'FAQs', name: 'faqs' },
                { to: '/login', text: 'Login', name: 'login' }
            ]
        }),
        computed: {
            activeMenuName: function () {
                return this.activeItem;
            }
        }
    }
</script>

<style scoped>

</style>
