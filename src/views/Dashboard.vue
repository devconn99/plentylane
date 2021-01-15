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
                            <div class="header-link-search-btn">
                                <SvgIcon icon="search" :params="{ class: 'loop-icon' }"></SvgIcon>
                                <SvgIcon icon="close" :params="{ class: 'close-icon' }"></SvgIcon>
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
                                <button type="button" id="mobile-menu-box-toggle" @click="toggleMobileMenu">
                                    <span class="hamburger"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <div class="header_search_container_mobile">
            <b-form class="form" @submit.stop.prevent="handleSearch">
                <b-form-group>
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

        <main class="dashboard">
            <aside id="dashboard-aside" class="dashboard-aside">

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
                                <button class="btn btn-search" type="submit">
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
                                    <a v-b-modal.notifications-modal>
                                        <SvgIcon icon="bell"></SvgIcon>
                                        <span>Notifications</span>
                                    </a>
                                </li>
                                <li>
                                    <!-- TODO: refactor tag <a> later -->
                                    <a v-b-modal.invite-friends-modal>
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
                            <router-link :to="{ path: '/dashboard/notifications' }" class="dashboard-user-notify" v-if="notificationsCount">
                                {{notificationsCount}}
                            </router-link>
                        </div>
                    </div>
                </div>
            </aside>

            <section class="dashboard-section">
                <div class="dashboard-content">
                    <div class="container-fluid">
                        <router-view></router-view>
                    </div>
                </div>
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
        isMobileSearchOpened: false,
        searchStr: ''
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
        }
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
        logout () {
            this.$bvModal.msgBoxConfirm('Are you sure you want to logout?')
                .then(value => {
                    if (value) {
                        localStorage.removeItem('plAccessToken');
                        this.$store.commit('reset');
                        this.$router.push({path: '/login'});
                    }
                })
                .catch(err => {})
        },
        toggleMobileMenu () {
            $('body').toggleClass('mobile-menu-box-active');
            $('#mobile-menu-box-toggle span').toggleClass('hamburger-checked hamburger');
            $('#mobile-body-overly').toggle();

            const $dashboardAside = $('.dashboard-aside');
            const $navLanding = $('.nav-landing');

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
        },
        toggleMobileSearch () {
            const $headerSearchContainerMobile = $('.header_search_container_mobile');
            if ($headerSearchContainerMobile && $headerSearchContainerMobile.length) {
                console.log('here?');
                this.isMobileSearchOpened = !this.isMobileSearchOpened;
                $headerSearchContainerMobile.toggleClass('active');
                $('body').toggleClass('mobile-menu-box-active');
                $('#mobile-body-overly').toggle();
            }
        },
        handleSearch () {
            // TODO: handle search (use this.searchStr as a value), redirect to search page
        }
    },
    mounted () {
        // TODO: get back to it later
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
    }
}
</script>

<style scoped lang="scss">

</style>
