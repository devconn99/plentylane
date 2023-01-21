<template>
  <div>
    <b-row>
      <b-col md="9">
        <b-form class="form" @submit.stop.prevent="onSubmit">
          <b-row>
            <b-col>
              <b-form-group label="Name">
                <b-form-input v-model="$v.form.name.$model" @focus="focusHandler" @input="resetError" placeholder="Name"></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.name.$dirty && !$v.form.name.required">This is a required field.</small>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Email">
                <b-form-input v-model="$v.form.email.$model" @focus="focusHandler" @input="resetError" placeholder="Email Address"></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.email.email">Please enter valid email.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.email.$dirty && !$v.form.email.required">This is a required field.</small>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Phone (optional)">
                <b-form-input v-model="$v.form.phoneNumber.$model" @focus="focusHandler" @input="resetError" placeholder="000-000-0000"></b-form-input>
                <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.phoneNumber.$dirty && !$v.form.phoneNumber.required">Phone is required for sms/phone option.</small>
                <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.phoneNumber.isValidPhoneNumber">Please enter valid phone number.</small>
              </b-form-group>
            </b-col>
          </b-row>

          <b-form-group label="Subject">
            <b-form-input v-model="$v.form.subject.$model" @focus="focusHandler" @input="resetError" placeholder="Subject"></b-form-input>
            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.subject.$dirty && !$v.form.subject.required">This is a required field.</small>
          </b-form-group>
          <b-form-group label="Message">
            <textarea name="message" v-model.trim="$v.form.message.$model" placeholder="Type away:)" rows="5" autocomplete="off"></textarea>
            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.message.$dirty && !$v.form.message.required">This is a required field.</small>
          </b-form-group>
          <b-form-group label="Your contact preference.">
            <b-form-radio-group v-model="form.contactOption" :options="contactOptions" name="contact-options" />
          </b-form-group>

          <b-button type="submit" :disabled="$v.$invalid" class="btnGreen btnBigSize btn50 text-uppercase hover-slide-left mb-3">
            <span>Send</span>
          </b-button>
        </b-form>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email, requiredIf } from "vuelidate/lib/validators";
export default {
  name: "ContactUs",
  mixins: [validationMixin],
  data: () => ({
    form: {
      name: '',
      email: '',
      phoneNumber: '',
      subject: '',
      message: '',
      contactOption: 'email'
    },
    contactOptions: [
      { text: 'Email', value: 'email' },
      { text: 'Phone', value: 'phone' },
      { text: 'SMS', value: 'sms' },
    ]
  }),
  validations: {
    form: {
      name: {
        required
      },
      email: {
        required,
        email
      },
      phoneNumber: {
        required: requiredIf(function(form) {
          return this.form.contactOption != "email"
        }),
        isValidPhoneNumber(value) {
          if (value === '') return true;
          return /^[2-9]\d{2}-[2-9]\d{2}-\d{4}$/.test(value);
        }
      },
      subject: {
        required
      },
      message: {
        required
      }
    }
  },
  methods: {
    resetError() {

    },
    focusHandler(e) {
      this.resetError();
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      const contactUsData = {
        name: this.$v.form.$model.name,
        email: this.$v.form.$model.email,
        phoneNumber: this.$v.form.$model.phoneNumber,
        subject: this.$v.form.$model.subject,
        message:this.$v.form.$model.message,
        contactOption:this.form.contactOption,
      };
      this.$emit('on-contact-us', contactUsData)
    }
  }
}
</script>

<style scoped lang="scss">
.alert {
  padding-left: 25px;
  margin-bottom: 35px;
}

.alert-dismissible .close {
  padding-right: 25px;
}
</style>
