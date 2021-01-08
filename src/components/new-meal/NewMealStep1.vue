<template>
    <b-form class="form">
        <b-form-group label="Meal Name">
            <b-form-input
                    name="name"
                    v-model="$v.form.name.$model"
                    placeholder="e.g. Grandma's lasagna"
                    autocomplete="off"
            ></b-form-input>
            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.name.$dirty && !$v.form.name.required">This is a required field.</small>
        </b-form-group>
        <b-form-group label="Meal Description">
            <b-form-textarea
                    name="description"
                    v-model="$v.form.description.$model"
                    placeholder="a little something about your meal..."
                    autocomplete="off"
            ></b-form-textarea>
            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.description.$dirty && !$v.form.description.required">This is a required field.</small>
            <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.description.maxLength">This field must be shorter than or equal to {{descMaxLength}} characters.</small>
        </b-form-group>
        <b-form-group label="Number of Meals">
            <p class="mb-2 text-muted">1 meal = 1 container</p>
            <b-form-input
                    name="quantity"
                    type="number"
                    v-model="$v.form.quantity.$model"
                    placeholder="e.g. 5"
                    autocomplete="off"
            ></b-form-input>
            <small class="text-danger d-flex mt-2 text-left" v-if="$v.form.quantity.$dirty && !$v.form.quantity.required">This is a required field.</small>
            <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.quantity.minValue">Minimum number of meals is {{quantityMin}}.</small>
            <small class="text-danger d-flex mt-2 text-left" v-if="!$v.form.quantity.maxValue">Maximum number of meals is {{quantityMax}}.</small>
        </b-form-group>
    </b-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minValue, maxValue, maxLength } from "vuelidate/lib/validators";
import config from '../../config';
export default {
    name: "NewMealStep1",
    mixins: [validationMixin],
    data: () => ({
        descMaxLength: config.MEAL_INFO.DESCRIPTION_MAX_LENGTH,
        quantityMin: config.MEAL_INFO.QUANTITY_MIN,
        quantityMax: config.MEAL_INFO.QUANTITY_MAX,
        form: {
            name: '',
            description: '',
            quantity: null
        }
    }),
    validations: {
        form: {
            name: { required },
            description: {
                required,
                maxLength: maxLength(config.MEAL_INFO.DESCRIPTION_MAX_LENGTH)
            },
            quantity: {
                required,
                minValue: minValue(config.MEAL_INFO.QUANTITY_MIN),
                maxValue: maxValue(config.MEAL_INFO.QUANTITY_MAX)
            }
        }
    },
    methods: {
        validate() {
            this.$v.form.$touch();
            const isValid = !this.$v.form.$invalid;
            this.$emit('on-validate', this.$data.form, isValid);
            return isValid;
        }
    }
}
</script>

<style scoped>

</style>
