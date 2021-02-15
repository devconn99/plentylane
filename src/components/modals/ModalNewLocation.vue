<template>
    <b-modal
            id="location-modal"
            ref="locationModal"
            size="lg"
            modal-class="location-modal modal-with-buttons"
            no-close-on-esc
            no-close-on-backdrop
            centered
            :return-focus="{}"
            @shown="onModalShown"
            @hide="onModalHide"
    >
        <div slot="default">
            <div class="title-size3 titleGreenNavyColor mb-4 text-center">New Location</div>

            <b-form class="form">
                <b-form-group label="Location">
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
        <div slot="modal-title"></div>
        <div slot="modal-header-close">
            <div class="modal-popup-title-icon">
                <SvgIcon icon="closeModalIcon"></SvgIcon>
            </div>
        </div>
        <template slot="modal-footer">
            <b-btn class="btnGreenTransparent btnNormalSize text-uppercase hover-slide-left" @click="cancel">
                <span>Cancel</span>
            </b-btn>
            <b-btn class="btnGreen btnNormalSize text-uppercase hover-slide-left" @click="saveLocation">
                <span>Save</span>
            </b-btn>
        </template>
    </b-modal>
</template>

<script>
import api from '../../api';
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import SvgIcon from '../SvgIcon';
export default {
    name: "ModalNewLocation",
    mixins: [validationMixin],
    components: {SvgIcon},
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
        },
        onModalShown () {
            this.initPlacesAutocomplete();
        },
        onModalHide () {
            this.resetForm();
        }
    }
}
</script>

<style scoped lang="scss">
</style>
