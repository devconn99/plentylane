<template>
    <div id="dashboard-page">
        <header class="header">
            <div class="container">
                <div class="header-box">
                    <div class="logo-block">
                        <a href="/">
                            <img src="../assets/images/logo/logo_red.svg" alt="Logo" class="img-fluid">
                        </a>
                    </div>

                    <div class="header-links">
                        <div class="header-link-search">
                            <div class="header-link-search-btn" @click="toggleMobileSearch">
                                <SvgIcon icon="search" :params="{ class: 'loop-icon' }" v-if="!isMobileSearchVisible"></SvgIcon>
                                <SvgIcon icon="close" :params="{ class: 'close-icon' }" v-else></SvgIcon>
                            </div>
                        </div>
                        <div class="header-link-notify">
                            <!--  TODO: refactor tag a later -->
                            <a v-b-modal.notifications-modal>
                                <SvgIcon icon="bell"></SvgIcon>
                            </a>
                        </div>
                        <div class="header-link-nav">
                            <div class="mobile-button">
                                <button type="button" id="mobile-menu-box-toggle" @click="toggleMobileSideNav">
                                    <span v-bind:class="{ 'hamburger': !isMobileSidebarVisible, 'hamburger-checked': isMobileSidebarVisible }"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div class="header_search_container_mobile" v-bind:class="{ 'active': isMobileSearchVisible }">
            <b-form class="form" @submit.stop.prevent="handleSearch">
                <b-form-group v-on-clickaway="onMobileSearchClickedAway">
                    <div class="cursor-pointer" @click="handleSearch">
                        <SvgIcon icon="searchSmall"></SvgIcon>
                    </div>
                    <!-- type="search" is fine here -->
                    <b-form-input
                            id="gsearch"
                            type="search"
                            name="search"
                            placeholder="E.g. Fish Tacos"
                            required
                            class="form-control"
                            autocomplete="off"
                            v-model="searchStr"
                    ></b-form-input>
                </b-form-group>
            </b-form>
        </div>

        <main class="dashboard" v-bind:class="{ 'dashboard-home': isDashboardPage }">
            <aside
                    id="dashboard-aside"
                    class="dashboard-aside"
                    v-bind:class="{ 'show-aside': isMobileSidebarVisible }"
                    v-on-clickaway="onMobileSideNavClickedAway"
            >

                <div class="dashboard-logo">
                    <router-link to="/">
                        <img src="../assets/images/logo/logo_red.svg" alt="" class="img-fluid">
                    </router-link>
                </div>

                <div class="dashboard-info">
                    <div class="dashboard-aside-box search-box">
                        <b-form class="form" @submit.stop.prevent="handleSearch">
                            <b-form-group>
                                <!-- type="search" is fine here -->
                                <b-form-input
                                        id="gsearch"
                                        type="search"
                                        name="search"
                                        placeholder="Search"
                                        class="form-control"
                                        autocomplete="off"
                                        required
                                        v-model="searchStr"
                                ></b-form-input>
                                <button class="btn-search" type="submit">
                                    <SvgIcon icon="searchSmall" :params="{ stroke: '#009C90' }"></SvgIcon>
                                </button>
                            </b-form-group>
                        </b-form>
                    </div>

                    <div class="dashboard-aside-box">
                        <nav id="nav-dashboard">
                            <ul class="nav-menu-dashboard">
                                <li v-for="navItem in navMenuItems">
                                    <router-link :to="{ path: navItem.path }" class="nav-link">
                                        <SvgIcon :icon="navItem.iconName"></SvgIcon>
                                        <span>{{navItem.text}}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div class="dashboard-aside-box">
                        <nav id="nav-dashboard-small">
                            <ul class="nav-menu-dashboard-small">
                                <li class="linotifications">
                                    <!-- TODO: refactor tag <a> later -->
                                    <a @click.stop.prevent="showNotificationsModal">
                                        <SvgIcon icon="bell"></SvgIcon>
                                        <span>Notifications</span>
                                    </a>
                                </li>
                                <li>
                                    <!-- TODO: refactor tag <a> later -->
                                    <a @click.stop.prevent="showInviteFriendsModal">
                                        <SvgIcon icon="invite"></SvgIcon>
                                        <span>Invite Friends</span>
                                    </a>
                                </li>
                                <li>
                                    <router-link :to="{ path: '/dashboard/help' }">
                                        <SvgIcon icon="help"></SvgIcon>
                                        <span>Help</span>
                                    </router-link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div class="dashboard-aside-box">
                        <div class="dashboard-user">
                            <router-link :to="{ path: '/dashboard/profile' }" class="dashboard-user-info">
                                <img src="../assets/images/data/images/avatars/avatar.jpg" alt="" class="img-fluid">
                                <span class="dashboard-user-name" v-if="displayUserName && displayUserName.length">{{displayUserName}}</span>
                                <span class="dashboard-user-name" v-else>Profile</span>
                            </router-link>
                            <!-- TODO: refactor tag <a> later -->
                            <a @click.stop.prevent="showNotificationsModal" class="dashboard-user-notify" v-if="notificationsCount">{{notificationsCount}}</a>
                        </div>
                    </div>
                </div>
            </aside>

            <section class="dashboard-section">
                <router-view></router-view>
            </section>
        </main>

        <!-- Modals -->
        <NotificationsModal></NotificationsModal>
        <InviteFriendsModal></InviteFriendsModal>
    </div>
</template>

<script>
import api from '../api';
import SvgIcon from '../components/SvgIcon';
import NotificationsModal from '../components/modals/NotificationsModal';
import InviteFriendsModal from '../components/modals/InviteFriendsModal';
export default {
    name: "Dashboard",
    components: {SvgIcon, NotificationsModal, InviteFriendsModal},
    data: () => ({
        user: null,
        notificationsCount: 3, // TODO: temp value
        navMenuItems: [
            {
                path: '/dashboard',
                iconName: 'home',
                text: 'Home'
            },
            {
                path: '/dashboard/eat',
                iconName: 'eat',
                text: 'Eat'
            },
            {
                path: '/dashboard/cook',
                iconName: 'cook',
                text: 'Cook'
            },
            {
                path: '/dashboard/shop',
                iconName: 'shop',
                text: 'Shop'
            },
        ],
        searchStr: '',
        isMobileSidebarVisible: false,
        isMobileSearchVisible: false,
        isMobileBtnSearchActive: false,
        isMobileBtnMenuActive: false
    }),
    created () {
        const user = { ...this.$store.getters.userInfo };
        if (!user || !user.email || !user.id) {
            this.loadUserInfo();
        } else {
            this.user = { ...user };
        }
    },
    computed: {
        displayUserName: function () {
            if (!this.user || !this.user.firstName) {
                return '';
            }
            const hasLastName = this.user.lastName && this.user.lastName.length;
            let nameStr = this.user.firstName;
            if (hasLastName) {
                nameStr += ` ${this.user.lastName.slice(0,1)}.`;
            }
            return nameStr;
        },
        isDashboardPage: function () {
            return this.$route.path === '/dashboard';
        }
    },
    beforeRouteUpdate (to, from, next) {
        if (this.isMobileSidebarVisible) {
            this.hideMobileSideNav();
        }
        if (this.isMobileSearchVisible) {
            this.hideMobileSearch();
        }
        next();
    },
    methods: {
        loadUserInfo () {
            api.dashboard.userInfo()
                .then((data) => {
                    this.user = { ...data };
                    this.$store.commit('userInfo', { ...data });
                    // TODO
                })
                .catch((err) => {});
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
        toggleMobileSearch () {
            if (!this.isMobileSearchVisible) {
                this.showMobileSearch();
            } else {
                this.hideMobileSearch();
            }
            if (this.isMobileSearchVisible) {
                this.isMobileBtnSearchActive = true;
            }
            // it's needed to exclude this click event from click outside search block handler - onMobileSearchClickedAway
            // where 300ms is the transition duration
            setTimeout(() => {
                if (this.isMobileBtnSearchActive) {
                    this.isMobileBtnSearchActive = false;
                }
            }, 300);
        },
        showMobileSearch () {
            this.isMobileSearchVisible = true;
            this.$eventHub.$emit('mobile-search-opened');
        },
        hideMobileSearch () {
            this.isMobileSearchVisible = false;
            this.$eventHub.$emit('mobile-search-closed');
        },
        showMobileSideNav () {
            this.isMobileSidebarVisible = true;
            this.$eventHub.$emit('mobile-side-nav-opened');
        },
        hideMobileSideNav () {
            this.isMobileSidebarVisible = false;
            this.$eventHub.$emit('mobile-side-nav-closed');
        },
        handleSearch () {
            // TODO: handle search (use this.searchStr as a value), redirect to search page
        },
        onMobileSearchClickedAway () {
            if (!this.isMobileBtnSearchActive && this.isMobileSearchVisible) {
                this.isMobileSearchVisible = false;
                // don't hide body overlay if mobile side nav is visible
                if (!this.isMobileSidebarVisible) {
                    this.$eventHub.$emit('mobile-search-closed');
                }
            }
        },
        onMobileSideNavClickedAway () {
            if (!this.isMobileBtnMenuActive && this.isMobileSidebarVisible) {
                this.isMobileSidebarVisible = false;
                // don't hide body overlay if mobile search is visible
                if (!this.isMobileSearchVisible) {
                    this.$eventHub.$emit('mobile-side-nav-closed');
                }
            }
        },
        showInviteFriendsModal () {
            if (this.isMobileSidebarVisible) {
                this.hideMobileSideNav();
            }
            this.$bvModal.show('invite-friends-modal');
        },
        showNotificationsModal () {
            if (this.isMobileSidebarVisible) {
                this.hideMobileSideNav();
            }
            this.$bvModal.show('notifications-modal');
        }
    }
}
</script>

<style scoped lang="scss">

</style>
