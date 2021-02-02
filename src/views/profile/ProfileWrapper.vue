<template>
    <div class="profile-page-wrapper">
        <div class="dashboard-profile-aside">
            <div class="title-size2 mb-5">Profile</div>
            <nav id="nav-dashboard-profile">
                <ul class="nav-menu-dashboard-profile">
                    <li v-for="item in navItems" v-bind:class="{ 'active': item.isActive }">
                        <router-link :to="{ path: item.path }">{{item.title}}</router-link>
                    </li>
                    <li @click="openLogoutConfirmModal" class="cursor-pointer">
                        <span class="logout-item">Logout</span>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="dashboard-content">
            <div class="container-fluid">
                <router-view></router-view>
            </div>
        </div>

        <!-- Modals -->
        <ConfirmModal :message="logoutMessage" @confirmed="onConfirmedLogout"></ConfirmModal>
    </div>
</template>

<script>
import ConfirmModal from '../../components/modals/ConfirmModal';
export default {
    name: "ProfileWrapper",
    components: {ConfirmModal},
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
                title: 'Certifications',
                path: '/dashboard/profile/certifications'
            },
            {
                title: 'Credits',
                path: '/dashboard/profile/credits'
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
        logoutMessage: 'Are you sure you want to logout?'
    }),
    methods: {
        openLogoutConfirmModal () {
            this.$bvModal.show('confirm-modal');
        },
        onConfirmedLogout () {
            localStorage.removeItem('plAccessToken');
            localStorage.removeItem('plUserId');
            this.$store.commit('reset');
            this.$router.push({path: '/login'});
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
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";

.dashboard-profile-aside {
    min-width: 240px;
    max-width: 240px;
    padding: 65px 0 65px;
    box-shadow: 2px 0 rgba(24,24,22,0.07);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100%;
    @media screen and (max-width: $desktopWidth) {
        min-width: 220px;
        max-width: 220px;
        padding: 40px 0;
    }
    .title-size2 {
        padding: 0 9px 0 40px;
        @media screen and (max-width: $desktopWidth) {
            padding: 0 20px;
        }
        @media screen and (max-width: $tableMinWidth) {
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
            a, .logout-item {
                display: flex;
                align-items: flex-start;
                font-family: $LacaProSemiBold;
                font-size: 24px;
                line-height: 24px;
                padding: 20px 9px 20px 40px;
                color: $textBlackColor;
                @media screen and (max-width: $desktopWidth) {
                    padding: 20px 20px 20px;
                }
                @media screen and (max-width: $tableMinWidth) {
                    font-size: 20px;
                    padding: 15px;
                    border-bottom: 2px solid #EEE8D7;
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
            &.active a {
                color: $greenColor;
            }
            &:first-child a {
                padding-top: 0;
            }
            &:last-child a {
                padding-bottom: 0;
                @media screen and (max-width: $tableMinWidth) {
                    padding-bottom: 15px;
                }
            }
        }
    }
}
</style>
