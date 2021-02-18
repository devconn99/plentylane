<template>
    <b-modal
            id="invite-friends-modal"
            ref="inviteFriendsModal"
            hide-footer
            size="lg"
            modal-class="invite-friends-modal"
            centered
            @hidden="onHidden"
            :return-focus="{}"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor text-center mb-4 mb-md-5">
                <template v-if="isAsideEnabled">Invite Friends to Plenty Lane</template>
                <template v-else-if="activeItem && activeItem.innerTitle">{{activeItem.innerTitle}}</template>
            </div>

            <div class="invite-wrapper">
                <div class="invite invite-aside" v-bind:class="{ 'aside_enabled': isAsideEnabled }">
                    <div class="invite-box" v-for="item in items" v-bind:key="item.type" @click="onClickItemHandler(item)">
                        <div class="invite-box-info">
                            <div class="invite-icon mr-2 mr-md-3">
                                <SvgIcon :icon="item.svgIcon"></SvgIcon>
                            </div>
                            <div class="invite-name">{{item.title}}</div>
                        </div>
                        <div class="invite-icon-forward">
                            <SvgIcon icon="openArrowRight"></SvgIcon>
                        </div>
                    </div>
                </div>
                <div class="invite-content" v-bind:class="{ 'aside_enabled': isAsideEnabled }">
                    <loading
                            :active.sync="isLoadingContent"
                            :is-full-page="loaderOptions.IS_FULL_PAGE"
                            :color="loaderOptions.COLOR"
                            :background-color="loaderOptions.BACKGROUND_COLOR"
                    ></loading>
                    <div class="invite-back-button" @click="showItemsAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                        <span class="invite-back-button-text">Back</span>
                    </div>
                    <div class="invite-content-container" v-if="isContentLoaded && activeItem">
                        <template v-if="activeItem.type === 'email'">
                            <!-- TODO: insert content -->
                            <p class="text-center">Content goes here...</p>
                        </template>
                        <template v-else-if="activeItem.type === 'message'">
                            <!-- TODO: insert content -->
                            <p class="text-center">Content goes here...</p>
                        </template>
                        <template v-else-if="activeItem.type === 'google'">
                            <b-form class="form searchFormBig smallHeight" @submit.prevent>
                                <b-form-group class="search-modal-input position-relative">
                                    <b-form-input
                                            v-model="searchGoogleFriendStr"
                                            placeholder="Search friends"
                                            autocomplete="off"
                                            @update="triggerFilterGoogleFriends"
                                    ></b-form-input>
                                    <div
                                            class="clear-icon-wrapper cursor-pointer"
                                            v-if="searchGoogleFriendStr && searchGoogleFriendStr.length"
                                            @click="clearSearchGoogleFriendStr"
                                    >
                                        <SvgIcon icon="close"></SvgIcon>
                                    </div>
                                </b-form-group>
                            </b-form>

                            <div class="connection modal-scroll" v-if="googleFriendsFiltered && googleFriendsFiltered.length">
                                <div
                                        class="connection-box has-action-button"
                                        v-for="item in googleFriendsFiltered"
                                        v-bind:key="item.id"
                                >
                                    <div class="connection-box-info">
                                        <div class="connection-box-info-img-placeholder mr-2 mr-xl-3">
                                            <i class="fas fa-user-circle user-icon"></i>
                                        </div>
                                        <!-- TODO: display real image if exists -->
                                        <!--<div class="connection-box-info-img mr-2 mr-xl-3">-->
                                        <!--<img src="../../assets/images/data/images/avatars/avatar.jpg" alt="" class="img-fluid">-->
                                        <!--</div>-->
                                        <div class="connection-box-info-name">
                                            <span>{{item.fullName}}</span>
                                        </div>
                                    </div>
                                    <div class="box-btn">
                                        <b-btn
                                                v-if="!item.isInvited"
                                                class="action-button btnGreenTransparent btnSmallSize hover-slide-left"
                                                v-bind:class="{ btnDisabled: item.isPending }"
                                                :disabled="item.isPending"
                                                @click="inviteGoogleFriend(item)"
                                        >
                                            <span class="pending" v-if="item.isPending">Pending</span>
                                            <span v-else>+ Invite</span>
                                        </b-btn>
                                        <b-btn
                                                v-else
                                                class="action-button no-action btnGreenTransparent btnSmallSize"
                                                disabled
                                        >
                                            <span>Invited!</span>
                                        </b-btn>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p>No users found.</p>
                            </div>
                        </template>
                        <template v-else-if="activeItem.type === 'facebook'">
                            <b-form class="form searchFormBig smallHeight" @submit.prevent>
                                <b-form-group class="search-modal-input position-relative">
                                    <b-form-input
                                            v-model="searchFbFriendStr"
                                            placeholder="Search friends"
                                            autocomplete="off"
                                            @update="triggerFilterFbFriends"
                                    ></b-form-input>
                                    <div
                                            class="clear-icon-wrapper cursor-pointer"
                                            v-if="searchFbFriendStr && searchFbFriendStr.length"
                                            @click="clearSearchFbFriendStr"
                                    >
                                        <SvgIcon icon="close"></SvgIcon>
                                    </div>
                                </b-form-group>
                            </b-form>

                            <div class="connection modal-scroll" v-if="facebookFriendsFiltered && facebookFriendsFiltered.length">
                                <div
                                        class="connection-box has-action-button"
                                        v-for="item in facebookFriendsFiltered"
                                        v-bind:key="item.id"
                                >
                                    <div class="connection-box-info">
                                        <div class="connection-box-info-img-placeholder mr-2 mr-xl-3">
                                            <i class="fas fa-user-circle user-icon"></i>
                                        </div>
                                        <!-- TODO: display real image if exists -->
                                        <!--<div class="connection-box-info-img mr-2 mr-xl-3">-->
                                        <!--<img src="../../assets/images/data/images/avatars/avatar.jpg" alt="" class="img-fluid">-->
                                        <!--</div>-->
                                        <div class="connection-box-info-name">
                                            <span>{{item.fullName}}</span>
                                        </div>
                                    </div>
                                    <div class="box-btn">
                                        <b-btn
                                                v-if="!item.isInvited"
                                                class="action-button btnGreenTransparent btnSmallSize hover-slide-left"
                                                v-bind:class="{ btnDisabled: item.isPending }"
                                                :disabled="item.isPending"
                                                @click="inviteFbFriend(item)"
                                        >
                                            <span class="pending" v-if="item.isPending">Pending</span>
                                            <span v-else>+ Invite</span>
                                        </b-btn>
                                        <b-btn
                                                v-else
                                                class="action-button no-action btnGreenTransparent btnSmallSize"
                                                disabled
                                        >
                                            <span>Invited!</span>
                                        </b-btn>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p>No users found.</p>
                            </div>
                        </template>
                        <template v-else-if="activeItem.type === 'copy_link'">
                            <b-form class="form" @submit.prevent>
                                <b-input-group class="copy-link-input-group">
                                    <b-form-input v-model="linkToCopy" disabled></b-form-input>

                                    <template #append>
                                        <b-btn
                                                v-clipboard:copy="linkToCopy"
                                                v-clipboard:success="onCopySuccessHandler"
                                                v-bind:class="{ copied: isLinkCopied }"
                                        >
                                            <template v-if="!isLinkCopied">Copy</template>
                                            <template v-else>Copied!</template>
                                        </b-btn>
                                    </template>
                                </b-input-group>
                            </b-form>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div slot="modal-title"></div>
        <div slot="modal-header-close">
            <div class="modal-popup-title-icon">
                <SvgIcon icon="closeModalIcon"></SvgIcon>
            </div>
        </div>
    </b-modal>
</template>

<script>
import SvgIcon from '../SvgIcon';
import Loading from 'vue-loading-overlay';
import config from "../../config";
export default {
    name: "InviteFriendsModal",
    components: {SvgIcon, Loading},
    data: () => ({
        items: [
            {
                type: 'email',
                title: 'Email',
                svgIcon: 'email',
                innerTitle: 'Invite Friends by an Email'
            },
            {
                type: 'message',
                title: 'Message',
                svgIcon: 'messageBig',
                innerTitle: 'Invite Friends by a Message'
            },
            {
                type: 'google',
                title: 'Google',
                svgIcon: 'google',
                innerTitle: 'Invite Google Friends'
            },
            {
                type: 'facebook',
                title: 'Facebook',
                svgIcon: 'facebook',
                innerTitle: 'Invite Facebook Friends'
            },
            {
                type: 'copy_link',
                title: 'Copy Link',
                svgIcon: 'chain',
                innerTitle: 'Invite Friends by a Link'
            }
        ],
        loaderOptions: { ...config.LOADER_OPTIONS },
        activeItem: null,
        isAsideEnabled: true,
        isLoadingContent: false,
        isContentLoaded: false,
        linkToCopy: location.origin, // TODO: check the link later
        isLinkCopied: false,
        facebookFriends: [],
        facebookFriendsFiltered: [],
        searchFbFriendStr: '',
        tempFriendsList: [
            { id: 1, fullName: 'Jane Doe', isInvited: false, isPending: false },
            { id: 2, fullName: 'Eric Doe', isInvited: false, isPending: false },
            { id: 3, fullName: 'Ben Doe', isInvited: false, isPending: false },
            { id: 4, fullName: 'Tomas Doe', isInvited: false, isPending: false },
            { id: 5, fullName: 'Michael Doe', isInvited: false, isPending: false }
        ],
        googleFriends: [],
        googleFriendsFiltered: [],
        searchGoogleFriendStr: ''
    }),
    methods: {
        onClickItemHandler (item) {
            if (!item || !item.type) return;
            this.activeItem = Object.assign({}, { ...item });
            this.isAsideEnabled = false;

            switch (item.type) {
                case 'email':
                    this.inviteByEmail();
                    break;
                case 'message':
                    this.inviteByMessage();
                    break;
                case 'google':
                    this.inviteByGoogle();
                    break;
                case 'facebook':
                    this.inviteByFacebook();
                    break;
                case 'copy_link':
                    this.inviteByCopyLink();
                    break;
                default:
                    break;
            }
        },
        showItemsAside () {
            this.isAsideEnabled = true;
            this.isLoadingContent = false;
            this.isContentLoaded = false;
            this.activeItem = null;
        },
        inviteByEmail () {
            // TODO
            this.isContentLoaded = true;
        },
        inviteByMessage () {
            // TODO
            this.isContentLoaded = true;
        },
        inviteByGoogle () {
            // TODO: it's temp version
            this.isLoadingContent = true;
            this.isContentLoaded = false;
            this.searchGoogleFriendStr = '';
            this.googleFriends = [];
            setTimeout(() => {
                this.tempFriendsList.forEach(user => {
                    this.googleFriends.push({ ...user });
                });
                this.googleFriendsFiltered = this.googleFriends.slice(0);
                this.isLoadingContent = false;
                this.isContentLoaded = true;
            }, 500);
        },
        inviteByFacebook () {
            // TODO: it's temp version
            this.isLoadingContent = true;
            this.isContentLoaded = false;
            this.searchFbFriendStr = '';
            this.facebookFriends = [];
            setTimeout(() => {
                this.tempFriendsList.forEach(user => {
                    this.facebookFriends.push({ ...user });
                });
                this.facebookFriendsFiltered = this.facebookFriends.slice(0);
                this.isLoadingContent = false;
                this.isContentLoaded = true;
            }, 500);
        },
        inviteByCopyLink () {
            // TODO
            this.isContentLoaded = true;
        },
        onHidden () {
            // reset values
            this.isAsideEnabled = true;
            this.activeItem = null;
            this.isLoadingContent = false;
            this.isContentLoaded = false;
            this.isLinkCopied = false;
            this.facebookFriends = [];
            this.facebookFriendsFiltered = [];
            this.searchFbFriendStr = '';
            this.googleFriends = [];
            this.googleFriendsFiltered = [];
            this.searchGoogleFriendStr = '';
        },
        onCopySuccessHandler () {
            if (this.isLinkCopied) return;
            this.isLinkCopied = true;
            setTimeout(() => {
                this.isLinkCopied = false;
            }, 3000);
        },
        triggerFilterGoogleFriends () {
            this.filterGoogleFriends();
        },
        clearSearchGoogleFriendStr () {
            this.searchGoogleFriendStr = '';
            this.triggerFilterGoogleFriends();
        },
        filterGoogleFriends () {
            if (!this.searchGoogleFriendStr || !this.searchGoogleFriendStr.length) {
                if (!this.googleFriends || !this.googleFriends.length) {
                    this.googleFriendsFiltered = [];
                    return;
                }
                this.googleFriendsFiltered = this.googleFriends.slice(0);
                return;
            }
            this.googleFriendsFiltered = this.googleFriends.filter(item => {
                return item.fullName.toLowerCase().includes(this.searchGoogleFriendStr);
            });
        },
        triggerFilterFbFriends () {
            this.filterFbFriends();
        },
        clearSearchFbFriendStr () {
            this.searchFbFriendStr = '';
            this.triggerFilterFbFriends();
        },
        filterFbFriends () {
            if (!this.searchFbFriendStr || !this.searchFbFriendStr.length) {
                if (!this.facebookFriends || !this.facebookFriends.length) {
                    this.facebookFriendsFiltered = [];
                    return;
                }
                this.facebookFriendsFiltered = this.facebookFriends.slice(0);
                return;
            }
            this.facebookFriendsFiltered = this.facebookFriends.filter(item => {
                return item.fullName.toLowerCase().includes(this.searchFbFriendStr);
            });
        },
        inviteFbFriend (item) {
            if (item.isPending) return;
            item.isPending = true;
            // temp
            setTimeout(() => {
                item.isInvited = true;
                item.isPending = false;

                setTimeout(() => {
                    this.facebookFriends = this.facebookFriends.filter(user => user.id !== item.id);
                    this.facebookFriendsFiltered = this.facebookFriends.slice(0);
                }, 1500);
            }, 1000);
        },
        inviteGoogleFriend (item) {
            if (item.isPending) return;
            item.isPending = true;
            // temp
            setTimeout(() => {
                item.isInvited = true;
                item.isPending = false;

                setTimeout(() => {
                    this.googleFriends = this.googleFriends.filter(user => user.id !== item.id);
                    this.googleFriendsFiltered = this.googleFriends.slice(0);
                }, 1500);
            }, 1000);
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.invite-wrapper {
    position: relative;
    width: 100%;
    min-height: 310px;

    @media screen and (max-width: $phoneBigWidth) {
        min-height: 232px;
    }

    .invite {
        position: relative;
        transition: all 0.3s ease;

        &.aside_enabled {
            opacity: 1;
            display: block;
        }
        &:not(.aside_enabled) {
            opacity: 0;
            display: none;
        }

        .invite-box {
            cursor: pointer;
            border-bottom: 2px solid #EEE8D7;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 17px;
            @media screen and (max-width: $phoneBigWidth) {
                padding: 10px;
            }
            .invite-box-info {
                display: flex;
                flex-direction: row;
                align-items: center;
                .invite-icon {
                    flex: none;
                }
                .invite-name {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    font-family: $FilsonProBold;
                    font-size: 24px;
                    line-height: 24px;
                    color: $textBlackColor;
                    padding-top: 2px;
                    -webkit-transition: all 0.3s ease;
                    -moz-transition: all 0.3s ease;
                    -ms-transition: all 0.3s ease;
                    -o-transition: all 0.3s ease;
                    transition: all 0.3s ease;
                    &:hover {
                        color: $greenColor;
                        -webkit-transition: .3s all ease;
                        -o-transition: .3s all ease;
                        transition: .3s all ease;
                    }
                    @media screen and (max-width: $tableWidth) {
                        font-size: 22px;
                        line-height: 22px;
                    }
                    @media screen and (max-width: $phoneBigWidth) {
                        font-size: 16px;
                        line-height: 20px;
                        letter-spacing: 0.8px;
                    }
                }
            }
        }
    }
    .invite-content {
        &.aside_enabled {
            display: none;
        }
        &:not(.aside_enabled) {
            display: block;
        }
        .invite-back-button {
            color: $greenColor;
            cursor: pointer;
            width: 100px;
            -webkit-transition: all 0.3s ease;
            -moz-transition: all 0.3s ease;
            -ms-transition: all 0.3s ease;
            -o-transition: all 0.3s ease;
            transition: all 0.3s ease;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            .invite-back-button-text {
                margin-left: 5px;
                font-family: $FilsonProBold;
            }

            &:hover {
                color: $greenLightColor;
            }
        }
        .invite-content-container {
            width: 100%;
            margin-top: 25px;
            margin-bottom: 25px;
            height: 100%;

            .form {
                .copy-link-input-group {
                    .form-control {
                        border-radius: 0;
                        height: 48px;
                        outline: none !important;
                        border-color: #ced4da !important;
                        background-color: #fffdf8 !important;
                        padding-left: 25px;
                        padding-right: 25px;
                        &:focus, &:active {
                            border-color: #ced4da !important;
                        }
                        @media screen and (max-width: $phoneBigWidth) {
                            padding-left: 15px;
                            padding-right: 15px;
                        }
                    }
                    .input-group-append {
                        height: 48px;
                        width: 90px;
                        .btn {
                            width: 100%;
                            background-color: $greenColor;
                            border-color: $greenColor;
                            border-radius: 0;
                            -webkit-transition: all 0.3s ease;
                            -moz-transition: all 0.3s ease;
                            -ms-transition: all 0.3s ease;
                            -o-transition: all 0.3s ease;
                            transition: all 0.3s ease;

                            &.copied {
                                background-color: $greenLightColor;
                                border-color: $greenLightColor;
                            }
                        }
                    }
                }
                .search-modal-input {
                    margin-bottom: 20px;
                }
                .clear-icon-wrapper {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                }
            }
        }
    }
}
</style>
