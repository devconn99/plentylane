<template>
  <b-modal
    :id="id"
    ref="messageModal"
    size="lg"
    modal-class="confirm-modal modal-with-buttons"
    no-close-on-esc
    no-close-on-backdrop
    centered
    :return-focus="{}"
    @ok="onConfirmed"
  >
    <div slot="default">
      <div class="title-size3 titleGreenNavyColor mb-4 text-center">
        <template v-if="message && message.length">{{ message }}</template>
        <template v-else>{{ defaultMessage }}</template>
      </div>
    </div>
    <div slot="modal-title"></div>
    <div slot="modal-header-close">
      <div class="modal-popup-title-icon" @click="$emit('confirmed')">
        <SvgIcon icon="closeModalIcon"></SvgIcon>
      </div>
    </div>
    <template #modal-footer="{ ok }">
      <b-btn class="btnGreen btnNormalSize text-uppercase hover-slide-left" @click="ok()">
        <span v-if="confirmBtnText && confirmBtnText.length">{{ confirmBtnText }}</span>
        <span v-else>Ok</span>
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
import SvgIcon from '../SvgIcon';
export default {
  name: "MessageModal",
  components: { SvgIcon },
  props: ['id','message','confirmBtnText'],
  data: () => ({
    defaultMessage: 'Are you sure you want to confirm this action?'
  }),
  methods: {
    onConfirmed() {
      this.$emit('confirmed');
    }
  }
}
</script>

<style scoped>
</style>
