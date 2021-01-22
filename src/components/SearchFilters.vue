<template>
    <div class="search-filters-wrapper">
        <b-form class="form" @submit.stop.prevent="onSubmit">
            <b-input-group>
                <b-input-group-prepend @click.stop="onSubmit">
                    <b-button variant="outline-secondary">
                        <i class="fa fa-search"></i>
                    </b-button>
                </b-input-group-prepend>
                <b-form-input v-model="$v.form.name.$model" placeholder="E.g. Fish Tacos"></b-form-input>
                <b-input-group-append @click.stop="onSubmit">
                    <b-button variant="success">Search</b-button>
                </b-input-group-append>
            </b-input-group>
            <small class="text-danger d-flex mt-2" v-if="!$v.form.name.minLength">This field must be at least 3 characters long.</small>

            <div class="mt-4 rest-filters-wrapper">
                <b-form-group label="View">
                    <b-form-radio-group v-model="$v.form.viewType.$model" name="radios-btn-default" buttons>
                        <template #first>
                            <b-form-radio :value="item.value" v-for="item in viewTypeOptions">
                                <i :class="item.iconClass"></i>
                                <span class="pl-2">{{item.text}}</span>
                            </b-form-radio>
                        </template>
                    </b-form-radio-group>
                </b-form-group>

                <b-form-group label="Date Available">
                    <b-form-datepicker
                            v-model="$v.form.date.$model"
                            placeholder=""
                            :min="minDate"
                            name="date"
                            :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }"
                            locale="en"
                            hide-header
                            dropleft
                            menu-class="offer-pickup-date"
                            @input="onSubmit"
                            reset-button
                    ></b-form-datepicker>
                </b-form-group>

                <b-form-group label="Proximity">
                    <b-form-select
                            v-model="$v.form.proximity.$model"
                            :options="proximityOptions"
                            @change="onSubmit"
                    ></b-form-select>
                </b-form-group>

                <b-btn variant="success">
                    <i class="fa fa-plus"></i>
                    More filters
                </b-btn>
            </div>
        </b-form>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { minLength } from "vuelidate/lib/validators";
export default {
    name: "SearchFilters",
    mixins: [validationMixin],
    props: ['searchStr'],
    data: () => ({
        form: {
            name: '',
            date: null,
            proximity: null,
            viewType: 'grid'
        },
        minDate: new Date(),
        isMapView: false,
        viewTypeOptions: [
            { text: 'Grid', value: 'grid', iconClass: 'fas fa-th-large' },
            { text: 'Map', value: 'map', iconClass: 'far fa-map' }
        ],
        proximityOptions: [
            { value: null, text: 'Select proximity' },
            { value: '0,5', text: '0-5 mi' },
            { value: '0,10', text: '0-10 mi' },
            { value: '0,15', text: '0-15 mi' }
        ]
    }),
    validations: {
        form: {
            name: {
                minLength: minLength(3)
            },
            date: {},
            proximity: {},
            viewType: {}
        }
    },
    methods: {
        onSubmit () {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            this.emitChanges();
        },
        emitChanges () {
            const model = { ...this.$v.form.$model };
            if (model.name && model.name.length) {
                model.name = model.name.trim();
            }
            this.$emit('on-filters-changed', model);
        }
    },
    watch: {
        searchStr: function (newVal) {
            setTimeout(() => {
                this.form.name = newVal;
            }, 0);
        }
    }
}
</script>

<style scoped lang="scss">
.search-filters-wrapper {
    .rest-filters-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }
    .form {
        .form-group {
            margin-bottom: 0 !important;
        }
    }
}
</style>
