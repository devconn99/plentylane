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
                            <button type="button" id="mobile-menu-box-toggle" @click="toggleMobileSideNav">
                                <span v-bind:class="{ 'hamburger': !isMobileSidebarVisible, 'hamburger-checked': isMobileSidebarVisible }"></span>
                            </button>
                        </div>
                        <nav
                                id="nav-landing"
                                class="nav-landing"
                                v-bind:class="{ 'show-nav': isMobileSidebarVisible }"
                                v-on-clickaway="onMobileSideNavClickedAway"
                        >
                            <ul class="nav-menu-landing">
                                <li v-for="item in menuItems" v-bind:class="{ active: item.name === activeMenuName }">
                                    <a href="" @click.stop.prevent="changeRoute(item.to)">{{item.text}}</a>
                                </li>
                                <li class="register-btn">
                                    <a class="btnLightRed btnNormalSize hover-slide-left" @click="changeRoute('/sign-up')">
                                        <span>Sign Up</span>
                                    </a>
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
            { to: '/pricing', text: 'Pricing', name: 'pricing' },
            { to: '/faqs', text: 'FAQs', name: 'faqs' },
            { to: '/login', text: 'Login', name: 'login' }
        ],
        isMobileSidebarVisible: false,
        isMobileBtnMenuActive: false
    }),
    computed: {
        activeMenuName: function () {
            return this.activeItem;
        }
    },
    methods: {
        showMobileSideNav () {
            this.isMobileSidebarVisible = true;
            this.$eventHub.$emit('mobile-side-nav-opened');
        },
        hideMobileSideNav () {
            this.isMobileSidebarVisible = false;
            this.$eventHub.$emit('mobile-side-nav-closed');
        },
        toggleMobileSideNav () {
            if (!this.isMobileSidebarVisible) {
                this.showMobileSideNav();
            } else {
                this.hideMobileSideNav();
            }
            if (this.isMobileSidebarVisible) {
                this.isMobileBtnMenuActive = true;
            }
            // it's needed to exclude this click event from click outside mobile side nav block handler - onMobileSideNavClickedAway
            // where 300ms is the transition duration
            setTimeout(() => {
                if (this.isMobileBtnMenuActive) {
                    this.isMobileBtnMenuActive = false;
                }
            }, 300);
        },
        onMobileSideNavClickedAway () {
            if (!this.isMobileBtnMenuActive && this.isMobileSidebarVisible) {
                this.hideMobileSideNav();
            }
        },
        changeRoute (to) {
            if (this.$route.path === to) {
                // no need to redirect, just need to close the side nav on mobile
                if (this.isMobileSidebarVisible) {
                    this.hideMobileSideNav();
                }
                return;
            }
            if (!to || !to.length) return;
            this.$router.push({ path: to })
                .then(() => {
                    if (this.isMobileSidebarVisible) {
                        this.hideMobileSideNav();
                    }
                })
                .catch(()=>{});
        }
    }
}
</script>

<style scoped>

</style>
