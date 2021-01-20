<template>
    <b-modal id="invite-friends-modal" ref="inviteFriendsModal" hide-footer size="lg" modal-class="invite-friends-modal">
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 mb-md-5 text-center">Invite Friends to Plenty Lane</div>
            <div class="invite">
                <!-- TODO: temp -->
                <a class="invite-box">
                    <div class="invite-box-info">
                        <div class="invite-icon mr-2 mr-md-3">
                            icon
                        </div>
                        <div class="invite-name">
                            Email
                        </div>
                    </div>
                    <div class="invite-icon-forward">
                        >
                    </div>
                </a>
                <a class="invite-box">
                    <div class="invite-box-info">
                        <div class="invite-icon mr-2 mr-md-3">
                            icon
                        </div>
                        <div class="invite-name">
                            Message
                        </div>
                    </div>
                    <div class="invite-icon-forward">
                    </div>
                </a>
                <a class="invite-box">
                    <div class="invite-box-info">
                        <div class="invite-icon mr-2 mr-md-3">
                            icon
                        </div>
                        <div class="invite-name">
                            Google
                        </div>
                    </div>
                    <div class="invite-icon-forward">
                    </div>
                </a>
                <a class="invite-box">
                    <div class="invite-box-info">
                        <div class="invite-icon mr-2 mr-md-3">
                            icon
                        </div>
                        <div class="invite-name">
                            Facebook
                        </div>
                    </div>
                    <div class="invite-icon-forward">
                    </div>
                </a>
                <a class="invite-box">
                    <div class="invite-box-info mr-2 mr-md-3">
                        <div class="invite-icon mr-2 mr-md-3">
                            icon
                        </div>
                        <div class="invite-name">
                            Copy Link
                        </div>
                    </div>
                    <div class="invite-icon-forward">
                    </div>
                </a>
            </div>
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
export default {
    name: "InviteFriendsModal"
}
</script>

<style scoped>

</style>
