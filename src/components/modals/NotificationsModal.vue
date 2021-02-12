<template>
    <b-modal
            id="notifications-modal"
            ref="notificationsModal"
            hide-footer
            size="lg"
            modal-class="notifications-modal"
            centered
            :return-focus="{}"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 mb-md-5 text-center">Notifications</div>
            <div class="notification modal-scroll">
                <NotificationsContent></NotificationsContent>
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
export default {
    name: "NotificationsModal",
    components: {NotificationsContent, SvgIcon}
}
</script>

<style scoped>

</style>
