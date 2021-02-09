<template>
    <div v-if="isLoaded && items && items.length">
        <div class="notification-box" v-for="item in items">
            <div class="notification-box-info">
                <div class="notification-img mr-2 mr-md-3">
                    <SvgIcon :icon="item.iconName"></SvgIcon>
                </div>
                <div class="notification-text">{{item.content}}</div>
            </div>
            <div class="notification-btn">
                <div class="notification-box-respond" @click="reply(item)">
                    <div class="cursor-pointer" v-if="item.shouldReply">
                        <SvgIcon icon="reply"></SvgIcon>
                    </div>
                </div>
                <div class="notification-box-close">
                    <div class="cursor-pointer" @click="removeNotification(item)">
                        <SvgIcon icon="notificationClose"></SvgIcon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from './SvgIcon';
import api from '../api';
export default {
    name: "NotificationsContent",
    components: {SvgIcon},
    props: ['tempVisibleItems'],
    data: () => ({
        items: [],
        isLoading: false,
        isLoaded: false
    }),
    methods: {
        removeNotification (item) {
            // TODO
            if (!item || !item.id) return;
            this.items = this.items.filter(i => Number(i.id) !== Number(item.id));
        },
        reply (item) {
            // TODO
        },
        loadNotifications () {
            this.isLoading = true;
            api.dashboard.notifications.getTempNotifications(this.tempVisibleItems)
                .then(result => {
                    this.items = result.slice(0);
                    this.isLoading = false;
                    this.isLoaded = true;
                })
                .catch(err => {
                    this.isLoading = false;
                    this.isLoaded = true;
                });
        }
    },
    created () {
        this.loadNotifications();
    }
}
</script>

<style lang="scss">
@import "../scss/utils/vars";
.notification {
    .notification-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        .notification-box-info {
            display: flex;
            align-items: center;
            .notification-img {
                flex: none;
            }
            .notification-text {
                padding-right: 50px;
                @media screen and (max-width: $smPhoneWidth) {
                    padding-right: 0;
                }
            }
        }
        .notification-btn {
            margin-left: 16px;
            display: flex;
            align-items: center;
            .notification-box-respond {
                margin-right: 16px;
            }
            svg:hover path {
                fill: $greenColor;
            }
        }
    }
}
</style>
