<template>
    <b-modal
            id="invite-friends-modal"
            ref="inviteFriendsModal"
            hide-footer
            size="lg"
            modal-class="invite-friends-modal"
            centered
            :return-focus="{}"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 mb-md-5 text-center">Invite Friends to Plenty Lane</div>
            <div class="invite">
                <div class="invite-box" @click="inviteByEmail()">
                    <div class="invite-box-info">
                        <div class="invite-icon mr-2 mr-md-3">
                            <SvgIcon icon="email"></SvgIcon>
                        </div>
                        <div class="invite-name">Email</div>
                    </div>
                    <div class="invite-icon-forward">
                        <SvgIcon icon="openArrowRight"></SvgIcon>
                    </div>
                </div>
                <div class="invite-box" @click="inviteByMessage()">
                    <div class="invite-box-info">
                        <div class="invite-icon mr-2 mr-md-3">
                            <SvgIcon icon="messageBig"></SvgIcon>
                        </div>
                        <div class="invite-name">Message</div>
                    </div>
                    <div class="invite-icon-forward">
                        <SvgIcon icon="openArrowRight"></SvgIcon>
                    </div>
                </div>
                <div class="invite-box" @click="inviteByGoogle()">
                    <div class="invite-box-info">
                        <div class="invite-icon mr-2 mr-md-3">
                            <SvgIcon icon="google"></SvgIcon>
                        </div>
                        <div class="invite-name">Google</div>
                    </div>
                    <div class="invite-icon-forward">
                        <SvgIcon icon="openArrowRight"></SvgIcon>
                    </div>
                </div>
                <div class="invite-box fb-box" @click="inviteByFacebook()">
                    <div class="invite-box-info">
                        <div class="invite-icon mr-2 mr-md-3">
                            <SvgIcon icon="facebook"></SvgIcon>
                        </div>
                        <div class="invite-name">Facebook</div>
                    </div>
                    <div class="invite-icon-forward">
                        <SvgIcon icon="openArrowRight"></SvgIcon>
                    </div>
                </div>
                <div class="invite-box" @click="copyLink()">
                    <div class="invite-box-info mr-2 mr-md-3">
                        <div class="invite-icon mr-2 mr-md-3">
                            <SvgIcon icon="chain"></SvgIcon>
                        </div>
                        <div class="invite-name">Copy Link</div>
                    </div>
                    <div class="invite-icon-forward">
                        <SvgIcon icon="openArrowRight"></SvgIcon>
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
export default {
    name: "InviteFriendsModal",
    components: {SvgIcon},
    methods: {
        inviteByEmail () {
            // TODO
        },
        inviteByMessage () {
            // TODO
        },
        inviteByGoogle () {
            // TODO
        },
        inviteByFacebook () {
            // TODO
        },
        copyLink () {
            // TODO
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.invite {
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
                -webkit-transition: .3s all ease;
                -o-transition: .3s all ease;
                transition: .3s all ease;
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
</style>
