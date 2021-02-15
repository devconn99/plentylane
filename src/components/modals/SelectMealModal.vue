<template>
    <b-modal
            id="select-meal-modal"
            ref="selectMealModal"
            size="lg"
            modal-class="select-meal-modal modal-with-buttons"
            centered
            no-close-on-esc
            no-close-on-backdrop
            :return-focus="{}"
            @hidden="onModalHidden"
    >
        <div slot="default" class="position-relative">
            <div class="title-size3 titleGreenNavyColor mb-4 text-center">Select a meal to copy</div>

            <v-select
                    label="id"
                    ref="select"
                    class="custom-vue-select"
                    :filterable="false"
                    :options="options"
                    v-model="selectedMeal"
                    @search="onSearch"
                    @search:focus="onFocusSearch"
            >
                <template #search="{ attributes, events }">
                    <input
                            class="vs__search"
                            v-bind="attributes"
                            v-on="events"
                            :placeholder="selectedMeal && selectedMeal.id ? '' : 'Search by name'"
                    />
                </template>
                <template slot="no-options">
                    No meals matching your criteria.
                </template>
                <template slot="option" slot-scope="option">{{option.name}}</template>
                <template slot="selected-option" slot-scope="option">{{option.name}}</template>
                <template #spinner="{ loading }">
                    <div v-if="loading" style="border-left-color: rgba(0,156,144,0.61)" class="vs__spinner"></div>
                </template>
            </v-select>
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

            <b-btn
                    class="btnGreen btnNormalSize text-uppercase hover-slide-left"
                    :disabled="!selectedMeal || !selectedMeal.id"
                    @click="closeModalWithValue"
            >
                <span>Select</span>
            </b-btn>
        </template>
    </b-modal>
</template>

<script>
import SvgIcon from '../SvgIcon';
import api from '../../api';
export default {
    name: "SelectMealModal",
    components: {SvgIcon},
    data: () => ({
        options: [],
        selectedMeal: null
    }),
    methods: {
        onSearch (search, loading) {
            if (search.length) {
                loading(true);
                this.searchItems(loading, search, this);
            }
        },
        onFocusSearch (search, loading) {
            search = search || this.$refs.select.search;
            loading = loading || this.$refs.select.toggleLoading;
            if (!search || !search.length) {
                loading(true);
                this.loadInitMeals(loading);
            }
        },
        loadInitMeals (loading) {
            const _options = this.$store.getters.mealsOptionsDataToCopy;
            if (_options && _options.length) {
                this.options = _options.map(item => item);
                loading(false);
            } else {
                api.dashboard.meals.getMyMeals(0)
                    .then(result => {
                        if (result && result.data && result.data.length) {
                            this.$store.commit('mealsOptionsDataToCopy', result.data);
                            this.options = result.data.map(item => item);
                            loading(false);
                        } else {
                            this.options = [];
                            loading(false);
                        }
                    })
                    .catch(() => {
                        this.options = [];
                        loading(false);
                    })
            }
        },
        searchItems: _.debounce((loading, search, vm) => {
            api.dashboard.meals.searchMyMeals(search)
                .then(result => {
                    if (result && result.data && result.data.length) {
                        vm.options = result.data.map(item => item);
                        loading(false);
                    } else {
                        vm.options = [];
                        loading(false);
                    }
                })
                .catch(() => {
                    vm.options = [];
                    loading(false);
                });
        }, 350),
        onModalHidden () {
            // need to reset data when modal is hidden
            this.options = [];
            this.selectedMeal = null;
        },
        closeModal () {
            this.$refs.selectMealModal.hide();
        },
        closeModalWithValue () {
            this.closeModal();
            if (this.selectedMeal && this.selectedMeal.id) {
                // redirect to new-meal page
                const { id = '', name = '', description = '', dietaryNotes = [] } = this.selectedMeal;
                this.$store.commit('copiedMealInfo', { id, name, description, dietaryNotes });
                this.$router.push({ path: '/dashboard/cook/new-meal' }).catch(() => {});
            }
        },
        cancel () {
            this.closeModal();
        }
    }
}
</script>

<style scoped>
</style>
