<template>
    <div class="eat-page">
        <p>Eat page goes here...</p>
        <!-- TODO: search component goes here... -->
        <!-- TODO: filters go here... -->
        <!--<div class="filters-container">-->
            <!--<b-form-group>-->
                <!--<b-form-radio-group v-model="selectedType" name="radios-btn-default" buttons>-->
                    <!--<template #first>-->
                        <!--<b-form-radio :value="item.value" v-for="item in typeOptions">-->
                            <!--<i :class="item.iconClasses"></i>-->
                            <!--<span class="pl-2">{{item.text}}</span>-->
                        <!--</b-form-radio>-->
                    <!--</template>-->
                <!--</b-form-radio-group>-->
            <!--</b-form-group>-->
        <!--</div>-->
        <!--<div class="search-result-container">-->
            <!--<p>Meals near you</p>-->
        <!--</div>-->
    </div>
</template>

<script>
import api from '../api';
export default {
    name: "Eat",
    data: () => ({
        searchStr: '',
        selectedType: 'list',
        typeOptions: [
            { text: 'List', value: 'list', iconClasses: 'fas fa-list' },
            { text: 'Map', value: 'map', iconClasses: 'far fa-map' }
        ],
        searchResult: []
    }),
    created () {
    },
    methods: {
        searchOffers () {

        }
    }
}
</script>

<style scoped lang="scss">

</style>
