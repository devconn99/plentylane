<template>
    <div class="new-meal-step-3">
        <b-form class="form">
            <b-form-group label="Critical dietary notes" class="dietary-notes">
                <p class="mb-3 mt-0">Select as many apply</p>
                <b-form-checkbox-group
                        class="dietary-notes-group"
                        id="checkbox-group-1"
                        v-model="$v.form.dietaryNotes.$model"
                        :options="dietaryOptions"
                        name="dietaryNotes"
                ></b-form-checkbox-group>
            </b-form-group>
            <div class="meal-time-container">
                <p class="mb-2 form-label-text">Meal availability</p>
                <div class="d-flex meal-time-container-controls">
                    <b-form-group>
                        <p class="mb-2">Pickup Time</p>
                        <b-form-timepicker
                                v-model="$v.form.pickupTime.$model"
                                placeholder=""
                                name="pickupTime"
                                locale="en"
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
                        ></b-form-datepicker>
                    </b-form-group>
                </div>
            </div>
            <div class="meal-location-container">
                <p class="mb-2 form-label-text">Pickup Location</p>
                <div class="d-flex meal-location-controls">
                    <b-form-select
                            class="location-select"
                            v-model="$v.form.placeId.$model"
                            :options="locationOptions"
                    ></b-form-select>
                    <b-btn class="main-btn add-location-button btn-green-bright hover-slide-left transparent" v-b-modal.location-modal>
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
export default {
    name: "NewMealStep3",
    mixins: [validationMixin],
    components: {ModalNewLocation},
    data: () => ({
        dietaryOptions: [
            { text: 'Contains dairy', value: 'DAIRY' },
            { text: 'Contains tree nuts', value: 'TREE_NUTS' },
            { text: 'Contains shellfish', value: 'SHELLFISH' },
            { text: 'Vegetarian', value: 'VEGETARIAN' },
            { text: 'Gluten free', value: 'GLUTEN_FREE' },
            { text: 'Contains eggs', value: 'EGGS' },
            { text: 'Contains peanuts', value: 'PEANUTS' },
            { text: 'Contains fish', value: 'FISH' },
            { text: 'Vegan', value: 'VEGAN' }
        ],
        form: {
            dietaryNotes: [],
            pickupTime: '',
            pickupDate: '',
            placeId: null
        },
        minDate: new Date(),
        locationOptions: [
            { value: null, text: 'Please select a location' }
        ]
    }),
    validations: {
        form: {
            dietaryNotes: {},
            pickupTime: {required},
            pickupDate: {required},
            placeId: {required}
        }
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
        }
    },
    mounted () {
        // load my places
        api.dashboard.places.getMyPlaces()
            .then(result => {
                if (result.data && result.data.length) {
                    this.locationOptions = this.locationOptions.concat(result.data.map(item => ({ value: item.id, text: item.alias })));
                }
            })
            .catch(err => {
                console.log('\n >> err > ', err);
            })
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.new-meal-step-3 {

}
.dietary-notes {
    .dietary-notes-group {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        max-height: 170px;
        align-items: start;
        width: 100%;
        padding-left: 16px;
        padding-right: 16px;

        /* TODO: get back to styles later */
        .custom-control {
            .custom-control-label {
                color: #181816;
                font-family: $FilsonProRegular;
                font-size: 18px;
                letter-spacing: 0.6px;
                line-height: 18px;
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

            &:first-of-type {
                margin-right: 10px;
            }
            &:last-of-type {
                margin-left: 10px;
            }
        }
    }
}
.meal-location-container {
    width: 100%;
    .meal-location-controls {
        width: 100%;
        .location-select {
            flex-grow: 1;
            margin-right: 10px;
        }
        .add-location-button {
            margin-left: 10px;
            height: 65px;
            min-width: 200px;

            span {
                font-size: 18px;
                letter-spacing: 0.6px;
                line-height: 18px;
                text-transform: none;
            }
        }
    }
}
</style>
