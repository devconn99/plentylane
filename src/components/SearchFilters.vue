<template>
    <div class="search-filters-wrapper">
        <b-form class="form" @submit.stop.prevent="onSubmit">
            <b-input-group>
                <b-input-group-prepend @click.stop="onSubmit">
                    <b-button variant="outline-secondary">
                        <i class="fa fa-search"></i>
                    </b-button>
                </b-input-group-prepend>
                <b-form-input
                        v-model="$v.form.name.$model"
                        placeholder="E.g. Fish Tacos"
                        v-on:keyup.enter="onSubmit"
                ></b-form-input>
                <b-input-group-append @click.stop="onSubmit">
                    <b-button variant="success">Search</b-button>
                </b-input-group-append>
            </b-input-group>

            <div class="mt-4 main-filters-wrapper">
                <b-form-group label="View">
                    <b-form-radio-group
                            class="toggle-view-type-group"
                            v-model="$v.form.viewType.$model"
                            name="radios-btn-default"
                            buttons
                    >
                        <template #first>
                            <b-form-radio :value="item.value" v-for="item in viewTypeOptions" @change="viewTypeChanged">
                                <i :class="item.iconClass"></i>
                                <span class="pl-2">{{item.text}}</span>
                            </b-form-radio>
                        </template>
                    </b-form-radio-group>
                </b-form-group>

                <b-form-group label="Date Available" v-if="!isMobileView" class="date-field-group">
                    <b-form-datepicker
                            v-model="$v.form.date.$model"
                            placeholder=""
                            :min="minDate"
                            name="date"
                            :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }"
                            locale="en"
                            hide-header
                            dropleft
                            menu-class="override-datepicker-dropdown"
                            @input="onSubmit"
                            reset-button
                    ></b-form-datepicker>
                </b-form-group>

                <b-form-group label="Proximity" v-if="!isMobileView" class="proximity-field-group">
                    <b-form-select
                            v-model="$v.form.proximity.$model"
                            :options="proximityOptions"
                            @change="onSubmit"
                    ></b-form-select>
                </b-form-group>

                <b-btn
                        variant="success"
                        class="collapse-filter-toggle-btn"
                        :class="restFiltersVisible ? 'not-collapsed' : 'collapsed'"
                        :aria-expanded="restFiltersVisible ? 'true' : 'false'"
                        aria-controls="collapse-rest-filters"
                        @click="restFiltersVisible = !restFiltersVisible"
                >
                    <span class="when-open">
                        <i class="fa fa-minus"></i>
                        <span class="collapse-btn-text">
                            <template v-if="!isMobileView">Less filters</template>
                            <template v-else>Filters</template>
                        </span>
                    </span>
                    <span class="when-closed">
                        <i class="fa fa-plus"></i>
                        <span class="collapse-btn-text">
                            <template v-if="!isMobileView">More filters</template>
                            <template v-else>Filters</template>
                        </span>
                    </span>
                </b-btn>
            </div>

            <b-collapse class="rest-filters-wrapper mt-2" id="collapse-rest-filters" v-model="restFiltersVisible">
                <template v-if="isMobileView">
                    <b-form-group label="Date Available" class="date-field-group">
                        <b-form-datepicker
                                v-model="$v.form.date.$model"
                                placeholder=""
                                :min="minDate"
                                name="date"
                                :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' }"
                                locale="en"
                                hide-header
                                dropleft
                                menu-class="override-datepicker-dropdown"
                                @input="onSubmit"
                                reset-button
                        ></b-form-datepicker>
                    </b-form-group>
                    <b-form-group label="Proximity" class="proximity-field-group">
                        <b-form-select
                                v-model="$v.form.proximity.$model"
                                :options="proximityOptions"
                                @change="onSubmit"
                        ></b-form-select>
                    </b-form-group>
                </template>

                <b-form-group label="Available servings">
                    <b-form-input
                            name="availableServings"
                            type="number"
                            v-model="$v.form.availableServings.$model"
                            placeholder="e.g. 5"
                            autocomplete="off"
                            debounce="500"
                            @update="onSubmit"
                            v-on:keyup.enter="onSubmit"
                    ></b-form-input>
                    <small
                            class="text-danger d-flex mt-2 text-left"
                            v-if="!$v.form.availableServings.minValue"
                    >Minimum number of available servings is {{availableServingsMin}}.</small>
                    <small
                            class="text-danger d-flex mt-2 text-left"
                            v-if="!$v.form.availableServings.maxValue"
                    >Maximum number of available servings is {{availableServingsMax}}.</small>
                </b-form-group>

                <b-form-group class="dietary-notes" label="Critical dietary notes">
                    <p class="mb-3 mt-0">Select as many apply</p>
                    <b-form-checkbox-group
                            class="dietary-notes-group"
                            id="checkbox-group-1"
                            v-model="$v.form.dietaryNotes.$model"
                            :options="dietaryOptions"
                            name="dietaryNotes"
                    ></b-form-checkbox-group>
                </b-form-group>
                <div class="dietary-notes-bottom-buttons">
                    <b-btn variant="outline-warning" class="mr-2" @click="resetDietaryNotes">Reset dietary notes</b-btn>
                    <b-btn variant="success" @click="onSubmit">Apply</b-btn>
                </div>
            </b-collapse>
        </b-form>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { minValue, maxValue } from "vuelidate/lib/validators";
import helpers from '../helpers';
import config from '../config';
export default {
    name: "SearchFilters",
    mixins: [validationMixin],
    props: ['searchStr', 'isSubmitting'],
    data: () => ({
        form: {
            name: '',
            date: null,
            proximity: null,
            viewType: 'grid',
            availableServings: null,
            dietaryNotes: []
        },
        dietaryOptions: helpers.prepareDietaryNotesCheckboxOptions(),
        minDate: new Date(),
        isMapView: false,
        viewTypeOptions: [
            { text: 'Grid', value: 'grid', iconClass: 'fas fa-th-large' },
            { text: 'Map', value: 'map', iconClass: 'far fa-map' }
        ],
        proximityOptions: [
            { value: null, text: 'Select proximity' },
            { value: '0,5', text: '0-5 mi' },
            { value: '0,10', text: '5-10 mi' },
            { value: '0,15', text: '10-15 mi' }
        ],
        restFiltersVisible: false,
        isMobileView: false,
        availableServingsMin: config.SEARCH.AVAILABLE_SERVINGS_MIN,
        availableServingsMax: config.SEARCH.AVAILABLE_SERVINGS_MAX
    }),
    validations: {
        form: {
            name: {},
            date: {},
            proximity: {},
            viewType: {},
            availableServings: {
                minValue: minValue(config.SEARCH.AVAILABLE_SERVINGS_MIN),
                maxValue: maxValue(config.SEARCH.AVAILABLE_SERVINGS_MAX)
            },
            dietaryNotes: {}
        }
    },
    methods: {
        onSubmit () {
            if (this.isSubmitting) return;
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
        },
        viewTypeChanged (type) {
            this.$emit('on-view-type-changed', type);
        },
        checkFiltersVisibility () {
            if ($(window).innerWidth() < 768) {
                if (!this.isMobileView) {
                    this.isMobileView = true;
                    this.restFiltersVisible = false;
                }
            } else {
                if (this.isMobileView) {
                    this.isMobileView = false;
                    this.restFiltersVisible = false;
                }
            }
        },
        resetDietaryNotes () {
            this.form.dietaryNotes = [];
            this.onSubmit();
        }
    },
    watch: {
        searchStr: function (newVal) {
            setTimeout(() => {
                this.form.name = newVal;
            }, 0);
        }
    },
    mounted () {
        this.checkFiltersVisibility();

        this.$nextTick(() => {
            $(window).on('resize', this.checkFiltersVisibility);
        })
    },
    beforeDestroy () {
        $(window).off('resize');
    }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.search-filters-wrapper {
    .main-filters-wrapper {
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
    .collapse-filter-toggle-btn {
        &.collapsed {
            > .when-open {
                display: none;
            }
        }
        &.not-collapsed {
            > .when-closed {
                display: none;
            }
        }
        .collapse-btn-text {
            margin-left: 10px;
        }
    }
    .rest-filters-wrapper {
        .form-group {
            + .form-group {
                margin-top: 40px;

                @media screen and (max-width: $tableMinWidth) {
                    margin-top: 20px;
                }
            }
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

                @media screen and (max-width: $tableMinWidth) {
                    flex-wrap: nowrap;
                    max-height: 100%;
                }

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
        .dietary-notes-bottom-buttons {
            display: flex;
            justify-content: flex-end;
            width: 100%;
        }
    }
    .toggle-view-type-group {
        position: relative;

        .btn {
            border-radius: 24px !important;
            border-color: transparent;
            padding: 13px 20px;
            transition: all .6ms ease;
            font-family: $FilsonProRegular;
            font-size: 18px;
            letter-spacing: 0.6px;
            line-height: 18px;
            margin-bottom: 0;

            &.active {
                z-index: 2;
                background-color: #FFFFFF;
                color: $textBlackColor;
                box-shadow: 0 4px 16px 0 rgba(69,53,38,0.15);
            }
            &:not(.active) {
                z-index: 1;
                background-color: $greenColor;
                color: #FFFFFF;
            }

            &:first-of-type {
                &:not(.active) {
                    padding-right: 40px;
                    border-top-right-radius: 0 !important;
                    border-bottom-right-radius: 0 !important;
                }
            }
            &:last-of-type {
                &.active {
                    left: -30px;
                }
                &:not(.active) {
                    padding-left: 40px;
                    border-top-left-radius: 0 !important;
                    border-bottom-left-radius: 0 !important;
                    left: -30px;
                }
            }
        }
    }
    .date-field-group {
        width: 230px;

        .b-form-btn-label-control {
            &.form-control {
                min-height: 48px !important;
                border-radius: 0 !important;

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
    }
    .proximity-field-group {
        select {
            height: 48px;
            padding-left: 15px;
        }
    }
}
</style>
