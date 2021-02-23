<template>
    <b-modal
            id="messages-modal"
            ref="messagesModal"
            hide-footer
            size="lg"
            modal-class="messages-modal"
            centered
            :return-focus="{}"
            @show="onShow"
            @hidden="onHidden"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 mb-md-5 text-center">Message {{userName}}</div>
            <div class="messages-wrapper">
                <loading
                        :active.sync="isLoadingMessages"
                        :is-full-page="loaderOptions.IS_FULL_PAGE"
                        :color="loaderOptions.COLOR"
                        :background-color="loaderOptions.BACKGROUND_COLOR"
                ></loading>
                <MessagesContent
                        :id-from="msgIdFrom"
                        :id-to="msgIdTo"
                        @on-loaded="onMessagesLoaded"
                        @on-redirect-to-offer="onRedirectToOffer"
                ></MessagesContent>
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
import MessagesContent from '../MessagesContent';
import SvgIcon from '../SvgIcon';
import Loading from 'vue-loading-overlay';
import config from "../../config";
export default {
    name: "MessagesModal",
    components: {MessagesContent, SvgIcon, Loading},
    props: ['userName'],
    data: () => ({
        msgIdFrom: '',
        msgIdTo: '',
        isLoadingMessages: false,
        loaderOptions: { ...config.LOADER_OPTIONS },
        currentUserId: '' // TODO: use it as msgIdFrom or msgIdTo later
    }),
    methods: {
        onHidden () {
            this.msgIdFrom = '';
            this.msgIdTo = '';
            this.isLoadingMessages = false;
            this.currentUserId = '';
            this.$emit('on-hidden');
        },
        onShow () {
            this.currentUserId = localStorage.getItem('plUserId') || this.$store.getters.userId || '';
            this.isLoadingMessages = true;
        },
        onMessagesLoaded () {
            this.isLoadingMessages = false;
        },
        onRedirectToOffer (offerId) {
            // TODO: close the modal, redirect to the offer
            this.$bvModal.hide('messages-modal');
        }
    }
}
</script>

<style scoped>

</style>
