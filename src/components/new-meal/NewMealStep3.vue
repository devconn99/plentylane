<template>
    <div class="new-meal-step-3">
        <b-form class="form">
            <b-form-group class="dietary-notes">
                <div class="custom-legend">
                    <span>Critical dietary notes</span>
                    <template v-if="allowEnableEditNotes">
                        <EditBtn @on-clicked="enableEditNotes"></EditBtn>
                    </template>
                </div>
                <p class="mb-3 mt-0">Select as many apply</p>
                <b-form-checkbox-group
                        class="dietary-notes-group"
                        v-bind:class="'options-count_' + dietaryOptions.length"
                        id="checkbox-group-1"
                        v-model="$v.form.dietaryNotes.$model"
                        :options="dietaryOptions"
                        name="dietaryNotes"
                ></b-form-checkbox-group>
            </b-form-group>
            <div class="meal-time-container" v-if="!hiddenFields || !hiddenFields.length || !hiddenFields.includes('pickupTime')">
                <p class="mb-2 form-label-text">Meal availability</p>
                <div class="d-flex meal-time-container-controls">
                    <b-form-group>
                        <p class="mb-2">Pickup Time</p>
                        <b-form-timepicker
                                v-model="$v.form.pickupTime.$model"
                                placeholder=""
                                name="pickupTime"
                                locale="en"
                                hide-header
                                no-close-button
                                dropleft
                                menu-class="offer-pickup-time override-timepicker-dropdown"
                                offset="100"
                                minutes-step="5"
                        ></b-form-timepicker>
                    </b-form-group>
                    <b-form-group>
                        <p class="mb-2">Date</p>
                        <b-form-datepicker
                                v-model="$v.form.pickupDate.$model"
                                placeholder=""
                                :min="minDate"
                                name="pickupDate"
                                :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }"
                                locale="en"
                                hide-header
                                dropleft
                                menu-class="offer-pickup-date override-datepicker-dropdown"
                                v-bind:class="shouldShowMinPickupDateError ? 'has-error': ''"
                                @input="onDateChanged"
                        ></b-form-datepicker>
                        <small
                                class="text-danger d-flex mt-2 text-left"
                                v-if="$v.form.pickupDate && shouldShowMinPickupDateError"
                        >Pickup time cannot be in the past</small>
                    </b-form-group>
                </div>
            </div>
            <div class="meal-location-container" v-if="!hiddenFields || !hiddenFields.length || !hiddenFields.includes('location')">
                <p class="mb-2 form-label-text">Pickup Location</p>
                <div class="d-flex meal-location-controls">
                    <b-form-group class="location-select">
                        <b-form-select v-model="$v.form.placeId.$model" :options="locationOptions"></b-form-select>
                    </b-form-group>
                    <b-btn class="add-location-button btnGreenTransparent btnNormalSize hover-slide-left" v-b-modal.location-modal>
                        <span>
                            <i class="fas fa-plus"></i>
                            New Location
                        </span>
                    </b-btn>
                </div>
            </div>
        </b-form>

        <ModalNewLocation @new-location-added="onNewLocationAdded"></ModalNewLocation>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import ModalNewLocation from '../modals/ModalNewLocation';
import api from "../../api";
import helpers from '../../helpers';
import EditBtn from '../EditBtn';
export default {
    name: "NewMealStep3",
    mixins: [validationMixin],
    components: {ModalNewLocation, EditBtn},
    props: ['hiddenFields', 'prevValues', 'disabledFields'],
    data: () => ({
        dietaryOptions: helpers.prepareDietaryNotesCheckboxOptions(),
        form: {
            dietaryNotes: [],
            pickupTime: '',
            pickupDate: '',
            placeId: null
        },
        minDate: new Date(new Date().setHours(0, 0, 0, 0)),
        locationOptions: [
            { value: null, text: 'Please select a location' }
        ],
        allowEnableEditNotes: false,
        limitPlaces: 100,
        shouldShowMinPickupDateError: false
    }),
    validations () {
        const form = {
            dietaryNotes: {},
            pickupTime: {required},
            pickupDate: {required},
            placeId: {required}
        };
        if (this.hiddenFields && this.hiddenFields.length) {
            if (this.hiddenFields.includes('pickupTime')) {
                delete form.pickupTime;
                delete form.pickupDate;
            }
            if (this.hiddenFields.includes('location')) {
                delete form.placeId;
            }
        }
        return { form: form };
    },
    methods: {
        validate () {
            this.$v.form.$touch();
            const isValid = !this.$v.form.$invalid;
            const data = { dietaryNotes: [] };
            if (this.$data.form.dietaryNotes && this.$data.form.dietaryNotes.length) {
                data.dietaryNotes = this.$data.form.dietaryNotes.map(item => ({ label: item }));
                // save `dietaryNotesText` to display it on the last step (preview)
                data['dietaryNotesText'] = this.$data.form.dietaryNotes.map(label => {
                    const item = this.dietaryOptions.find(i => i.value === label);
                    if (!item) return label;
                    return item.text;
                });
            } else {
                data.dietaryNotes = [];
                data['dietaryNotesText'] = [];
            }
            if (this.$data.form.pickupDate && this.$data.form.pickupTime) {
                data['pickupTime'] = `${this.$data.form.pickupDate}T${this.$data.form.pickupTime}Z`; // TODO ?
            }
            if (this.$data.form.placeId) {
                data['placeId'] = this.$data.form.placeId;
                data['placeAlias'] = this.locationOptions.find(item => item.value === this.$data.form.placeId).text;
            }
            this.$emit('on-validate', { ...data }, isValid);
            return isValid;
        },
        isFormValid () {
            return !this.$v.form.$invalid;
        },
        onNewLocationAdded (place) {
            this.locationOptions.push({ value: place.id, text: place.alias });
        },
        updateExistingDietaryNotesOptions (shouldDisable) {
            this.dietaryOptions = this.dietaryOptions.map(option => {
                option['disabled'] = shouldDisable;
                return option;
            });
        },
        enableEditNotes () {
            this.allowEnableEditNotes = false;
            this.updateExistingDietaryNotesOptions(false);
            this.$emit('should-allow-edit-meal-copy');
        },
        onDateChanged () {
            if (this.shouldShowMinPickupDateError) {
                this.shouldShowMinPickupDateError = false;
                this.$eventHub.$emit('hide-min-pickup-date-error-on-review');
            }
        }
    },
    mounted () {
        if (this.hiddenFields && this.hiddenFields.length && this.hiddenFields.includes('location')) return;
        // load my places
        api.dashboard.places.getMyPlaces(this.limitPlaces)
            .then(result => {
                if (result.data && result.data.length) {
                    this.locationOptions = this.locationOptions.concat(result.data.map(item => ({ value: item.id, text: item.alias })));
                }
            })
            .catch(err => {
                console.log('\n >> err > ', err);
            });

    },
    created () {
        this.$eventHub.$on('show-min-pickup-date-error-on-step-3', () => {
            this.shouldShowMinPickupDateError = true;
        });
        this.$eventHub.$on('hide-min-pickup-date-error-on-step-3', () => {
            this.shouldShowMinPickupDateError = false;
        });
    },
    watch: {
        prevValues: function (newVal) {
            if (!newVal || !Object.keys(newVal)) return;
            if (newVal['dietaryNotes'] && newVal['dietaryNotes'].length) {
                this.form.dietaryNotes = newVal.dietaryNotes.map(item => item.label);
            }
            if (newVal['pickupTime'] && newVal['pickupTime'].length) {
                // need to parse pickupDate and pickupTime form fields
                // newVal.pickupTime has format "2021-01-01T00:00:00.000Z"
                const _splitDate = newVal.pickupTime.split('T');
                this.form.pickupDate = _splitDate && _splitDate[0] ? _splitDate[0] : '';
                this.form.pickupTime = _splitDate && _splitDate[1] ? _splitDate[1].slice(0, 8) : '';
            }
            if (newVal['placeId']) {
                this.form.placeId = newVal.placeId;
            }
        },
        disabledFields: function (newVal) {
            if (!newVal || !newVal.length) {
                this.allowEnableEditNotes = false;
                this.updateExistingDietaryNotesOptions(false);
                return;
            }
            this.$nextTick(() => {
                const _shouldDisableNotes = newVal.includes('dietaryNotes') || false;
                this.allowEnableEditNotes = _shouldDisableNotes;
                this.updateExistingDietaryNotesOptions(_shouldDisableNotes);
            });
        }
    },
    beforeDestroy () {
        this.$eventHub.$off('show-min-pickup-date-error-on-step-3');
        this.$eventHub.$off('hide-min-pickup-date-error-on-step-3');
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.new-meal-step-3 {

}
.dietary-notes {
    .custom-legend {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 24px !important;
        margin-bottom: 6px !important;

        span {
            font-size: 18px;
            line-height: 18px;
            letter-spacing: 0.6px;
            padding: 0;
            margin: 0;
            font-family: $FilsonProBold;
            @media screen and (max-width: $tableMinWidth) {
                font-size: 16px;
                line-height: 17px;
                letter-spacing: 0.53px;
            }
        }
    }
}
.meal-time-container {
    width: 100%;
    .meal-time-container-controls {
        width: 100%;
        justify-content: space-between;

        .form-group {
            flex-grow: 1;
            width: 50%;

            &:first-of-type {
                margin-right: 10px;
            }
            &:last-of-type {
                margin-left: 10px;
            }
        }
        .b-form-btn-label-control {
            &.form-control {
                &.focus {
                    border-color: $greenColor;
                    box-shadow: none;
                }
            }
            label.form-control {
                margin-bottom: 0;
                font-family: $FilsonProRegular !important;
            }
        }

        @media screen and (max-width: $tableMinWidth) {
            flex-direction: column;

            .form-group {
                width: 100%;
                margin-bottom: 10px !important;

                &:first-of-type {
                    margin-right: 0;
                    margin-bottom: 20px;
                }
                &:last-of-type {
                    margin-left: 0;
                }
            }
        }
    }
}
.meal-location-container {
    width: 100%;

    @media screen and (max-width: $tableMinWidth) {
        margin-top: 32px;
    }
    .meal-location-controls {
        width: 100%;

        .location-select {
            flex-grow: 1;
            margin-right: 10px;
        }
        .add-location-button {
            margin-left: 10px;
            min-width: 200px;
            height: 64px;

            svg {
                margin-top: -3px;
            }
            i.fa, i.fas, i.far, i.fab {
                margin-top: -5px;
            }
        }

        @media screen and (max-width: $tableMinWidth) {
            flex-direction: column;

            .location-select {
                margin-right: 0;
                margin-bottom: 16px !important;
            }
            .add-location-button {
                margin-left: 0;
                margin-top: 0;
                height: 48px;
            }
        }
    }
}
</style>
