<template>
  <b-modal
    id="invite-friends-via-copy-link-modal"
    ref="inviteFriendsViaCopyLinkModal"
    hide-footer
    size="lg"
    modal-class="invite-friends-via-copy-link-modal"
    centered
    @hidden="onHidden"
    @shown="onShown"
    :return-focus="{}"
  >
    <div slot="default">
      <div class="title-size3 titleGreenNavyColor text-center mb-4 mb-md-5">Invite Friends to Plenty Lane</div>

      <div class="invite-via-copy-link-content-container">
        <b-form class="form" @submit.prevent>
          <b-input-group class="copy-link-input-group">
            <b-form-input v-model="invitationLink" disabled></b-form-input>
            <template #append>
              <b-btn
                v-clipboard:copy="invitationLink"
                v-clipboard:success="onCopySuccessHandler"
                v-bind:class="{ copied: isLinkCopied }"
              >
                <template v-if="!isLinkCopied">Copy</template>
                <template v-else>Copied!</template>
              </b-btn>
            </template>
          </b-input-group>
          <b-form class="form mt-2 " @submit.stop.prevent="onSubmit">
            <b-input-group class="copy-link-input-group">
              <template #default>
                <b-form-input
                  v-model="$v.form.email.$model"
                  type="email"
                  placeholder="Email Address"
                  autocomplete="off"
                />
              </template>
              <template #append>
                <b-button type="submit" :disabled="$v.$invalid">
                  Send
                </b-button>
              </template>
            </b-input-group>
            <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.email.email">Please enter valid email address.</small>
          </b-form>
          
        </b-form>
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
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  name: "InviteFriendsViaCopyLinkModal",
  mixins:[validationMixin],
  components: {SvgIcon},
  props:['invitationLink'],
  data: () => ({
    isLinkCopied: false,
    closeTimeout: null,
    form: {
      email: "",
    }
  }),
  validations: {
    form: {
      email: {
        email
      }
    }
  },
  methods: {
    onHidden () {
      this.isLinkCopied = false;
    },
    onShown () {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
    },
    onCopySuccessHandler () {
      if (this.isLinkCopied) return;
      this.isLinkCopied = true;
      this.closeTimeout = setTimeout(() => {
        this.isLinkCopied = false;
      }, 3000);
    },
    onSubmit () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) return;
      const str = this.invitationLink;
      const invitationId=str?str.split("code=")[1].split("&full-name")[0] : "";
    
      const invitationData = {
        invitationId,
        email: this.$v.form.$model.email
      };
      this.$emit("onSendInvitation", invitationData);
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.invite-via-copy-link-content-container {
  width: 100%;
  margin-top: 25px;
  margin-bottom: 25px;
  height: 100%;
  min-height: 80px;

  .form {
    .copy-link-input-group {
      .form-control {
        border-radius: 0;
        height: 48px;
        outline: none !important;
        border-color: #ced4da !important;
        background-color: #fffdf8 !important;
        padding-left: 25px;
        padding-right: 25px;
        &:focus, &:active {
          border-color: #ced4da !important;
        }
        @media screen and (max-width: $phoneBigWidth) {
          padding-left: 15px;
          padding-right: 15px;
        }
      }
      .input-group-append {
        height: 48px;
        width: 90px;
        .btn {
          width: 100%;
          background-color: $greenColor;
          border-color: $greenColor;
          border-radius: 0;
          -webkit-transition: all 0.3s ease;
          -moz-transition: all 0.3s ease;
          -ms-transition: all 0.3s ease;
          -o-transition: all 0.3s ease;
          transition: all 0.3s ease;

          &.copied {
            background-color: $greenLightColor;
            border-color: $greenLightColor;
          }
        }
      }
    }
  }
}
</style>
