<template>
    <b-modal
            id="notifications-modal"
            ref="notificationsModal"
            hide-footer
            size="lg"
            modal-class="notifications-modal"
            centered
            :return-focus="{}"
            @show="onShow"
            @hidden="onHidden"
    >
        <div slot="default">
            <template v-if="!shouldShowMessages">
                <div class="title-size3 titleGreenNavyColor mb-4 mb-md-5 text-center">Notifications</div>
            </template>
            <template v-else>
                <div class="title-size3 titleGreenNavyColor mb-4 text-center">{{messagesTitle}}</div>
            </template>
            <div class="notification-wrapper">
                <div class="notification modal-scroll notification-aside" v-bind:class="{ 'messages_shown': shouldShowMessages }">
                    <NotificationsContent @on-show-messages="onShowMessages"></NotificationsContent>
                </div>
                <div class="messages-content" v-if="shouldShowMessages" v-bind:class="{ 'messages_shown': shouldShowMessages }">
                    <loading
                            :active.sync="isLoadingMessages"
                            :is-full-page="loaderOptions.IS_FULL_PAGE"
                            :color="loaderOptions.COLOR"
                            :background-color="loaderOptions.BACKGROUND_COLOR"
                    ></loading>
                    <div class="back-button" @click="showItemsAside">
                        <SvgIcon icon="arrowLeft"></SvgIcon>
                        <span class="back-button-text">Back</span>
                    </div>
                    <MessagesContent
                            :id-from="msgIdFrom"
                            :id-to="msgIdTo"
                            @on-loaded="onMessagesLoaded"
                            @on-redirect-to-offer="onRedirectToOffer"
                    ></MessagesContent>
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
import NotificationsContent from '../NotificationsContent';
import SvgIcon from '../SvgIcon';
import MessagesContent from '../MessagesContent';
import Loading from 'vue-loading-overlay';
import config from "../../config";
export default {
    name: "NotificationsModal",
    components: {NotificationsContent, SvgIcon, MessagesContent, Loading},
    data: () => ({
        shouldShowMessages: false,
        loaderOptions: { ...config.LOADER_OPTIONS },
        isLoadingMessages: false,
        msgIdFrom: '',
        msgIdTo: '',
        messagesTitle: '',
        currentUserId: ''
    }),
    methods: {
        onShowMessages (userInfo) {
            // TODO
            this.msgIdFrom = userInfo.id;
            this.msgIdTo = this.currentUserId;
            this.messagesTitle = `Message ${userInfo.firstName} ${userInfo.lastName.slice(0, 1)}.`;
            this.shouldShowMessages = true;
            this.isLoadingMessages = true;
        },
        showItemsAside () {
            this.shouldShowMessages = false;
            this.msgIdFrom = '';
            this.msgIdTo = '';
        },
        onMessagesLoaded () {
            this.isLoadingMessages = false;
        },
        onRedirectToOffer (offerId) {
            // TODO: close modal, redirect to offer
            this.$bvModal.hide('notifications-modal');
        },
        onHidden () {
            this.isLoadingMessages = false;
            this.shouldShowMessages = false;
            this.msgIdFrom = '';
            this.msgIdTo = '';
            this.messagesTitle = '';
        },
        onShow () {
            this.currentUserId = localStorage.getItem('plUserId') || this.$store.getters.userId || '';
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.notification-wrapper {
    position: relative;
    width: 100%;

    .notification-aside {
        position: relative;
        transition: all 0.3s ease;

        &.messages_shown {
            opacity: 0;
            display: none;
        }
        &:not(.messages_shown) {
            opacity: 1;
            display: block;
        }
    }

    .messages-content {
        min-height: 310px;

        @media screen and (max-width: $phoneBigWidth) {
            min-height: 282px;
        }
        &.messages_shown {
            display: block;
        }
        &:not(.messages_shown) {
            display: none;
        }
        .back-button {
            color: $greenColor;
            cursor: pointer;
            width: 100px;
            position: relative;
            left: 10px;
            -webkit-transition: all 0.3s ease;
            -moz-transition: all 0.3s ease;
            -ms-transition: all 0.3s ease;
            -o-transition: all 0.3s ease;
            transition: all 0.3s ease;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            .back-button-text {
                margin-left: 5px;
                font-family: $FilsonProBold;
            }

            &:hover {
                color: $greenLightColor;
            }
        }
    }
}
</style>
