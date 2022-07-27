<template>
  <div class="row">
    <div class="col-12">
      <b-alert
        @dismiss-count-down="countDownChanged"
        @dismissed="alert.show = 0"
        :show="alert.show"
        :variant="alert.variant"
        dismissible
        fade
        class="d-alert"
      >
        <p>{{ alert.msg }}</p>
      </b-alert>
      <div class="dashboard-title-box d-flex flex-row align-items-center mb-2 mt-2 mt-lg-3">
        <div class="dashboard-profile-title-back mr-2 mr-md-3">
          <div class="cursor-pointer" @click="showMobileAside">
            <SvgIcon icon="arrowLeft"></SvgIcon>
          </div>
        </div>
        <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">My Network</div>
      </div>

      <b-tabs nav-class="custom-tabs" content-class="profile-item mt-4" v-model="activeTabIndex" @input="onTabSwitched">
        <b-tab title="My Network" :disabled="isLoadingUsers || isLoadingFavorite">
          <div class="tab-content-wrapper">
            <b-form class="form searchFormNormal">
              <b-form-group class="position-relative">
                <b-form-input
                  v-model.trim="searchStrNetworkUsers"
                  placeholder="Search my network"
                  class="form-control search-form-control"
                  autocomplete="off"
                  debounce="500"
                  @update="triggerSearchNetworkUsers"
                />
                <div
                  class="clear-icon-wrapper cursor-pointer"
                  v-if="searchStrNetworkUsers && searchStrNetworkUsers.length"
                  @click="clearSearchStrNetworkUsers"
                >
                  <SvgIcon icon="close"></SvgIcon>
                </div>
              </b-form-group>
            </b-form>
            <loading
              :active.sync="isLoadingFriends"
              :is-full-page="loaderOptions.IS_FULL_PAGE"
              :color="loaderOptions.COLOR"
              :background-color="loaderOptions.BACKGROUND_COLOR"
            />
            <template v-if="networkUsersPagination.loaded">
              <div class="connection" v-if="listOfNetworkUsers && listOfNetworkUsers.length">
                <UserInfoLine
                  v-for="(item,i) in listOfNetworkUsers"
                  :key="(i)"
                  :user="item"
                  :has-remove-action="true"
                  :user-to-remove="networkUserToRemove"
                  @redirect-to-cook-profile="redirectToCookProfile(item.id)"
                  @remove-user="removeItemFromMyNetwork(item)"
                />
                <b-btn
                  v-if="!networkUsersPagination.isLastPage"
                  class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                  @click="loadMoreNetworkUsers"
                >
                  <span>Load more</span>
                </b-btn>
              </div>
              <div v-else>
                <p>No network users found.</p>
              </div>
            </template>
          </div>
        </b-tab>
        <!-- <b-tab title="Friends" :disabled="isLoadingUsers || isLoadingFavorite">
          <div class="tab-content-wrapper">
            <b-form class="form searchFormNormal">
              <b-form-group class="position-relative">
                <b-form-input
                  v-model.trim="searchStrFriends"
                  placeholder="Search my network"
                  class="form-control search-form-control"
                  autocomplete="off"
                  debounce="500"
                  @update="triggerSearchFriends"
                />
                <div
                  class="clear-icon-wrapper cursor-pointer"
                  v-if="searchStrFriends && searchStrFriends.length"
                  @click="clearSearchStrFriends"
                >
                  <SvgIcon icon="close"></SvgIcon>
                </div>
              </b-form-group>
            </b-form>
            <loading
              :active.sync="isLoadingFriends"
              :is-full-page="loaderOptions.IS_FULL_PAGE"
              :color="loaderOptions.COLOR"
              :background-color="loaderOptions.BACKGROUND_COLOR"
            />
            <template v-if="networkUsersPagination.loaded">
              <div class="connection" v-if="listOfNetworkUsers && listOfNetworkUsers.length">
                <UserInfoLine
                  v-for="(item,i) in listOfNetworkUsers"
                  :key="(i)"
                  :user="item"
                  :has-remove-action="true"
                  :user-to-remove="friendToRemove"
                  @redirect-to-cook-profile="redirectToCookProfile(item.id)"
                  @remove-user="removeItemFromMyNetwork(item)"
                />
                <b-btn
                  v-if="!networkUsersPagination.isLastPage"
                  class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                  @click="loadMoreFriends"
                >
                  <span>Load more</span>
                </b-btn>
              </div>
              <div v-else>
                <p>No friends found.</p>
              </div>
            </template>
          </div>
        </b-tab> -->

        <b-tab title="Favorites" :disabled="isLoadingUsers || isLoadingFriends">
          <div class="tab-content-wrapper">
            <b-form class="form searchFormNormal">
              <b-form-group class="position-relative">
                <b-form-input
                  v-model.trim="searchStrFavorite"
                  placeholder="Search favorite cooks"
                  class="form-control search-form-control"
                  autocomplete="off"
                  debounce="500"
                  @update="triggerSearchFavorite"
                >
                </b-form-input>
                <div
                  class="clear-icon-wrapper cursor-pointer"
                  v-if="searchStrFavorite && searchStrFavorite.length"
                  @click="clearSearchStrFavorite"
                >
                  <SvgIcon icon="close"></SvgIcon>
                </div>
              </b-form-group>
            </b-form>
            <loading
              :active.sync="isLoadingFavorite"
              :is-full-page="loaderOptions.IS_FULL_PAGE"
              :color="loaderOptions.COLOR"
              :background-color="loaderOptions.BACKGROUND_COLOR"
            ></loading>
            <template v-if="favoritePagination.loaded">
              <div class="connection" v-if="listOfFavorites && listOfFavorites.length">
                <UserInfoLine
                  v-for="(item,i) in listOfFavorites"
                  :key="i"
                  :user="item"
                  :has-remove-action="true"
                  :user-to-remove="favoriteToRemove"
                  @redirect-to-cook-profile="redirectToCookProfile(item.id)"
                  @remove-user="removeItemFromListOfFavorite(item)"
                ></UserInfoLine>
                <b-btn
                  v-if="!favoritePagination.isLastPage"
                  class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                  @click="loadMoreFavorite"
                >
                  <span>Load more</span>
                </b-btn>
              </div>
              <div v-else>
                <p>No favorite cooks found.</p>
              </div>
            </template>
          </div>
        </b-tab>

        <b-tab title="Everybody" :disabled="isLoadingFriends || isLoadingFavorite">
          <div class="tab-content-wrapper">
            <b-form class="form searchFormNormal">
              <b-form-group class="position-relative">
                <b-form-input
                  v-model.trim="searchStrUsers"
                  placeholder="Search users by name"
                  class="form-control search-form-control"
                  autocomplete="off"
                  debounce="500"
                  @update="triggerSearchUsers"
                >
                </b-form-input>
                <div
                  class="clear-icon-wrapper cursor-pointer"
                  v-if="searchStrUsers && searchStrUsers.length"
                  @click="clearSearchStrUsers"
                >
                  <SvgIcon icon="close"></SvgIcon>
                </div>
              </b-form-group>
            </b-form>
            <loading
              :active.sync="isLoadingUsers"
              :is-full-page="loaderOptions.IS_FULL_PAGE"
              :color="loaderOptions.COLOR"
              :background-color="loaderOptions.BACKGROUND_COLOR"
            ></loading>
            <template v-if="usersPagination.loaded">
              <div class="connection" v-if="users && users.length">
                <UserInfoLine
                  v-for="(user,i) in users"
                  :key="i"
                  :user="user"
                  :has-remove-action="false"
                  :has-invite-action="true"
                  :invite-action-caption="getInviteCaption(user.id,user.email)"
                  @invite-user="inviteUser(user)"
                  @redirect-to-cook-profile="redirectToCookProfile(user.id)"
                  @re-invite="reInvite(user)"
                />
                <b-btn
                  v-if="!usersPagination.isLastPage"
                  class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                  @click="loadMoreUsers"
                >
                  <span>Load more</span>
                </b-btn>
              </div>
              <div v-else>
                <p>No users found.</p>
              </div>
            </template>
          </div>
        </b-tab>
      </b-tabs>
    </div>

    <!-- Modals -->
    <ConfirmModal
      :id="modalIdFriend"
      :message="confirmRemoveFriendMsg"
      @confirmed="onConfirmedRemoveFriend"
      @canceled="onCanceledRemoveFriend"
    />
    <ConfirmModal
      :id="modalIdNetwork"
      :message="confirmRemoveNetworkMsg"
      @confirmed="onConfirmedRemoveNetworkUser"
      @canceled="onCancelRemoveNetwork"
    />
    <ConfirmModal
      :id="modalIdFavorite"
      :message="confirmRemoveFavoriteMsg"
      @confirmed="onConfirmedRemoveFavorite"
      @canceled="onCanceledRemoveFavorite"
    />
    <ConfirmModal
      :id="modalInviteFriend"
      :message="confirmInviteMsg"
      @confirmed="onConfirmedInvite"
      @canceled="onCanceledInvite"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Loading from 'vue-loading-overlay';
import api from '../../api';
import config from "../../config";
import ConfirmModal from '../../components/modals/ConfirmModal';
import SvgIcon from '../../components/SvgIcon';
import UserInfoLine from '../../components/UserInfoLine';

export default {
  name: "MyNetwork",
  components: {Loading, ConfirmModal, SvgIcon, UserInfoLine},
  data: () => ({
    loaderOptions: { ...config.LOADER_OPTIONS },
    activeTabIndex: 0,
    friendToRemove: null,
    networkUserToRemove: null,
    confirmRemoveNetworkMsg: 'Are you sure you want to remove this person from your network?',
    modalIdNetwork: 'confirm-remove-network-user',
    confirmRemoveFriendMsg: 'Are you sure you want to remove this person from your friends?',
    modalIdFriend: 'confirm-remove-friend',
    confirmRemoveFavoriteMsg: 'Are you sure you want to remove this person from your favorite list?',
    modalInviteFriend: 'confirm-invite-friend',
    confirmInviteMsg: 'Are you sure you want to invite this person to your network?',
    invitationId: null,
    userToInvite: null,
    favoriteToRemove: null,
    modalIdFavorite: 'confirm-remove-favorite',
    searchStrFriends: '',
    searchStrNetworkUsers: '',
    searchStrFavorite: '',
    isRemovingFriend: false,
    isRemovingFavorite: false,
    isRemovingNetwork: false,
    users: [],
    pendingInvitations: [],
    rejectedInvitations: [],
    usersPagination: {
      total: 0,
      page: 1,
      pageCount: 1,
      loaded: false,
      isLastPage: false
    },
    isLoadingUsers: false,
    searchStrUsers: '',
    currentUserId: '',
    friendsPagination: {
      total: 0,
      page: 1,
      pageCount: 1,
      loaded: false,
      isLastPage: false
    },
    isLoadingFriends: false,
    listOfFriends: [],
    networkUsersPagination: {
      total: 0,
      page: 1,
      pageCount: 1,
      loaded: false,
      isLastPage: false
    },
    isLoadingNetworkUsers: false,
    listOfNetworkUsers: [],
    favoritePagination: {
      total: 0,
      page: 1,
      pageCount: 1,
      loaded: false,
      isLastPage: false
    },
    isLoadingFavorite: false,
    listOfFavorites: [],
    alert: {
      msg: "",
      variant: "success",
      show: 0
    }
  }),
  created () {
    this.currentUserId = localStorage.getItem('plUserId') || this.$store.getters.userId || '';
    // this.loadFriends();
    this.loadNetworkUsers();
    this.getPendingInvitations();
    this.getRejectedInvitations();
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
  },
  methods: {
    onTabSwitched (tabIndex) {
      switch (tabIndex) {
        case 0:
          if (!this.networkUsersPagination.loaded) {
            this.loadNetworkUsers();
          }
          break;
        case 1:
          if (!this.favoritePagination.loaded) {
            return this.loadFavorite();
          }
          break;
        case 2:
          if (!this.usersPagination.loaded) {
            return this.loadUsers();
          }
          break;
        default:
          break;
      }
    },
    loadFriends (search) {
      this.isLoadingFriends = true;
      api.dashboard.follows.getMyFriends(this.friendsPagination.page, search)
        .then(res => {
          const shouldOverride = this.friendsPagination.page === 1;
          const result = res.data;
          if (result && result.length) {
            const _data = result.map(item => {
              return item.follower?.id != this.userInfo.id ? item.follower : item.following;
            });
            this.listOfFriends = shouldOverride ? _data.slice(0) : this.listOfFriends.concat(_data.slice(0));
          } else if (shouldOverride) {
            this.listOfFriends = [];
          }
          this.friendsPagination.total = result.total;
          this.friendsPagination.pageCount = result.pageCount;
          this.friendsPagination.isLastPage = result.page === result.pageCount;
          this.friendsPagination.loaded = true;
          this.isLoadingFriends = false;
        })
        .catch(err => {
          console.log('\n >> err > ', err);
          this.isLoadingFriends = false;
        });
    },
    loadMoreFriends () {
      if (this.friendsPagination.isLastPage) return;
      this.friendsPagination.page++;
      this.loadFriends();
    },
    loadNetworkUsers (search) {
    this.isLoadingNetworkUsers = true;
    api.dashboard.follows.getMyNetworks(this.networkUsersPagination.page, search)
      .then(res => {
        const shouldOverride = this.networkUsersPagination.page === 1;
        const result = res.data;
        if (result && result.length) {
          const _data = result.map(item => {
            return item.follower?.id != this.userInfo.id ? item.follower : item.following;
          });
          this.listOfNetworkUsers = shouldOverride ? _data.slice(0) : this.listOfNetworkUsers.concat(_data.slice(0));
        } else if (shouldOverride) {
          this.listOfNetworkUsers = [];
        }
        this.networkUsersPagination.total = result.total;
        this.networkUsersPagination.pageCount = result.pageCount;
        this.networkUsersPagination.isLastPage = result.page === result.pageCount;
        this.networkUsersPagination.loaded = true;
        this.isLoadingNetworkUsers = false;
      })
      .catch(err => {
        console.log('\n >> err > ', err);
        this.isLoadingNetworkUsers = false;
      });
    },
    loadMoreNetworkUsers () {
      if (this.networkUsersPagination.isLastPage) return;
      this.networkUsersPagination.page++;
      this.loadNetworkUsers();
    },
    loadUsers (search) {
      this.isLoadingUsers = true;
      api.dashboard.users.getAllUsers(this.usersPagination.page, search, this.currentUserId)
        .then(result => {
          const shouldOverride = this.usersPagination.page === 1;
          if (result && result.data && result.data.length) {
            this.users = shouldOverride ? result.data.slice(0) : this.users.concat(result.data.slice(0));
            this.users = this.users.filter(res => res.id != this.userInfo.id);
          } else if (shouldOverride) {
            this.users = [];
          }
          this.usersPagination.total = result.total;
          this.usersPagination.pageCount = result.pageCount;
          this.usersPagination.isLastPage = result.page === result.pageCount;
          this.usersPagination.loaded = true;
          this.isLoadingUsers = false;
        })
        .catch(err => {
          console.log('\n >> err > ', err);
          this.isLoadingUsers = false;
        });
    },
    getInviteCaption(userId,email){
      if(!userId) return;

      const user = this.listOfNetworkUsers.find(res => res.id == userId);
      const pendingEmail = this.pendingInvitations.find(res => res.email == email);
      const rejectedEmail = this.rejectedInvitations.find(res => res.email == email);

      let status = "";

      if(pendingEmail && !rejectedEmail && !user) {
        status = "Invited";
      } else if (rejectedEmail && !user) {
        status = "Rejected";
      } else if (!rejectedEmail && user) {
        status = "In Network";
      } else {
        status = "Invite";
      }

      return status;
    },
    loadMoreUsers () {
      if (this.usersPagination.isLastPage) return;
      this.usersPagination.page++;
      this.loadUsers();
    },
    triggerSearchUsers () {
      this.usersPagination.total = 0;
      this.usersPagination.page = 1;
      this.usersPagination.pageCount = 1;
      this.usersPagination.loaded = false;
      this.usersPagination.isLastPage = false;
      this.users = [];
      this.loadUsers(this.searchStrUsers);
    },
    clearSearchStrUsers () {
      this.searchStrUsers = '';
      this.triggerSearchUsers();
    },
    removeItemFromMyNetwork (item) {
      if (this.isRemovingNetwork) return;
      this.networkUserToRemove = { ...item };
      this.$bvModal.show(this.modalIdNetwork);
    },
    onConfirmedRemoveNetworkUser () {
      if (!this.networkUserToRemove || !this.networkUserToRemove.id) return;
      this.isRemovingNetwork = true;
      const _id = this.networkUserToRemove.id;
      const userId=this.currentUserId;
      api.dashboard.follows.removeFollower(userId,_id,"network")
        .then(() => {
          this.listOfFriends = this.listOfFriends.filter(item => item.id !== Number(_id));
          this.networkUserToRemove = null;
          this.isRemovingNetwork = false;
          this.loadNetworkUsers();
        })
        .catch(err => {
          this.networkUserToRemove = null;
          this.isRemovingNetwork = false;
        });
    },
    removeItemFromFriend (item) {
      if (this.isRemovingFriend) return;
      this.friendToRemove = { ...item };
      this.$bvModal.show(this.modalIdFriend);
    },
    onConfirmedRemoveFriend () {
      if (!this.friendToRemove || !this.friendToRemove.id) return;
      this.isRemovingFriend = true;
      const _id = this.friendToRemove.id;
      const userId = this.currentUserId;
      api.dashboard.follows.removeFollower(userId,_id,"friend")
        .then(() => {
          this.listOfFriends = this.listOfFriends.filter(item => item.id !== Number(_id));
          this.friendToRemove = null;
          this.isRemovingFriend = false;
        })
        .catch(err => {
          console.log('\nerr unfollow user:', err);
          this.friendToRemove = null;
          this.isRemovingFriend = false;
        });
    },
    inviteUser(item) {
      this.userToInvite = item;
      const { email } = this.userInfo;
      if (email) {
        api.invitations.generateInvitation({email, type: "network"}).then(str => {
          const invitationId = str?str.split("code=")[1].split("&user-name")[0] : "";
          this.invitationId = invitationId;
          this.$bvModal.show(this.modalInviteFriend);
        })
      }
    },
    reInvite(item){
      this.userToInvite = item;
      const { email } = this.userInfo;
      if (email) {
        api.invitations.reGenerateInvitation({email, type:"network"}).then(str => {
          const invitationId = str?str.split("code=")[1].split("&user-name")[0] : "";
          this.invitationId = invitationId;
          this.$bvModal.show(this.modalInviteFriend);
        });
      }
    },
    getPendingInvitations() {
      api.invitations.getInviteByStatus("Pending").then(invitations => {
        this.pendingInvitations = invitations;
      })
    },
    getRejectedInvitations() {
      api.invitations.getInviteByStatus("Rejected").then(invitations => {
        this.rejectedInvitations = invitations;
      })
    },
    onConfirmedInvite() {
      const invitationId = this.invitationId;
      const { email } = this.userToInvite;
      const emailData = {
        invitationId,
        email: email,
        userId: this.currentUserId,
        type: "network"
      }
      api.invitations.sendInvitation(emailData).then(res1 => {
        this.getPendingInvitations();
        this.alert = {
          msg: "Invitations sent",
          variant: "success",
          show: 5
        }
      });
    },
    onCanceledInvite(){
      this.invitationId = null;
      this.userToInvite = null;
    },
    onCanceledRemoveFriend () {
      this.friendToRemove = null;
    },
    onCancelRemoveNetwork () {
      this.networkUserToRemove = null;
    },
    removeItemFromListOfFavorite (item) {
      if (this.isRemovingFavorite) return;
      this.favoriteToRemove = { ...item };
      this.$bvModal.show(this.modalIdFavorite);
    },
    onConfirmedRemoveFavorite () {
      if (!this.favoriteToRemove || !this.favoriteToRemove.id) return;
      this.isRemovingFavorite = true;
      const _id = this.favoriteToRemove.id;
      api.dashboard.follows.removeUserFromFavorites(_id)
        .then(() => {
          this.listOfFavorites = this.listOfFavorites.filter(item => item.id !== Number(_id));
          this.favoriteToRemove = null;
          this.isRemovingFavorite = false;
        })
        .catch(err => {
          console.log('\nerr remove from favorite list:', err);
          this.favoriteToRemove = null;
          this.isRemovingFavorite = false;
        });
    },
    onCanceledRemoveFavorite () {
      this.favoriteToRemove = null;
    },
    clearSearchStrNetworkUsers(){
      this.searchStrNetworkUsers='';
      this.triggerSearchNetworkUsers();
    },
    clearSearchStrFriends () {
      this.searchStrFriends = '';
      this.triggerSearchFriends();
    },
    triggerSearchFriends () {
      this.friendsPagination.total = 0;
      this.friendsPagination.page = 1;
      this.friendsPagination.pageCount = 1;
      this.friendsPagination.loaded = false;
      this.friendsPagination.isLastPage = false;
      this.listOfFriends = [];
      this.loadFriends(this.searchStrFriends);
    },
    triggerSearchNetworkUsers () {
      this.networkUsersPagination.total = 0;
      this.networkUsersPagination.page = 1;
      this.networkUsersPagination.pageCount = 1;
      this.networkUsersPagination.loaded = false;
      this.networkUsersPagination.isLastPage = false;
      this.listOfNetworkUsers = [];
      this.loadNetworkUsers(this.searchStrNetworkUsers);
    },
    clearSearchStrFavorite () {
      this.searchStrFavorite = '';
      this.triggerSearchFavorite();
    },
    triggerSearchFavorite () {
      this.favoritePagination.total = 0;
      this.favoritePagination.page = 1;
      this.favoritePagination.pageCount = 1;
      this.favoritePagination.loaded = false;
      this.favoritePagination.isLastPage = false;
      this.listOfFavorites = [];
      this.loadFavorite(this.searchStrFavorite);
    },
    showMobileAside () {
      this.$eventHub.$emit('show-mobile-profile-aside');
    },
    redirectToCookProfile (id) {
      if (!id) return;
      this.$router.push({ path: `/dashboard/cook-profile/${id}` }).catch(()=>{});
    },
    countDownChanged(dismissCountDown) {
      this.alert.show = dismissCountDown;
    },
    loadFavorite (search) {
      this.isLoadingFavorite = true;
      api.dashboard.follows.getMyFavorites(this.favoritePagination.page, search)
        .then(result => {
          const shouldOverride = this.favoritePagination.page === 1;
          if (result && result.data && result.data.length) {
            const _data = result.data.map(item => {
              return item.following;
            });
            this.listOfFavorites = shouldOverride ? _data.slice(0) : this.listOfFavorites.concat(_data.slice(0));
            this.listOfFavorites = this.listOfFavorites.filter(res => res.id != this.userInfo.id)
          } else if (shouldOverride) {
            this.listOfFavorites = [];
          }
          this.favoritePagination.total = result.total;
          this.favoritePagination.pageCount = result.pageCount;
          this.favoritePagination.isLastPage = result.page === result.pageCount;
          this.favoritePagination.loaded = true;
          this.isLoadingFavorite = false;
        })
        .catch(err => {
          console.log('\n >> err > ', err);
          this.isLoadingFavorite = false;
        });
    },
    loadMoreFavorite () {
      if (this.favoritePagination.isLastPage) return;
      this.favoritePagination.page++;
      this.loadFavorite();
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.profile-item {
  margin-bottom: -4px;
  margin-right: 24px;

  &:last-child {
    margin-right: 0;
  }
}
.tab-content-wrapper {
  min-height: 300px;
  width: 100%;
  position: relative;

  .form-group {
    .search-form-control {
      padding-right: 45px;
    }
    .clear-icon-wrapper {
      position: absolute;
      top: 12px;
      right: 12px;
    }
  }
}

.d-alert {
  position: absolute;
  width: calc(100% - 50px);
  z-index: 4;
}
</style>
