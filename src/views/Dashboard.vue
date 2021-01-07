<template>
    <div class="dashboard-page d-flex">
        <!-- TODO: temp navigation -->
        <div class="navigation-sidebar">
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a class="navbar-brand nav-link" href="/">
                        <img src="../assets/images/logo/logo_green.svg" width="102" height="48" alt="Plenty Lane logo">
                    </a>
                </li>
                <li class="nav-item">
                    <router-link to="/" class="nav-link">Home</router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ path: '/dashboard/eat' }" class="nav-link">Eat</router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ path: '/dashboard/cook' }" class="nav-link">Cook</router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{ path: '/dashboard/shop' }" class="nav-link">Shop</router-link>
                </li>
                <li class="nav-item profile-nav-item">
                    <router-link :to="{ path: '/dashboard/profile' }" class="nav-link">
                        <span v-if="user && user.fullName">{{user.fullName}}</span>
                        <span v-else>Profile</span>
                    </router-link>
                </li>
                <!-- temp logout -->
                <li class="nav-item logout-nav-item">
                    <b-btn class="logout-btn" @click="logout()">Logout</b-btn>
                </li>
            </ul>
        </div>
        <div class="main-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import api from '../api';
export default {
    name: "Dashboard",
    data: () => ({
        user: null
    }),
    created () {
        const user = { ...this.$store.getters.userInfo };
        if (!user || !user.id) {
            this.loadUserInfo();
        } else {
            this.user = { ...user };
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
        }
    }
}
</script>

<style scoped lang="scss">
@import '../variables';
.dashboard-page {
    .navigation-sidebar {
        // temp
        height: 100vh;
        width: 200px;
        border-right: 1px solid $greenColor;
        padding: 20px 0;

    }
    .main-content {
        // temp
        padding: 20px;
    }
}
.profile-nav-item {
    border-top: 1px solid $greenColor;
}
.logout-nav-item {
    .logout-btn {
        margin-left: 15px;
    }
}
</style>
