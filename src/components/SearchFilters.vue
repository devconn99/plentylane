<template>
    <b-form class="form searchFormBig search-filters-wrapper" @submit.stop.prevent="onSubmit">
        <div class="name-search-from-group form-group">
            <div class="searchFormBigIcon">
                <SvgIcon icon="search" :params="{ stroke: '#9F9F95' }"></SvgIcon>
            </div>
            <b-form-input
                    id="searchFormBig"
                    type="search"
                    name="search"
                    placeholder="E.g. Fish Tacos"
                    required
                    class="form-control"
                    autocomplete="off"
                    v-model="$v.form.name.$model"
                    v-on:keyup.enter="onSubmit"
            ></b-form-input>
            <b-btn class="btnGreen btnBigSize text-uppercase hover-slide-left search-button" @click.stop="onSubmit">
                <span>Search</span>
            </b-btn>
        </div>

        <div class="main-filters-row">
            <div class="filter-item filter-item-toggle-view">
                <b-form-group class="toggle-view-type-form-group flex-column mb-0" label="View">
                    <b-form-radio-group
                            class="toggle-view-type-radio-group"
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
            </div>
            <div class="filter-item" v-if="!isCompactView">
                <b-form-group class="flex-column mb-0 date-field-group" label="Date Available">
                    <b-form-datepicker
                            v-model="$v.form.date.$model"
                            placeholder=""
                            :min="minDate"
                            name="date"
                            :date-format-options="{ year: '2-digit', month: 'short', day: '2-digit', weekday: 'short' }"
                            locale="en"
                            hide-header
                            dropleft
                            menu-class="override-datepicker-dropdown"
                            @input="onSubmit"
                            reset-button
                    ></b-form-datepicker>
                </b-form-group>
            </div>
            <div class="filter-item" v-if="!isCompactView">
                <b-form-group class="flex-column mb-0 proximity-field-group" label="Proximity">
                    <b-form-select
                            v-model="$v.form.proximity.$model"
                            :options="proximityOptions"
                            @change="onSubmit"
                    ></b-form-select>
                </b-form-group>
            </div>
            <div class="filter-item collapse-filters-btn-wrapper">
                <b-form-group class="flex-column mb-0 justify-content-end">
                    <b-btn
                            class="btnGreenTransparent btnSmallSize btn100 hover-slide-left collapse-filter-toggle-btn"
                            :class="restFiltersVisible ? 'not-collapsed' : 'collapsed'"
                            :aria-expanded="restFiltersVisible ? 'true' : 'false'"
                            aria-controls="collapse-rest-filters"
                            ref="toggleFiltersBtn"
                            @click="toggleFiltersVisibilityBtn()"
                    >
                        <span class="when-open">
                            <i class="fa fa-minus collapse-btn-icon"></i>
                            <template v-if="!isMobileView">Less filters</template>
                            <template v-else>Filters</template>
                        </span>
                        <span class="when-closed">
                            <i class="fa fa-plus collapse-btn-icon"></i>
                            <template v-if="!isMobileView">More filters</template>
                            <template v-else>Filters</template>
                        </span>
                    </b-btn>
                </b-form-group>
            </div>
            <div class="w-100">
                <b-collapse class="rest-filters-wrapper mt-2" id="collapse-rest-filters" v-model="restFiltersVisible">
                    <template v-if="isCompactView">
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

                    <b-form-group label="Available servings" class="available-servings-form-group">
                        <b-form-input
                                name="availableServings"
                                type="number"
                                pattern="[0-9]*"
                                min="1"
                                step="1"
                                v-model="$v.form.availableServings.$model"
                                @paste.prevent
                                onkeypress="return event.code.includes('Digit')"
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
                                v-bind:class="'options-count_' + dietaryOptions.length"
                                id="checkbox-group-1"
                                v-model="$v.form.dietaryNotes.$model"
                                :options="dietaryOptions"
                                name="dietaryNotes"
                                @change="onSubmit"
                        ></b-form-checkbox-group>
                    </b-form-group>
                </b-collapse>
            </div>
        </div>
    </b-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { minValue, maxValue } from "vuelidate/lib/validators";
import helpers from '../helpers';
import config from '../config';
import SvgIcon from './SvgIcon';
export default {
    name: "SearchFilters",
    mixins: [validationMixin],
    components: {SvgIcon},
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
            { text: 'Map', value: 'map', iconClass: 'far fa-map fa-flip-horizontal' }
        ],
        proximityOptions: [
            { value: null, text: 'Select proximity' },
            { value: '0,5', text: '0-5 mi' },
            { value: '0,10', text: '0-10 mi' },
            { value: '0,15', text: '0-15 mi' }
        ],
        restFiltersVisible: false,
        isCompactView: false,
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
            const _width = $(window).innerWidth();
            this.isMobileView = _width < 768;
            if (_width < 1190) {
                if (!this.isCompactView) {
                    this.isCompactView = true;
                    this.restFiltersVisible = false;
                }
            } else {
                if (this.isCompactView) {
                    this.isCompactView = false;
                    this.restFiltersVisible = false;
                }
            }
        },
        toggleFiltersVisibilityBtn () {
            this.restFiltersVisible = !this.restFiltersVisible;
            const _btn = this.$refs['toggleFiltersBtn'];
            if (_btn && _btn['blur']) {
                _btn.blur();
            }
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
.form.searchFormBig {
    .btnGreen {
        span {
            border-color: transparent;
        }
    }
    .form-group {
        height: 100%;
        width: 100%;

        &.name-search-from-group {
            display: flex;
            justify-content: space-between;

            .search-button {
                @media screen and (max-width: $phoneBigWidth) {
                    display: none;
                }
            }
        }
        input[type=search] {
            font-size: 18px;
            line-height: 24px;
            letter-spacing: 0.6px;
            color: $textBlackColor;
            background-color: $whiteColor;
            border: 1px solid rgba(161,112,103,0.3);
            padding-top: 13px;
            width: 100%;
            display: block;
            height: 64px;
            border-radius: 0;
            padding-right: 48px;
            padding-left: 60px;
            @media screen and (max-width: $phoneBigWidth) {
                padding-left: 45px;
                padding-right: 15px;
                height: 48px;
            }
            &::-webkit-search-cancel-button {
                display: none;
            }
            &::-webkit-input-placeholder {
                font-size: 18px;
                line-height: 24px;
                letter-spacing: 0;
                color: #8A877D;
                padding-top: 0;
            }
        }
        .searchFormBigIcon {
            position: absolute;
            top: 20px;
            left: 20px;

            @media screen and (max-width: $phoneBigWidth) {
                top: 14px;
                left: 12px;
                display: block;
            }
        }
        button {
            flex: none;
            &.btnGreen {
                span {
                    padding-left: 15px;
                    padding-right: 15px;
                }
            }
        }
    }

    .main-filters-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;

        .filter-item {
            position: relative;
            flex: 0 0 210px;
            max-width: 210px;

            @media screen and (min-width: $desktopBigWidth) {
                flex: 0 0 calc(25% - 16px);
                max-width: calc(25% - 16px);
            }

            &.filter-item-toggle-view {
                flex: 0 0 230px !important;
                max-width: 230px !important;

                @media screen and (max-width: $phoneBigWidth) {
                    flex: 0 0 180px !important;
                    max-width: 180px !important;

                    .toggle-view-type-radio-group {
                        .btn {
                            font-size: 14px;
                            padding: 15px;
                            line-height: 14px;

                            &.active {
                                min-width: 90px;
                            }
                            &:not(.active) {
                                min-width: 115px;
                            }
                            &:first-of-type {
                                &:not(.active) {
                                    padding-right: 40px;
                                }
                            }
                            &:last-of-type {
                                &.active {
                                    left: -30px;
                                }
                                &:not(.active) {
                                    padding-left: 40px;
                                    left: -30px;
                                }
                            }
                        }
                    }
                }
            }
            &.collapse-filters-btn-wrapper {
                padding-top: 30px;

                @media screen and (max-width: $phoneBigWidth) {
                    flex: 0 0 50%;
                    max-width: 50%;
                }
                @media screen and (max-width: 400px) {
                    flex: 0 0 110px;
                    max-width: 110px;
                }
            }
        }
    }

    .collapse-filter-toggle-btn {
        &:active {
            background-color: transparent;
            border-color: inherit;
        }
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
        .when-open, .when-closed {
            position: relative;
            padding: 16px 10px 11px;

            .collapse-btn-icon {
                position: relative;
                top: -2px;
            }
        }
    }
    .rest-filters-wrapper {
        .form-group {
            margin-top: 25px;
            margin-bottom: 25px !important;

            @media screen and (max-width: $tableMinWidth) {
                margin-top: 20px;
                margin-bottom: 20px !important;
            }
        }
        .dietary-notes {
            margin-bottom: 0 !important;
        }
    }
    .toggle-view-type-form-group {
        position: relative;

        .toggle-view-type-radio-group {
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
                margin-bottom: 0 !important;

                &.active {
                    z-index: 2;
                    background-color: #FFFFFF;
                    color: $textBlackColor;
                    box-shadow: 0 4px 16px 0 rgba(69,53,38,0.15);
                    min-width: 120px;
                }
                &:not(.active) {
                    z-index: 1;
                    background-color: $greenColor;
                    color: #FFFFFF;
                    min-width: 140px;
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
    }
    .date-field-group {
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
    .proximity-field-group select,
    .available-servings-form-group .form-control {
        height: 48px;
        padding-left: 15px;
    }
    .available-servings-form-group .form-control {
        padding-right: 10px;
    }
}
</style>
