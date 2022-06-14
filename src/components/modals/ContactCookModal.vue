<template>
  <b-modal
    id="contact-cook-modal"
    ref="contactCookModal"
    hide-footer
    size="lg"
    centered
    modal-class="contact-cook-modal"
    @hidden="onHidden"
    @shown="onShown"
    :return-focus="{}"
  >
    <div slot="default">
      <div class="title-size3 mb-4 text-center" v-bind:class="failedSendMessage ? 'text-danger' : 'titleGreenNavyColor'">
        <template v-if="!isContacted && !failedSendMessage">Contact the cook</template>
        <template v-else-if="isContacted && !failedSendMessage">Your message has been sent to the cook.</template>
        <template v-else>Failed to send message to the cook. Please try again later.</template>
      </div>

      <b-form class="form" @submit.stop.prevent="onSubmit" v-if="!isContacted && !failedSendMessage">
        <b-form-group label="Subject/Question">
          <b-form-input
            name="subject"
            v-model.trim="$v.form.subject.$model"
            placeholder=""
            autocomplete="off"
          />
          <small
            class="text-danger d-flex mt-2 text-left"
            v-if="$v.form.subject.$dirty && !$v.form.subject.required"
          >
            This is a required field.
          </small>
          <small
            class="text-danger d-flex mt-2 text-left"
            v-if="!$v.form.subject.maxLength"
          >
            This field must be shorter than or equal to {{messageMaxLength}} characters.
          </small>
        </b-form-group>
        <b-form-group label="Message">
          <textarea
            name="message"
            v-model.trim="$v.form.body.$model"
            placeholder=""
            autocomplete="off"
          />
          <small
            class="text-danger d-flex mt-2 text-left"
            v-if="$v.form.body.$dirty && !$v.form.body.required"
          >
            This is a required field.
          </small>
          <small
            class="text-danger d-flex mt-2 text-left"
            v-if="!$v.form.body.maxLength"
          >
            This field must be shorter than or equal to {{messageMaxLength}} characters.
          </small>
        </b-form-group>
        <div class="btn-box">
          <b-button
            type="submit"
            :disabled="$v.$invalid"
            class="btnGreen btnBigSize btn100 text-uppercase hover-slide-left"
          >
            <span>Send message</span>
          </b-button>
        </div>
      </b-form>
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
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import api from "../../api";
import config from '../../config';
import SvgIcon from '../SvgIcon';

export default {
  name: "ContactCookModal",
  mixins: [validationMixin],
  components: {SvgIcon},
  props: ['mealId'], // TODO: check of cookId is needed there
  data: () => ({
    isContacted: false,
    messageMaxLength: config.TEXT_AREA_MAX_LENGTH,
    form: {
      subject: null,
      body: null
    },
    closeTimeout: null,
    failedSendMessage: false
  }),
  validations: {
    form: {
      subject: {
        required,
        maxLength: maxLength(config.TEXT_AREA_MAX_LENGTH)
      },
      body: {
        required,
        maxLength: maxLength(config.TEXT_AREA_MAX_LENGTH)
      }
    }
  },
  methods: {
    closeModal () {
      this.$bvModal.hide('contact-cook-modal');
    },
    onHidden () {
      this.isContacted = false;
      this.failedSendMessage = false;
      this.$v.$reset();
      this.form.subject = null;
      this.form.body = null;
    },
    onShown () {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
    },
    onSubmit () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      if (this.mealId) {
        const dataToSend = {
          subject: this.$v.form.$model.subject,
          body: this.$v.form.$model.body
        };
        api.dashboard.meals.contactCookByMealId(this.mealId, dataToSend)
          .then(() => {
            this.isContacted = true;
            this.closeTimeout = setTimeout(() => {
              this.closeModal();
            }, 3000);
          })
          .catch(err => {
            console.log('\n >> err sending message > ', err);
            this.failedSendMessage = true;
            this.closeTimeout = setTimeout(() => {
              this.closeModal();
            }, 3000);
          });
      } else {
        // TODO: contact cook from cook-profile page ??
        this.closeModal(); // temp
      }
    },
  }
}
</script>

<style scoped>

</style>
