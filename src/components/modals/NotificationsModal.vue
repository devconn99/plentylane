<template>
    <b-modal id="notifications-modal" ref="notificationsModal" hide-footer size="lg" modal-class="notifications-modal">
        <!-- TODO: refactor styles, content -->
        <div slot="default">
            <NotificationsContent></NotificationsContent>
        </div>
        <div slot="modal-title"></div>
        <div slot="modal-header-close">
            <div class="modal-popup-title-icon">
                <!-- TODO: use SvgIcon component instead -->
                <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g transform="translate(-960.000000, -227.000000)">
                            <g transform="translate(1.000000, 0.000000)">
                                <g transform="translate(440.000000, 200.000000)">
                                    <g transform="translate(512.000000, 20.000000)">
                                        <g>
                                            <polygon points="0 0 32 0 32 32 0 32"></polygon>
                                            <path
                                                    d="M24.4,7.61333333 C23.88,7.09333333 23.04,7.09333333 22.52,7.61333333 L16,14.12 L9.48,7.6 C8.96,7.08 8.12,7.08 7.6,7.6 C7.08,8.12 7.08,8.96 7.6,9.48 L14.12,16 L7.6,22.52 C7.08,23.04 7.08,23.88 7.6,24.4 C8.12,24.92 8.96,24.92 9.48,24.4 L16,17.88 L22.52,24.4 C23.04,24.92 23.88,24.92 24.4,24.4 C24.92,23.88 24.92,23.04 24.4,22.52 L17.88,16 L24.4,9.48 C24.9066667,8.97333333 24.9066667,8.12 24.4,7.61333333 Z"
                                                    fill="#757F8B"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    </b-modal>
</template>

<script>
import NotificationsContent from '../NotificationsContent';
export default {
    name: "NotificationsModal",
    components: {NotificationsContent}
}
</script>

<style scoped>

</style>