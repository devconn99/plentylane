<template>
    <div class="profile-page-wrapper">
        <div class="dashboard-profile-aside" v-bind:class="{ 'mobile-aside-enabled': isMobileAsideEnabled }">
            <div class="title-size2 mb-5">Profile</div>
            <nav id="nav-dashboard-profile">
                <ul class="nav-menu-dashboard-profile">
                    <li v-for="item in navItems" v-bind:class="{ 'active': item.isActive }">
                        <div class="aside-nav-item-wrapper" @click.stop.prevent="redirectToPath(item.path)">
                            <span>{{item.title}}</span>
                            <SvgIcon icon="openArrowRight"></SvgIcon>
                        </div>
                    </li>
                    <li @click="openLogoutConfirmModal" class="cursor-pointer logout-item">
                        <span>Logout</span>
                        <SvgIcon icon="openArrowRight"></SvgIcon>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="dashboard-content" v-bind:class="{ 'mobile-aside-enabled': isMobileAsideEnabled }">
            <div class="container-fluid">
                <router-view></router-view>
            </div>
        </div>

        <!-- Modals -->
        <ConfirmModal :id="modalId" :message="logoutMessage" @confirmed="onConfirmedLogout"></ConfirmModal>
    </div>
</template>

<script>
import ConfirmModal from '../../components/modals/ConfirmModal';
import SvgIcon from '../../components/SvgIcon';
export default {
    name: "ProfileWrapper",
    components: {ConfirmModal, SvgIcon},
    data: () => ({
        navItems: [
            {
                title: 'Edit Profile',
                path: '/dashboard/profile'
            },
            {
                title: 'My Meals',
                path: '/dashboard/profile/my-meals'
            },
            {
                title: 'My Network',
                path: '/dashboard/profile/my-network'
            },
            {
                title: 'My Answers',
                path: '/dashboard/profile/my-answers'
            },
            {
                title: 'My Questions',
                path: '/dashboard/profile/my-questions'
            },
            {
                title: 'Certifications',
                path: '/dashboard/profile/certifications'
            },
            {
                title: 'Tokens',
                path: '/dashboard/profile/tokens'
            },
            {
                title: 'Orders',
                path: '/dashboard/profile/orders'
            },
            {
                title: 'Account',
                path: '/dashboard/profile/account'
            }
        ],
        logoutMessage: 'Are you sure you want to logout?',
        modalId: 'confirm-logout',
        isMobileAsideEnabled: false
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.isMobileAsideEnabled = false;
        });
    },
    beforeRouteUpdate (to, from, next) {
        this.isMobileAsideEnabled = false;
        next();
    },
    methods: {
        openLogoutConfirmModal () {
            this.$bvModal.show(this.modalId);
        },
        onConfirmedLogout () {
            localStorage.removeItem('plAccessToken');
            localStorage.removeItem('plUserId');
            this.$store.commit('reset');
            this.$router.push({path: '/login'});
        },
        onResizeHandler () {
            this.isMobileAsideEnabled = $(window).innerWidth() < 768;
        },
        redirectToPath (path) {
            if (this.$route.path === path) {
                this.isMobileAsideEnabled = false;
                return;
            }
            if (!path || !path.length) return;
            // TODO: cancel request from previous page is switching so fast ?m
            this.isMobileAsideEnabled = false;
            this.$router.push({ path: path }).catch(()=>{});
        }
    },
    watch: {
        '$route.path': {
            handler: function(path) {
                if (!this.navItems || !this.navItems.length) return;
                this.navItems.forEach(item => {
                    item.isActive = item.path === path;
                });
            },
            immediate: true
        }
    },
    created () {
        this.$eventHub.$on('show-mobile-profile-aside', () => {
            this.isMobileAsideEnabled = true;
        })
    },
    beforeDestroy () {
        this.$eventHub.$off('show-mobile-profile-aside');
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";

.dashboard-profile-aside {
    min-width: 240px;
    max-width: 240px;
    padding: 65px 0 0;
    box-shadow: 2px 0 rgba(24,24,22,0.07);
    display: flex;
    flex-direction: column;
    min-height: 100vh; // TODO: get back to it later - possibly need to avoid unnecessary scroll on mobile view
    /*height: 100%; */
    @media screen and (max-width: $desktopWidth) {
        min-width: 220px;
        max-width: 220px;
        padding-top: 40px;
    }
    @media screen and (max-width: $tableMinWidth) {
        min-width: 100%;
        box-shadow: none;
    }
    .title-size2 {
        padding: 0 9px 0 40px;
        @media screen and (max-width: $desktopWidth) {
            padding: 0 20px;
        }
        @media screen and (max-width: $tableWidth) {
            padding: 0 15px;
        }
        @media screen and (max-width: $smTableWidth) {
            text-align: center;
        }
    }
    ul.nav-menu-dashboard-profile {
        padding: 0;
        margin: 0;
        li {
            .aside-nav-item-wrapper, &.logout-item {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                flex-direction: row;
                justify-content: space-between;
                font-family: $LacaProSemiBold;
                font-size: 24px;
                line-height: 24px;
                padding: 20px 9px 20px 40px;
                color: $textBlackColor;
                @media screen and (max-width: $desktopWidth) {
                    padding: 20px 20px 20px;
                }
                @media screen and (min-width: $tableMinWidth + 1) {
                    .svg-icon-wrapper {
                        display: none;
                    }
                }
                @media screen and (max-width: $tableMinWidth) {
                    font-size: 20px;
                    padding: 15px;
                }
                &:hover {
                    color: $greenColor;
                }
                &:active {
                    color: $greenColor;
                }
                &:focus {
                    color: $greenColor;
                }
            }
            &.active {
                .aside-nav-item-wrapper {
                    color: $greenColor;
                }
            }
            &:first-child .aside-nav-item-wrapper {
                padding-top: 0;
            }
            .aside-nav-item-wrapper {
                @media screen and (max-width: $tableMinWidth) {
                    border-bottom: 2px solid #EEE8D7;
                }
            }
        }
    }
}
</style>
