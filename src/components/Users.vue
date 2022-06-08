<template>
  <div class="row">
    <div class="col-12">
      <div class="dashboard-title-box flex-row align-items-center mb-4 mb-lg-5 mt-2 mt-lg-3">
        <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">Users</div>
      </div>

      <div class="users-table-wrapper">
        <loading
          :active.sync="isLoading"
          :is-full-page="loaderOptions.IS_FULL_PAGE"
          :color="loaderOptions.COLOR"
          :background-color="loaderOptions.BACKGROUND_COLOR"
        ></loading>
        <template v-if="usersPagination.loaded">
          <template v-if="users && users.length">
            <b-table
              class="table-custom-border"
              bordered
              :items="users"
              :fields="tableHeaderFields"
            >
              <template #cell(actions)="data">
                <div
                  class="d-flex justify-content-center cursor-pointer"
                  @click="goToUserProfile(data.item.id)"
                >
                  <SvgIcon icon="openArrowRight" ></SvgIcon>
                </div>
              </template>
            </b-table>
            <b-btn
              v-if="!usersPagination.isLastPage"
              class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
              @click="loadMoreUsers"
            >
              <span>Load more</span>
            </b-btn>
          </template>
          <h4 v-else class="text-center">No users found</h4>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import api from '../api';
import config from "../config";
import helpers from '../helpers';
import SvgIcon from './SvgIcon';

export default {
  name: "Tokens",
  components: {SvgIcon, Loading},
  data: () => ({
    loaderOptions: { ...config.LOADER_OPTIONS },
    tableHeaderFields: [
      {
        key: 'fullName',
        label: 'Name'
      },
      {
        key: 'email',
        label: 'Email'
      },
      {
        key: 'phone',
        label: 'Phone'
      },
      {
        key:'actions',
        label:""
      }
    ],
    isLoading: false,
    currentUserId:"",
    users: [],
    usersPagination: {
      total: 0,
      page: 1,
      pageCount: 1,
      loaded: false,
      isLastPage: false
    },
    currentUser: {}
  }),
  methods: {
    showMobileAside() {
      this.$eventHub.$emit('show-mobile-profile-aside');
    },
    goToUserProfile(userId) {
      this.$router.push(`/admin/user-details/${userId}`)
    },
     loadUsers() {
      this.isLoading = true;
      const requests = [
        api.dashboard.profile.userInfo(),
        api.dashboard.users.getAllUsers(this.usersPagination.page, "", this.currentUserId)
      ];
      Promise.all(requests)
        .then(result => {
          
          if (result && result[0]) {
            // user info
            const user = { ...result[1] };
            this.currentUser = { ...user };
            this.$store.commit('userInfo', { ...user });
          }
          if (result && result[1]) {
            // users info
            this.tokensResponseHandler(result[1]);
          }
          return true;
        })
        .catch(err => {
          this.usersPagination.loaded = true;
        }).finally(()=>{
          this.isLoading = false;
        });
    },
    loadMoreUsers() {
      if (this.usersPagination.isLastPage) return;
      this.usersPagination.page++;
      this.loadUsers();
    },
    tokensResponseHandler(response) {
      if (response && response.data && response.data.length) {
        this.users = this.users.concat(response.data);
      }
      this.usersPagination.total = response.total;
      this.usersPagination.pageCount = response.pageCount;
      this.usersPagination.isLastPage = response.page === response.pageCount;
      this.usersPagination.loaded = true;
      this.isLoading = false;
    },
    getPickupTimeDate(dateStr) {
      return helpers.parseDateForTokensTable(dateStr);
    },
    getTokensStr(item) {
      const _str = Number(this.currentUser.id) === Number(item.cookId) ? 'earned' : 'spent';
      return `${_str} ${item.servings} token${item.servings === 1 ? '' : 's'}`;
    }
  },
  created() {
    this.currentUserId = localStorage.getItem('plUserId') || this.$store.getters.userId || '';
    this.loadUsers();
  }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";

.users-table-wrapper {
  min-height: 300px;
  width: 100%;
  position: relative;

  @media screen and (max-width: $phoneBigWidth) {
    min-height: 200px;
  }
}
</style>
