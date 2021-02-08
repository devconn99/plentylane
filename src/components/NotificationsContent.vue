<template>
    <div>
        <div class="notification-box" v-for="item in items.slice(0, tempVisibleItems || items.length)">
            <div class="notification-box-info">
                <div class="notification-img">
                    <SvgIcon :icon="item.iconName"></SvgIcon>
                </div>
                <div class="notification-text">{{item.content}}</div>
            </div>
            <!-- TODO: check this block later, reply button now is not visible (missing styles?) -->
            <div class="notification-btn">
                <div class="notification-box-respond"></div>
                <div class="notification-box-close">
                    <a>
                        <svg width="17px" height="17px" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 17 17">
                            <g fill="none" fill-rule="evenodd">
                                <g fill="#FCDBD0" fill-rule="nonzero">
                                    <path
                                            d="M12.512 2.31L8.499 6.32 4.487 2.31a1.75 1.75 0 00-2.474 0l-.114.124a1.75 1.75 0 00.113 2.35l4.012 4.013-4.012 4.013a1.75 1.75 0 00.786 2.927l.151.034a1.75 1.75 0 001.539-.487l4.011-4.013 4.013 4.013a1.75 1.75 0 002.475 0l.113-.124a1.75 1.75 0 00-.113-2.35l-4.012-4.013 4.013-4.012a1.75 1.75 0 10-2.476-2.475z" />
                                </g>
                            </g>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from './SvgIcon';
export default {
    name: "NotificationsContent",
    components: {SvgIcon},
    props: ['tempVisibleItems'],
    data: () => ({
        items: [
            {
                iconName: 'notificationType1',
                content: 'Amy G. has reserved your meal: Baby Back Ribs!'
            },
            {
                iconName: 'notificationType2',
                content: 'Get your food handler certification'
            },
            {
                iconName: 'notificationType3',
                content: 'New meal from Winifred P.'
            },
            {
                iconName: 'notificationType1',
                content: 'Amy G. has reserved your meal: Baby Back Ribs!'
            },
            {
                iconName: 'notificationType2',
                content: 'Get your food handler certification'
            },
            {
                iconName: 'notificationType3',
                content: 'New meal from Winifred P.'
            },
            {
                iconName: 'notificationType1',
                content: 'Amy G. has reserved your meal: Baby Back Ribs!'
            },
            {
                iconName: 'notificationType2',
                content: 'Get your food handler certification'
            },
            {
                iconName: 'notificationType3',
                content: 'New meal from Winifred P.'
            }
        ]
    })
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
