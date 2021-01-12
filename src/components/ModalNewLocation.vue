<template>
    <b-modal id="location-modal" title="New Location" ref="locationModal" no-close-on-esc no-close-on-backdrop centered>
        <div>
            <b-form>
                <b-form-group class="places-search-container" label="Location">
                    <b-input
                            id="placeSearch"
                            type="text"
                            name="location"
                            v-model="$v.form.locationStr.$model"
                            class="search-input"
                            placeholder="Search for a location"
                            autocomplete="off"
                    ></b-input>
                    <small
                            class="text-danger d-flex mt-2 text-left"
                            v-if="$v.form.locationStr.$dirty && !$v.form.locationStr.required"
                    >This is a required field.</small>
                    <small
                            class="text-danger d-flex mt-2 text-left"
                            v-if="$v.form.locationStr.$dirty && $v.form.locationStr.required && !$v.form.selectedPlace.required"
                    >Please select a location.</small>
                    <!--<b-button size="sm" class="clear-btn" @click="clearSearch">-->
                    <!--<i class="fa fa-times"></i>-->
                    <!--</b-button>-->
                </b-form-group>
                <b-form-group label="Alias">
                    <b-form-input name="alias" v-model="$v.form.alias.$model" placeholder="Alias" autocomplete="off"></b-form-input>
                    <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.alias.$dirty && !$v.form.alias.required">This is a required field.</small>
                </b-form-group>
            </b-form>
        </div>
        <div slot="modal-footer">
            <b-btn class="btn btn-cancel" variant="" @click="cancel">Cancel</b-btn>
            <b-btn class="btn btn-save" variant="primary" @click="saveLocation">Save</b-btn>
        </div>
    </b-modal>
</template>

<script>
import api from '../api';
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
    name: "ModalNewLocation",
    mixins: [validationMixin],
    data: () => ({
        form: {
            alias: '',
            locationStr: '',
            selectedPlace: null
        },
        autocomplete: null
    }),
    validations: {
        form: {
            alias: {required},
            locationStr: {required},
            selectedPlace: {required}
        }
    },
    mounted() {
        this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
            if (modalId === 'location-modal') {
                this.initPlacesAutocomplete();
            }
        });
        this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
            if (modalId === 'location-modal') {
                this.resetForm();
            }
        });
    },
    methods: {
        initPlacesAutocomplete () {
            this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('placeSearch'));
            this.autocomplete.addListener("place_changed", this.placeChangedHandler);
        },
        placeChangedHandler () {
            const place = this.autocomplete.getPlace();
            this.form.selectedPlace = {
                address: place.formatted_address,
                googleMapsIdentifier: place.place_id,
                location: {
                    type: 'Point',
                    coordinates: [place.geometry.location.lat(), place.geometry.location.lng()]
                },
                components: place.address_components
            };
        },
        clearSearch () {
            this.form.selectedPlace = null;
        },
        saveLocation () {
            this.$v.form.$touch();
            const isValid = !this.$v.form.$invalid;
            if (!isValid) {
                return;
            }
            api.dashboard.places.addPlace({ alias: this.form.alias, ...this.form.selectedPlace })
                .then(result => {
                    this.$emit('new-location-added', result);
                    this.closeModal();
                })
                .catch(err => {
                    console.log('\n >> err > ', err);
                    this.closeModal();
                })
        },
        cancel () {
            this.closeModal();
        },
        closeModal () {
            this.$refs.locationModal.hide();
        },
        resetForm () {
            this.$v.$reset();
            this.form.locationStr = '';
            this.form.selectedPlace = null;
            this.form.alias = '';
        }
    }
}
</script>

<style scoped lang="scss">
/*
.places-search-container {
    .search-input {
        width: 100%;
        position: relative;
        padding-right: 45px;
    }
    .clear-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        background: transparent;
        color: #ccc;
    }
}
 */
</style>
