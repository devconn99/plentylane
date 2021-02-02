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
                <SvgIcon icon="closeModalIcon"></SvgIcon>
            </div>
        </div>
    </b-modal>
</template>

<script>
import SvgIcon from '../SvgIcon';
export default {
    name: "InviteFriendsModal",
    components: {SvgIcon}
}
</script>

<style scoped>

</style>
