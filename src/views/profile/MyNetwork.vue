<template>
    <div class="row">
        <div class="col-12">
            <div class="dashboard-title-box flex-row align-items-center mb-4 mb-lg-5 mt-2 mt-lg-3">
                <div class="dashboard-profile-title-back mr-2 mr-md-3">
                    <div class="cursor-pointer" @click="showMobileAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                    </div>
                </div>
                <div class="dashboard-profile-title-text title-size3 titleGreenNavyColor">My Network</div>
            </div>

            <b-tabs nav-class="custom-tabs" content-class="profile-item mt-4" v-model="activeTabIndex" @input="onTabSwitched">
                <b-tab title="My Connections" :disabled="isLoadingUsers || isLoadingInvites">
                    <div class="tab-content-wrapper">
                        <b-form class="form searchFormNormal">
                            <b-form-group class="position-relative">
                                <b-form-input
                                        v-model.trim="searchStrConnections"
                                        placeholder="Search my connections"
                                        class="form-control search-form-control"
                                        autocomplete="off"
                                        debounce="500"
                                        @update="triggerFilterConnections"
                                >
                                </b-form-input>
                                <div
                                        class="clear-icon-wrapper cursor-pointer"
                                        v-if="searchStrConnections && searchStrConnections.length"
                                        @click="clearSearchStrConnections"
                                >
                                    <SvgIcon icon="close"></SvgIcon>
                                </div>
                            </b-form-group>
                        </b-form>
                        <loading
                                :active.sync="isLoadingConnections"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                        ></loading>
                        <template v-if="areConnectionsLoaded">
                            <div class="connection" v-if="connectionsFiltered && connectionsFiltered.length">
                                <div
                                        class="connection-box has-action-button"
                                        v-for="item in connectionsFiltered"
                                        v-bind:key="item.id"
                                >
                                    <div class="connection-box-info">
                                        <div
                                                class="connection-box-info-img-placeholder mr-2 mr-xl-3"
                                                @click="redirectToCookProfile(item.id)"
                                        >
                                            <i class="fas fa-user-circle user-icon"></i>
                                        </div>
                                        <!-- TODO: display real image if exists -->
                                        <!--<div class="connection-box-info-img mr-2 mr-xl-3" @click="redirectToCookProfile(item.id)">-->
                                            <!--<img src="../../assets/images/data/images/avatars/avatar.jpg" alt="" class="img-fluid">-->
                                        <!--</div>-->
                                        <div class="connection-box-info-name cursor-pointer">
                                            <span @click="redirectToCookProfile(item.id)">{{item.fullName}}</span>
                                        </div>
                                    </div>
                                    <div class="box-btn">
                                        <b-btn
                                                class="action-button btnNavyRedTransparent btnSmallSize hover-slide-left"
                                                v-bind:class="{ btnDisabled: connectionToRemove && connectionToRemove.id === item.id }"
                                                @click="removeItemFromMyNetwork(item)"
                                        >
                                            <span class="pending" v-if="connectionToRemove && connectionToRemove.id === item.id">Pending</span>
                                            <span v-else>Remove</span>
                                        </b-btn>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p>No connections found.</p>
                            </div>
                        </template>
                    </div>
                </b-tab>

                <b-tab title="Invites" :disabled="isLoadingUsers || isLoadingConnections">
                    <div class="tab-content-wrapper">
                        <loading
                                :active.sync="isLoadingInvites"
                                :is-full-page="loaderOptions.IS_FULL_PAGE"
                                :color="loaderOptions.COLOR"
                        ></loading>
                        <template v-if="areInvitesLoaded">
                            <div v-if="invites && invites.length">
                                <!-- TODO: display invites list -->
                            </div>
                            <div v-else>
                                <p>No invites found.</p>
                            </div>
                        </template>
                    </div>
                </b-tab>

                <b-tab title="Everybody" :disabled="isLoadingConnections || isLoadingInvites">
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
                        ></loading>
                        <template v-if="usersPagination.loaded">
                            <div class="connection" v-if="users && users.length">
                                <div class="connection-box" v-for="user in users">
                                    <div class="connection-box-info">
                                        <div
                                                class="connection-box-info-img-placeholder mr-2 mr-xl-3"
                                                @click="redirectToCookProfile(user.id)"
                                        >
                                            <i class="fas fa-user-circle user-icon"></i>
                                        </div>
                                        <!-- TODO: display real image if exists -->
                                        <!--<div class="connection-box-info-img mr-2 mr-xl-3" @click="redirectToCookProfile(user.id)">-->
                                            <!--<img src="../../assets/images/data/images/avatars/avatar.jpg" alt="" class="img-fluid">-->
                                        <!--</div>-->
                                        <div class="connection-box-info-name">
                                            <span @click="redirectToCookProfile(user.id)">{{user.fullName}}</span>
                                        </div>
                                    </div>
                                </div>
                                <b-btn
                                        v-if="!usersPagination.isLastPage"
                                        class="btnGreenTransparent btnNormalSize btn100 hover-slide-left mt-4"
                                        @click="loadMoreUsers">
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
                :id="modalId"
                :message="confirmRemoveMsg"
                @confirmed="onConfirmedRemove"
                @canceled="onCanceledRemove"
        ></ConfirmModal>
    </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import api from '../../api';
import ConfirmModal from '../../components/modals/ConfirmModal';
import config from "../../config";
import SvgIcon from '../../components/SvgIcon';
export default {
    name: "MyNetwork",
    components: {Loading, ConfirmModal, SvgIcon},
    data: () => ({
        loaderOptions: { ...config.LOADER_OPTIONS },
        activeTabIndex: 0,
        confirmRemoveMsg: 'Are you sure you want to remove this person from your network?',
        connectionToRemove: null,
        modalId: 'confirm-remove',
        searchStrConnections: '',
        connections: [],
        connectionsFiltered: [],
        isLoadingConnections: false,
        areConnectionsLoaded: false,
        isRemovingConnection: false,
        invites: [],
        invitesFiltered: [],
        isLoadingInvites: false,
        areInvitesLoaded: false,
        users: [],
        usersPagination: {
            total: 0,
            page: 1,
            pageCount: 1,
            loaded: false,
            isLastPage: false
        },
        isLoadingUsers: false,
        searchStrUsers: '',
        currentUserId: ''
    }),
    created () {
        this.currentUserId = localStorage.getItem('plUserId') || this.$store.getters.userId || '';
        this.loadConnections();
    },
    methods: {
        onTabSwitched (tabIndex) {
            switch (tabIndex) {
                case 0:
                    if (!this.areConnectionsLoaded) {
                        return this.loadConnections();
                    }
                    break;
                case 1:
                    if (!this.areInvitesLoaded) {
                        return this.loadInvites();
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
        loadConnections () {
            this.isLoadingConnections = true;
            api.dashboard.follows.getMyConnections()
                .then(result => {
                    if (result.following && result.following.length) {
                        this.connections = result.following.map(user => user);
                        this.connectionsFiltered = this.connections.slice(0);
                    }
                    this.isLoadingConnections = false;
                    this.areConnectionsLoaded = true;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isLoadingConnections = false;
                })
        },
        loadInvites () {
            this.isLoadingInvites = true;
            api.dashboard.follows.getMyInvites()
                .then(result => {
                    // TODO: parse the result
                    this.isLoadingInvites = false;
                    this.areInvitesLoaded = true;
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.isLoadingInvites = false;
                })
        },
        loadUsers (search) {
            this.isLoadingUsers = true;
            api.dashboard.users.getAllUsers(this.usersPagination.page, search, this.currentUserId)
                .then(result => {
                    if (result && result.data && result.data.length) {
                        this.users = result.data.slice(0);
                    } else {
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
                })
        },
        loadMoreUsers () {
            if (this.usersPagination.isLastPage) return;
            this.usersPagination.page++;
            this.loadUsers();
        },
        followUser (user) {
            // temp
            api.dashboard.follows.followUser(user.id)
                .then(result => {
                    this.connections.push({ ...user });
                    this.filterConnections();
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                })
        },
        triggerSearchUsers () {
            this.usersPagination.total = 0;
            this.usersPagination.page = 1;
            this.usersPagination.pageCount = 1;
            this.usersPagination.loaded = false;
            this.usersPagination.loaisLastPageded = false;
            this.users = [];
            this.loadUsers(this.searchStrUsers);
        },
        clearSearchStrUsers () {
            this.searchStrUsers = '';
            this.triggerSearchUsers();
        },
        removeItemFromMyNetwork (item) {
            if (this.isRemovingConnection) return;
            this.connectionToRemove = { ...item };
            this.$bvModal.show(this.modalId);
        },
        onConfirmedRemove () {
            if (!this.connectionToRemove || !this.connectionToRemove.id) return;
            this.isRemovingConnection = true;
            const _id = this.connectionToRemove.id;
            api.dashboard.follows.unFollowUser(_id)
                .then(() => {
                    this.connections = this.connections.filter(item => item.id !== Number(_id));
                    if (this.connectionsFiltered && this.connectionsFiltered.length) {
                        this.connectionsFiltered = this.connectionsFiltered.filter(item => item.id !== Number(_id));
                    }
                    this.connectionToRemove = null;
                    this.isRemovingConnection = false;
                })
                .catch(err => {
                    console.log('\nerr unfollow user:', err);
                    this.connectionToRemove = null;
                    this.isRemovingConnection = false;
                });
        },
        onCanceledRemove () {
            this.connectionToRemove = null;
        },
        clearSearchStrConnections () {
            this.searchStrConnections = '';
            this.triggerFilterConnections();
        },
        triggerFilterConnections () {
            this.filterConnections();
        },
        filterConnections () {
            if (!this.searchStrConnections || !this.searchStrConnections.length) {
                if (!this.connections || !this.connections.length) {
                    this.connectionsFiltered = [];
                    return;
                }
                this.connectionsFiltered = this.connections.slice(0);
                return;
            }
            this.connectionsFiltered = this.connections.filter(item => {
                return item.fullName.toLowerCase().includes(this.searchStrConnections);
            });
        },
        showMobileAside () {
            this.$eventHub.$emit('show-mobile-profile-aside');
        },
        redirectToCookProfile (id) {
            if (!id) return;
            this.$router.push({ path: `/dashboard/cook-profile/${id}` }).catch(()=>{});
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.connection {
    .connection-box {
        $actionBtnWidth: 108px;
        $actionBtnWidthMobile: 84px;

        padding: 11px 0;
        border-bottom: 1px solid rgba(138,135,125,0.25);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        &.has-action-button {
            .connection-box-info {
                width: calc(100% - #{$actionBtnWidth});

                @media screen and (max-width: $phoneBigWidth) {
                    width: calc(100% - #{$actionBtnWidthMobile});
                }
            }
        }

        .connection-box-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex: none;
            width: 100%;

            .connection-box-info-img {
                cursor: pointer;

                img {
                    width: 40px;
                    height: 40px;
                    object-fit: cover;
                }
            }

            .connection-box-info-name {
                font-family: $FilsonProBold;
                cursor: pointer;
                -webkit-transition: color 0.3s ease;
                -moz-transition: color 0.3s ease;
                -ms-transition: color 0.3s ease;
                -o-transition: color 0.3s ease;
                transition: color 0.3s ease;

                &:hover {
                    color: $greenColor;
                }

                @media screen and (max-width: $phoneBigWidth) {
                    padding-right: 5px;
                }
            }
            .connection-box-info-img-placeholder {
                cursor: pointer;
                width: 40px;
                height: 40px;

                .user-icon {
                    font-size: 40px;
                    color: $grayColor;
                }
            }
        }
        .box-btn {
            .action-button {
                min-width: $actionBtnWidth;

                span.pending {
                    &::after {
                        content: '...';

                        @media screen and (max-width: $phoneBigWidth) {
                            content: '';
                        }
                    }
                }

                @media screen and (max-width: $phoneBigWidth) {
                    min-width: $actionBtnWidthMobile;

                    span {
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
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
</style>
