<template>
  <div id="dashboard-page">
    <header class="header">
      <div class="container">
        <div class="header-box">
          <div class="logo-block">
            <a href="/">
              <img
                src="../assets/images/logo/logo_red.svg"
                alt="Logo"
                class="img-fluid"
              />
            </a>
          </div>

          <div class="header-links">
            <div class="header-link-search">
              <div class="header-link-search-btn" @click="toggleMobileSearch">
                <SvgIcon
                  icon="search"
                  :params="{ class: 'loop-icon' }"
                  v-if="!isMobileSearchVisible"
                ></SvgIcon>
                <SvgIcon
                  icon="close"
                  :params="{ class: 'close-icon' }"
                  v-else
                ></SvgIcon>
              </div>
            </div>
            <!-- notifications are not included in MVP -->
            <!--
              <div class="header-link-notify">
                <a v-b-modal.notifications-modal>
                  <SvgIcon icon="bell"></SvgIcon>
                </a>
              </div>
            -->
            <div class="header-link-nav">
              <div class="mobile-button">
                <button
                  type="button"
                  id="mobile-menu-box-toggle"
                  @click="toggleMobileSideNav"
                >
                  <span
                    v-bind:class="{
                      hamburger: !isMobileSidebarVisible,
                      'hamburger-checked': isMobileSidebarVisible,
                    }"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div
      class="header_search_container_mobile"
      v-bind:class="{ active: isMobileSearchVisible }"
    >
      <b-form class="form" @submit.stop.prevent="handleSearch">
        <b-form-group v-on-clickaway="onMobileSearchClickedAway">
          <div class="cursor-pointer" @click="handleSearch">
            <SvgIcon icon="searchSmall"></SvgIcon>
          </div>
          <!-- type="search" is fine here -->
          <b-form-input
            type="search"
            name="search"
            placeholder="E.g. Fish Tacos"
            required
            class="form-control mobile-input-search"
            autocomplete="off"
            v-model="searchStr"
            ref="searchRefMobile"
          ></b-form-input>
        </b-form-group>
      </b-form>
    </div>

    <main
      class="dashboard"
      v-bind:class="{ 'dashboard-home': isDashboardPage }"
    >
      <aside
        id="dashboard-aside"
        class="dashboard-aside"
        v-bind:class="{ 'show-aside': isMobileSidebarVisible }"
        v-on-clickaway="onMobileSideNavClickedAway"
      >
        <div class="dashboard-logo">
          <router-link to="/">
            <img
              src="../assets/images/logo/logo_red.svg"
              alt=""
              class="img-fluid"
            />
          </router-link>
        </div>

        <div class="dashboard-info">
          <div class="dashboard-aside-box search-box">
            <b-form class="form" @submit.stop.prevent="handleSearch">
              <b-form-group>
                <!-- type="search" is fine here -->
                <b-form-input
                  type="search"
                  name="search"
                  placeholder="Search"
                  class="form-control"
                  autocomplete="off"
                  required
                  v-model="searchStr"
                  ref="searchRef"
                ></b-form-input>
                <button class="btn-search" type="submit">
                  <SvgIcon
                    icon="searchSmall"
                    :params="{ stroke: '#009C90' }"
                  ></SvgIcon>
                </button>
              </b-form-group>
            </b-form>
          </div>

          <div class="dashboard-aside-box">
            <nav id="nav-dashboard">
              <ul class="nav-menu-dashboard">
                <li
                  v-for="navItem in navMenuItems"
                  v-bind:class="{ active: navItem.isActive }"
                  v-bind:key="navItem.iconName"
                >
                  <div
                    class="nav-link"
                    @click.stop.prevent="redirectToPath(navItem.path)"
                  >
                    <SvgIcon :icon="navItem.iconName"></SvgIcon>
                    <span>{{ navItem.text }}</span>
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          <div class="dashboard-aside-box position-fixed" style="bottom:0">
            <div class="dashboard-user" v-if="user && user.id">
              <div class="dashboard-user-info" @click="goToProfile()">
                <b-avatar
                  badge-top
                  badge-variant="warning"
                  v-if="user.image && user.image.thumbnail && user.image.thumbnail.length"
                  :src="user.image.thumbnail"
                  ref="asideUserPhoto"
                >
                  <template #badge>
                    <b v-b-tooltip.hover :title="displayCredits + ' tokens'">
                      {{displayCredits}}
                    </b>
                  </template>
                </b-avatar>
                <b-avatar badge-top badge-variant="warning" v-else>
                  <template  #badge>
                    <b v-b-tooltip.hover :title="displayCredits + ' tokens'"> {{displayCredits}}</b>
                  </template>
                </b-avatar>
                <span
                  class="dashboard-user-name"
                  v-if="displayUserName && displayUserName.length"
                >
                  {{ displayUserName }}
                </span>
                <span class="dashboard-user-name" v-else>Profile</span>
              </div>
              <!-- notifications are not included in MVP -->
              <!--
              <a
                @click.stop.prevent="showNotificationsModal"
                class="dashboard-user-notify"
                v-if="notificationsCount"
              >
                {{notificationsCount}}
              </a>
              -->
            </div>
          </div>
        </div>
      </aside>

      <section
        class="dashboard-section"
        v-bind:class="{ 'dashboard-profile': isProfilePage }"
      >
        <b-alert
          @dismiss-count-down="countDownChanged"
          @dismissed="alert.show=0"
          :show="alert.show"
          :variant="alert.variant"
          dismissible
          fade
          class="d-alert"
        >
          <!-- @dismissed="goToLogin" -->
          <p>{{ alert.msg }}</p>
        </b-alert>

        <router-view></router-view>
      </section>
    </main>
  </div>
</template>

<script>
import api from "../api";
import SvgIcon from "../components/SvgIcon";
import { mapGetters } from 'vuex';

export default {
  name: "AdminDashboard",
  components: { SvgIcon },

  data: () => ({
    invitationLink: "",
    alert: {
      show: 0,
      msg: "",
      variant: "success"
    },
    user: null,
    // notificationsCount: 3,
    searchStr: "",
    isMobileSidebarVisible: false,
    isMobileSearchVisible: false,
    isMobileBtnSearchActive: false,
    isMobileBtnMenuActive: false,
  }),

  created() {
    const user = { ...this.$store.getters.userInfo };
    if (!user || !user.email || !user.id) {
      this.loadUserInfo();
    } else {
      this.user = { ...user };
      this.confirmSubScription(user)
    }
    this.$eventHub.$on("clear-global-search-value", () => {
      this.searchStr = "";
      const _inputRef = this.$refs["searchRef"];
      if (_inputRef && _inputRef["blur"]) {
        _inputRef.blur();
      }
    });
    this.$eventHub.$on("user-image-updated", (data) => {
      const { image, tempData } = data;
      this.$nextTick(() => {
        this.user.image = { ...image };
        if (this.$refs.asideUserPhoto && tempData && tempData.length) {
          this.$refs.asideUserPhoto.setAttribute("src", tempData);
        }
      });
    });
    this.$eventHub.$on("user-image-removed", () => {
      this.$nextTick(() => {
        this.user.image = null;
      });
    });
    this.$eventHub.$on("user-name-updated", (data) => {
      if (!data || !data.username) return;
      this.user.username = data.username;
    });
  },

  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
    displayUserName: function () {
      if (!this.user || !this.user.username) {
        return "";
      }
      return this.user.username;
    },
    isDashboardPage: function () {
      return this.$route.path === "/dashboard";
    },
    isProfilePage: function () {
      return this.$route.path.includes("/profile");
    },
    displayCredits: function () {
      if (!this.userInfo || !this.userInfo.credits) {
        return 0;
      }
      return this.userInfo.credits;
    },
    navMenuItems() {
      const user = { ...this.$store.getters.userInfo };
      const navItems= [
        {
          path: "/dashboard",
          iconName: "home",
          text: "Home",
        },
        {
          path: "/dashboard/eat",
          iconName: "eat",
          text: "Eat",
        },
        {
          path: "/dashboard/cook",
          iconName: "cook",
          text: "Cook",
        },
        {
          text: 'My Network',
          path: '/dashboard/my-network',
          iconName:'network2'
        },
        {
          path: "/dashboard/shop",
          iconName: "shop",
          text: "Shop",
        },
      ];

      if(user.role === "admin") {
        navItems.push({
          path: "/admin",
          iconName: "user",
          text: "Admin",
        })
      }

      return navItems;
    }      
  },

  beforeRouteUpdate(to, from, next) {
    if (this.isMobileSidebarVisible) {
      this.hideMobileSideNav();
    }
    if (this.isMobileSearchVisible) {
      this.hideMobileSearch();
    }
    next();
  },

  methods: {
    countDownChanged(dismissCountDown){
      this.alert.show = dismissCountDown
    },

    loadUserInfo() {
      api.dashboard.profile
        .userInfo()
        .then((data) => {
          this.user = { ...data };
          this.$store.commit("userInfo", { ...data });
          this.confirmSubScription(data)  
        })
        .catch((err) => {});
    },

    async getSubscription(){
      const { id } = this.userInfo?.subscription
      
      try {
        const subscription=await api.payment.getSubscription(id)
        this.$store.commit('updateSubscription', subscription);
      } catch (error) {
        console.log(error)
      }
    },

    async getCheckoutSession() {
      const { stripeCheckoutId } = this.userInfo;
      if(stripeCheckoutId) {
        try {
          const chckout = await api.payment.getCheckoutSession(stripeCheckoutId)
          if(chckout?.subscription) {
            const subscription = await api.payment.getSubscriptionById(chckout.subscription)
            this.$store.commit('updateSubscription',subscription);
          }
        } catch (error) {
          this.$store.commit('updateSubscription',null);
          console.log(error);
        }
      } else {
        this.$store.commit('updateSubscription',null);
      }
    },

    toggleMobileSideNav() {
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

    toggleMobileSearch() {
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

    showMobileSearch() {
      this.isMobileSearchVisible = true;
      this.$eventHub.$emit("mobile-search-opened");
      this.$nextTick(() => {
        if (this.$refs["searchRefMobile"]) {
          this.$refs["searchRefMobile"].focus();
        }
      });
    },

    hideMobileSearch() {
      this.isMobileSearchVisible = false;
      this.$eventHub.$emit("mobile-search-closed");
    },

    showMobileSideNav() {
      this.isMobileSidebarVisible = true;
      this.$eventHub.$emit("mobile-side-nav-opened");
    },

    hideMobileSideNav() {
      this.isMobileSidebarVisible = false;
      this.$eventHub.$emit("mobile-side-nav-closed");
    },

    handleSearch() {
      // TODO: handle search (use this.searchStr as a value), redirect to search page
      const str =
        this.searchStr && this.searchStr.length ? this.searchStr.trim() : "";
      this.$router
        .push({ path: "/dashboard/search", query: { name: str } })
        .catch(() => {});
    },

    onMobileSearchClickedAway() {
      if (!this.isMobileBtnSearchActive && this.isMobileSearchVisible) {
        this.isMobileSearchVisible = false;
        // don't hide body overlay if mobile side nav is visible
        if (!this.isMobileSidebarVisible) {
          this.$eventHub.$emit("mobile-search-closed");
        }
      }
    },

    onMobileSideNavClickedAway() {
      if (!this.isMobileBtnMenuActive && this.isMobileSidebarVisible) {
        this.isMobileSidebarVisible = false;
        // don't hide body overlay if mobile search is visible
        if (!this.isMobileSearchVisible) {
          this.$eventHub.$emit("mobile-side-nav-closed");
        }
      }
    },

    async showInviteFriendsModal() {
      if (this.isMobileSidebarVisible) {
        this.hideMobileSideNav();
      }
      const user = { ...this.$store.getters.userInfo };
      try {
        if(user.email){
          const invitationLink = await api.invitations.generateInvitation({ email: user.email, type: "friend" });
          this.invitationLink = invitationLink;
          this.$bvModal.show("invite-friends-via-copy-link-modal");
        }        
      } catch (error) {
        this.alert = {
          msg: error.message,
          variant: "danger",
          show: 5
        }
      }
    },
    goToProfile() {
      const pathToProfile = "/admin/profile";
      if (this.$route.path === pathToProfile) {
        // no need to redirect, just close mobile side nav
        if (this.isMobileSidebarVisible) {
          this.hideMobileSideNav();
        }
        return;
      }
      this.$router.push({ path: pathToProfile }).catch(() => {});
    },

    redirectToPath(path) {
      if (this.$route.path === path) {
        if (this.isMobileSidebarVisible) {
          this.hideMobileSideNav();
        }
        return;
      }
      if (!path || !path.length) return;
      this.$router.push({ path: path }).catch(() => {});
    },

    confirmSubScription(user) {
      if (user.stripeCheckoutId == null) {
        this.$router.push("/choose-plan");
      } else {
        //this.getSubscription()
        this.getCheckoutSession()
      }
    },
  },

  watch: {
    "$route.path": {
      handler: function (path) {
        if (!this.navMenuItems || !this.navMenuItems.length) return;
        this.navMenuItems.forEach((item) => {
          item.isActive = item.path === path;
        });
      },
      immediate: true,
    },
  },

  beforeDestroy() {
    this.$eventHub.$off("clear-global-search-value");
    this.$eventHub.$off("user-image-updated");
    this.$eventHub.$off("user-image-removed");
    this.$eventHub.$off("user-name-updated");
  },
}
</script>

<style scoped lang="scss">
.d-alert{
  position: absolute;
  width: calc(100% - 245px);
  z-index: 4;
}
</style>
