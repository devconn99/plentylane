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
      <div class="title-size3 titleGreenNavyColor text-center mb-4 mb-md-5">
        Invite Friends to Plenty Lane
      </div>

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
          <label class="mt-2">Enter email address then press Space/Enter key.</label>
          <span class="fg-main d-flex">
            <span class="fg-container">
              <b-input-group
                style="direction: ltr"
                class="copy-link-input-group"
              >
                <template #default>
                  <app-chip-input
                    style="border: 0; padding-left: 15px;"
                    @chip-create="emailUpdate"
                    @chip-close="emailUpdate"
                    @keyup.delete="emailUpdate"
                    @keyup.enter="emailUpdate"
                    class="form-control"
                  />
                </template>
              </b-input-group>
            </span>
            <b-button :disabled="!enableSendButton" @click="onSubmit"> Send </b-button>
          </span>
          <small
            v-if="!validateEmails"
            class="text-danger d-flex mt-2 text-left"
          >
            Enter valid emails
          </small>
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
import { ComponentChipInput } from 'chip-input';

export default {
  name: "InviteFriendsViaCopyLinkModal",
  components: { SvgIcon, ComponentChipInput },
  props:['invitationLink'],
  data: () => ({
    isLinkCopied: false,
    closeTimeout: null,
    emailsArray: [],
  }),
  computed:{
    validateEmails() {
      const emails = this.emailsArray;
      const emailPattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
      const inValidEmail = emails.find(email => {
        return emailPattern.test(email.trim()) === false;
      });

      return inValidEmail === undefined;
    },
    enableSendButton() {
      return this.emailsArray.length && this.validateEmails
    }
  },
  methods: {
    onHidden () {
      this.isLinkCopied = false;
      this.resetEmails()
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
      if(this.validateEmails) {
        const str = this.invitationLink;
        const invitationId = str?str.split("code=")[1].split("&full-name")[0] : "";
        const emails=this.emailsArray.map(email => {
          return {
            invitationId,
            email: email
          }
        });
        this.resetEmails();
        this.$emit("onSendInvitation", emails);
      }
    },
    resetEmails(){
      this.emailsArray = []
    },
    emailUpdate(event) {
      const val = event.target.value?.trim();
      const eventType = event.type;
      const valueIndex = this.emailsArray.findIndex(res => res === val);
      if ((eventType == "chip-create" || event.code=="Enter") && val) {
        this.emailsArray.push(val);
      } else if (eventType == "chip-close" || event.code == "Backspace") {
        this.emailsArray.splice(valueIndex, 1);   
      }
    },
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
        padding-left: 20px;
        padding-right: 20px;

        &:focus,
        &:active {
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

.fg-container {
  background: white;
  direction: rtl;
  display: flex;
  overflow-y: auto;
  max-height: 4rem;
  overflow-x: hidden;
  border: #ced4da 1px solid !important ;
  width: 100%;
}
.fg-main {
  .btn {
    width: 6.5rem;
    background-color: $greenColor;
    border-color: $greenColor;
    border-radius: 0;
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }
}
</style>
