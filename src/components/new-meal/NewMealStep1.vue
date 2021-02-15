<template>
    <b-form class="form new-meal-wizard-form">
        <b-form-group>
            <legend class="custom-legend">
                <span>Meal Name</span>
                <b-btn class="edit-btn" v-if="allowEnableEditFields" @click="enableEditFields()">
                    <!-- TODO: use SvgIcon instead -->
                    <i class="fa fa-pencil-alt"></i>
                    <span class="edit-btn-text">Edit</span>
                </b-btn>
            </legend>
            <b-form-input
                    name="name"
                    v-model.trim="$v.form.name.$model"
                    placeholder="e.g. Grandma's lasagna"
                    autocomplete="off"
                    :disabled="shouldDisableName"
            ></b-form-input>
            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.name.$dirty && !$v.form.name.required">This is a required field.</small>
        </b-form-group>
        <b-form-group>
            <legend class="custom-legend">
                <span>Meal Description</span>
                <b-btn class="edit-btn" v-if="allowEnableEditFields" @click="enableEditFields()">
                    <!-- TODO: use SvgIcon instead -->
                    <i class="fa fa-pencil-alt"></i>
                    <span class="edit-btn-text">Edit</span>
                </b-btn>
            </legend>
            <textarea
                    name="description"
                    v-model.trim="$v.form.description.$model"
                    placeholder="a little something about your meal..."
                    autocomplete="off"
                    :disabled="shouldDisableDescription"
            ></textarea>
            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.description.$dirty && !$v.form.description.required">This is a required field.</small>
            <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.description.maxLength">This field must be shorter than or equal to {{descMaxLength}} characters.</small>
        </b-form-group>
        <b-form-group label="Number of Meals" v-if="!excludeQuantityField">
            <p class="sub-label-text">1 meal = 1 container</p>
            <b-form-input
                    name="quantity"
                    type="number"
                    pattern="[0-9]*"
                    v-model="$v.form.quantity.$model"
                    :min="quantityMin"
                    :max="quantityMax"
                    step="1"
                    @paste.prevent
                    placeholder="e.g. 5"
                    autocomplete="off"
                    onkeypress="return event.code.includes('Digit')"
            ></b-form-input>
            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.quantity.$dirty && !$v.form.quantity.required">This is a required field.</small>
            <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.quantity.minValue">Minimum number of meals is {{quantityMin}}.</small>
            <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.quantity.maxValue">Maximum number of meals is {{quantityMax}}.</small>
            <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.quantity.numeric">This value should be numeric.</small>
        </b-form-group>
    </b-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minValue, maxValue, maxLength, numeric } from "vuelidate/lib/validators";
import config from '../../config';
export default {
    name: "NewMealStep1",
    mixins: [validationMixin],
    props: ['excludeQuantityField', 'prevValues', 'disabledFields'],
    data: () => ({
        descMaxLength: config.MEAL_INFO.DESCRIPTION_MAX_LENGTH,
        quantityMin: config.MEAL_INFO.QUANTITY_MIN,
        quantityMax: config.MEAL_INFO.QUANTITY_MAX,
        form: {
            name: '',
            description: '',
            quantity: null
        },
        allowEnableEditFields: false,
        shouldDisableName: false,
        shouldDisableDescription: false
    }),
    validations() {
        const form = {
            name: { required },
            description: {
                required,
                maxLength: maxLength(config.MEAL_INFO.DESCRIPTION_MAX_LENGTH)
            }
        };
        if (!this.excludeQuantityField) {
            form['quantity'] = {
                required,
                numeric,
                minValue: minValue(config.MEAL_INFO.QUANTITY_MIN),
                maxValue: maxValue(config.MEAL_INFO.QUANTITY_MAX)
            }
        }
        return { form: form };
    },
    methods: {
        validate () {
            this.$v.form.$touch();
            const isValid = !this.$v.form.$invalid;
            this.$emit('on-validate', this.$data.form, isValid);
            return isValid;
        },
        isFormValid () {
            return !this.$v.form.$invalid;
        },
        enableEditFields () {
            this.allowEnableEditFields = false;
            this.shouldDisableName = false;
            this.shouldDisableDescription = false;
            this.$emit('should-allow-edit-meal-copy');
        }
    },
    watch: {
        prevValues: function (newVal) {
            if (!newVal || !Object.keys(newVal)) return;
            for (let key of ['name', 'description', 'quantity']) {
                if (key in newVal && newVal[key]) {
                    this.form[key] = newVal[key];
                }
            }
        },
        disabledFields: function (newVal) {
            if (!newVal || !newVal.length) {
                this.allowEnableEditFields = false;
                this.shouldDisableName = false;
                this.shouldDisableDescription = false;
                return;
            }
            this.$nextTick(() => {
                const _shouldDisableMealFields = (newVal.includes('name') && newVal.includes('description')) || false;
                this.allowEnableEditFields = _shouldDisableMealFields;
                this.shouldDisableName = _shouldDisableMealFields;
                this.shouldDisableDescription = _shouldDisableMealFields;
            });
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../scss/utils/vars";
.new-meal-wizard-form {
    .form-group {
        .sub-label-text {
            color: $textBlackColor;
            font-family: $FilsonProRegular;
            font-size: 16px;
            letter-spacing: 0;
            line-height: 24px;
        }
        .custom-legend {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .edit-btn {
                background: transparent;
                border: none;
                outline: none;
                color: $greenColor;
                padding: 0;
                margin-left: 20px;

                .edit-btn-text {
                    margin-left: 10px;
                }
            }
        }
    }
}
</style>
