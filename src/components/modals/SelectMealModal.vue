<template>
    <b-modal
            id="select-meal-modal"
            ref="selectMealModal"
            size="lg"
            modal-class="select-meal-modal"
            centered
            :no-close-on-esc="!areNoMeals || hasError"
            :no-close-on-backdrop="!areNoMeals || hasError"
            @shown="onModalShown"
            @hidden="onModalHidden"
    >
        <div slot="default" class="position-relative">
            <div class="title-size3 titleGreenNavyColor mb-4 text-center">Select a meal to copy</div>
            <div v-if="!isDataReady" class="position-relative w-100" style="height: 100px;">
                <loading
                        :active.sync="isLoading"
                        :is-full-page="loaderOptions.isFullPage"
                        :color="loaderOptions.color"
                ></loading>
            </div>

            <template v-else>
                <b-form class="form" v-if="!isLoading && !areNoMeals && options && options.length">
                    <b-form-group class="meal-select-group">
                        <b-form-select v-model="$v.form.mealId.$model" :options="options" @change="onSelect"></b-form-select>
                    </b-form-group>
                </b-form>
                <p class="text-center" v-if="areNoMeals && !isLoading">You don't have any meals.</p>
                <p class="text-center" v-if="!isLoading && hasError">
                    Sorry, but we're unable load your meals. Please try again later.
                </p>
            </template>
        </div>
        <div slot="modal-title"></div>
        <div slot="modal-header-close">
            <div class="modal-popup-title-icon">
                <SvgIcon icon="closeModalIcon"></SvgIcon>
            </div>
        </div>
        <template slot="modal-footer">
            <div v-if="!isDataReady"></div>
            <template v-else>
                <template v-if="!areNoMeals && !isLoading && !hasError">
                    <b-btn class="btnGreenTransparent btnNormalSize text-uppercase hover-slide-left" @click="cancel">
                        <span>Cancel</span>
                    </b-btn>
                    <b-btn
                            class="btnGreen btnNormalSize text-uppercase hover-slide-left"
                            :disabled="!areNoMeals && !$v.form.mealId.$model"
                            @click="closeModalWithValue"
                    >
                        <span>Select</span>
                    </b-btn>
                </template>
                <div v-else></div>
            </template>
        </template>
    </b-modal>
</template>

<script>
import SvgIcon from '../SvgIcon';
import { validationMixin } from "vuelidate";
import api from '../../api';
import Loading from 'vue-loading-overlay';
export default {
    name: "SelectMealModal",
    mixins: [validationMixin],
    components: {SvgIcon, Loading},
    data: () => ({
        form: {
            mealId: ''
        },
        options: [],
        isLoading: false,
        areNoMeals: false,
        hasError: false,
        loaderOptions: {
            color: '#009C90',
            isFullPage: false
        },
        isDataReady: false,
        originalMeals: [],
        selectedMeal: {}
    }),
    validations: {
        form: {
            mealId: {}
        }
    },
    methods: {
        onModalShown () {
            this.isLoading = true;
            const _options = this.$store.getters.mealsOptionsDataToCopy;
            if (_options && _options.length) {
                _options.forEach(item => {
                    this.options.push({ value: item.id, text: item.name });
                    this.originalMeals.push(item);
                });
                // temp timeout to make loader visible
                setTimeout(() => {
                    this.isDataReady = true;
                    this.isLoading = false;
                }, 300);
            } else {
                api.dashboard.meals.getMyMeals()
                    .then(result => {
                        if (result && result.data && result.data.length) {
                            result.data.forEach(item => {
                                this.options.push({ value: item.id, text: item.name });
                                this.originalMeals.push(item);
                            });
                            this.$store.commit('mealsOptionsDataToCopy', result.data);
                        } else {
                            this.areNoMeals = true;
                        }
                        this.isLoading = false;
                        this.isDataReady = true;
                    })
                    .catch(() => {
                        this.isLoading = false;
                        this.hasError = true;
                        this.isDataReady = true;
                    })
            }
        },
        onModalHidden () {
            // need to reset data when modal is hidden
            this.areNoMeals = false;
            this.isLoading = false;
            this.form.mealId = '';
            this.hasError = false;
            this.options = [];
            this.isDataReady = false;
            this.originalMeals = [];
            this.selectedMeal = {};
        },
        closeModal () {
            this.$refs.selectMealModal.hide();
        },
        closeModalWithValue () {
            this.closeModal();
            if (this.selectedMeal && this.selectedMeal.id) {
                // redirect to new-meal page
                const { name = '', description = '', dietaryNotes = [] } = this.selectedMeal;
                this.$store.commit('copiedMealInfo', { name: `${name.trim()} (Copy)`, description, dietaryNotes });
                this.$router.push({ path: '/dashboard/cook/new-meal', query: { useCopy: true } }).catch(() => {});
            }
        },
        cancel () {
            this.closeModal();
        },
        onSelect (mealId) {
            const _meal = this.originalMeals.find(item => Number(item.id) === Number(mealId));
            this.selectedMeal = _meal && _meal.id ? _meal : {};
        }
    }
}
</script>

<style scoped>

</style>
