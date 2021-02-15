<template>
    <b-modal
            id="reserve-meal-modal"
            ref="reserveMealModal"
            hide-footer
            size="lg"
            modal-class="reserve-meal-modal"
            @hidden="onHidden"
            centered
            :return-focus="{}"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 text-center">
                <template v-if="!isReserved">Reserve this meal</template>
                <template v-else>Meal reserved!</template>
            </div>

            <b-form class="form" @submit.stop.prevent="onSubmit" v-if="!isReserved">
                <b-form-group label="Number of Servings">
                    <b-form-input
                            name="servings"
                            type="number"
                            pattern="[0-9]*"
                            v-model="$v.form.servings.$model"
                            placeholder="e.g. 5"
                            autocomplete="off"
                            :min="minCount"
                            @paste.prevent
                            onkeypress="return event.code.includes('Digit')"
                    ></b-form-input>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.servings.$dirty && !$v.form.servings.required">This is a required field.</small>
                    <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.servings.minValue">Minimum number of servings is {{minCount}}.</small>
                </b-form-group>
                <b-form-group label="Notes for Cook">
                    <textarea
                            name="notes"
                            v-model="$v.form.notes.$model"
                            placeholder="e.g. no hot sauce please ;)"
                            autocomplete="off"
                    ></textarea>
                    <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.notes.maxLength">This field must be shorter than or equal to {{notesMaxLength}} characters.</small>
                </b-form-group>
                <div class="box-btn">
                    <b-button type="submit" :disabled="$v.$invalid" class="btnGreen btnBigSize btn100 text-uppercase hover-slide-left">
                        <span>Reserve meal</span>
                    </b-button>
                </div>
            </b-form>

            <div v-if="isReserved" class="reserved-info">
                <div class="pickup-time-wrapper">
                    <div class="pickup-time-title">
                        <SvgIcon icon="clock"></SvgIcon>
                        <span class="ml-2">Pickup Date & Time</span>
                    </div>
                    <p class="pickup-time-value">{{readyTimeStr}}</p>
                </div>
                <div class="pickup-location-wrapper d-flex">
                    <div class="pickup-location-title">
                        <SvgIcon icon="location"></SvgIcon>
                        <span class="ml-2">Location</span>
                    </div>
                    <!-- TODO: should be the link?? -->
                    <p class="pickup-location-value">{{offerInfo.place.address}}</p>
                </div>
                <div class="buttons-wrapper">
                    <b-btn class="btnGreenTransparent btnNormalSize btn100 text-uppercase hover-slide-left" @click="contactTheCook">
                        <span>Contact the cook</span>
                    </b-btn>
                    <b-btn class="btnGreen btnNormalSize btn100 text-uppercase hover-slide-left" @click="browseMoreMeals">
                        <span>Browse more meals</span>
                    </b-btn>
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
import { validationMixin } from "vuelidate";
import { required, minValue, maxLength } from "vuelidate/lib/validators";
import config from '../../config';
import api from '../../api';
import SvgIcon from '../SvgIcon';
import helpers from '../../helpers';
const MIN_COUNT = 1;
export default {
    name: "ReserveMealModal",
    mixins: [validationMixin],
    components: {SvgIcon},
    props: ['offerInfo'],
    data: () => ({
        notesMaxLength: config.DINE_NOTES_MAX_LENGTH,
        form: {
            servings: null,
            notes: null
        },
        isReserved: false,
        minCount: MIN_COUNT
    }),
    validations: {
        form: {
            servings: {
                required,
                minValue: minValue(MIN_COUNT)
            },
            notes: {
                maxLength: maxLength(config.DINE_NOTES_MAX_LENGTH)
            }
        }
    },
    methods: {
        closeModal () {
            this.$bvModal.hide('reserve-meal-modal');
        },
        onHidden () {
            this.isReserved = false;
            this.$v.$reset();
            this.form.notes = null;
            this.form.servings = null;
        },
        onSubmit () {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            const dataToPost = {
                servings: Number(this.$v.form.$model.servings),
                offerId: this.offerInfo.id,
                notes: this.$v.form.$model.notes && this.$v.form.$model.notes.length ? this.$v.form.$model.notes.trim() : ' '
            };
            api.dashboard.bookings.postDine(dataToPost)
                .then(result => {
                    this.isReserved = true;
                    this.$emit('onReserved', result.id, dataToPost.servings);
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                })
        },
        contactTheCook () {
            this.$bvModal.show('contact-cook-modal');
        },
        browseMoreMeals () {
            this.closeModal();
            this.$router.push({ path: '/dashboard/eat' }).catch(()=>{});
        }
    },
    computed: {
        readyTimeStr: function () {
            return `Ready at ${helpers.parseDate(this.offerInfo.pickupTime, true)}`;
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.reserved-info {
    .pickup-time-wrapper, .pickup-location-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .pickup-time-title, .pickup-location-title {
            display: flex;
            justify-content: center;
            align-items: center;

            .svg-icon-wrapper {
                height: auto;
                width: 20px;
                margin-right: 3px;
            }
        }
    }
    .pickup-time-wrapper {
        margin-top: 50px;
        margin-bottom: 43px;
        color: $textBlackColor;
        letter-spacing: 0;
        line-height: 24px;

        .pickup-time-value {
            font-size: 16px;
            font-family: $FilsonProRegular;
        }
        .pickup-time-title {
            font-family: $FilsonProBold;
            font-size: 18px;
            margin-bottom: 16px;
        }
    }
    .pickup-location-wrapper {
        letter-spacing: 0;
        line-height: 24px;
        margin-bottom: 50px;

        .pickup-location-value {
            text-decoration: underline;
            color: $greenColor;
            font-size: 16px;
            font-family: $FilsonProRegular;
        }
        .pickup-location-title {
            color: $textBlackColor;
            font-family: $FilsonProBold;
            font-size: 18px;
            margin-bottom: 16px;
        }
    }
    .buttons-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;

        .btn {
            max-width: 264px;

            span {
                padding-top: 16px;
                padding-bottom: 16px;
                font-size: 18px;
                line-height: 18px;
            }

            &:first-of-type {
                margin-right: 16px;
            }
            &:last-of-type {
                margin-left: 16px;
            }
        }
    }
}
</style>
