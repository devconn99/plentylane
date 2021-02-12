<template>
    <b-modal
            :id="id"
            ref="confirmModal"
            size="lg"
            modal-class="confirm-modal"
            no-close-on-esc
            no-close-on-backdrop
            centered
            :return-focus="{}"
            @ok="onConfirmed"
            @cancel="onCanceled"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 text-center">
                <template v-if="message && message.length">{{message}}</template>
                <template v-else>{{defaultMessage}}</template>
            </div>
        </div>
        <div slot="modal-title"></div>
        <div slot="modal-header-close">
            <div class="modal-popup-title-icon" @click="$emit('canceled')">
                <SvgIcon icon="closeModalIcon"></SvgIcon>
            </div>
        </div>
        <template #modal-footer="{ ok, cancel, hide }">
            <b-btn class="btnGreenTransparent btnNormalSize text-uppercase hover-slide-left" @click="cancel()">
                <span v-if="cancelBtnText && cancelBtnText.length">{{cancelBtnText}}</span>
                <span v-else>No</span>
            </b-btn>
            <b-btn class="btnGreen btnNormalSize text-uppercase hover-slide-left" @click="ok()">
                <span v-if="confirmBtnText && confirmBtnText.length">{{confirmBtnText}}</span>
                <span v-else>Yes</span>
            </b-btn>
        </template>
    </b-modal>
</template>

<script>
import SvgIcon from '../SvgIcon';
export default {
    name: "ConfirmModal",
    components: {SvgIcon},
    props: ['id', 'message', 'cancelBtnText', 'confirmBtnText'],
    data: () => ({
        defaultMessage: 'Are you sure you want to confirm this action?'
    }),
    methods: {
        onConfirmed () {
            this.$emit('confirmed');
        },
        onCanceled () {
            this.$emit('canceled');
        }
    }
}
</script>

<style scoped>

</style>
