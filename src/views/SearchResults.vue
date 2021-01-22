<template>
    <div class="dashboard-content">
        <div class="container-fluid position-relative">
            <loading
                    :active.sync="isLoading"
                    :is-full-page="loaderOptions.isFullPage"
                    :color="loaderOptions.color"
            ></loading>
            <div class="row pad-70b">
                <div class="col-12 text-center">
                    <template v-if="queryName && queryName.length && !wasSearched">
                        <div class="title-size3 titleDarkColor mb-3">Results for</div>
                        <h1 class="title-size1 titleDarkColor">“{{queryName}}”</h1>
                    </template>
                    <template v-else-if="wasSearched && !isLoading && results && results.length">
                        <div class="title-size3 titleDarkColor mb-3">
                            {{results.length}} Result{{results.length === 1 ? '' : 's'}} for
                        </div>
                        <h1 class="title-size1 titleDarkColor" v-if="searchStr">“{{searchStr}}”</h1>
                    </template>
                    <template v-else-if="wasSearched && !isLoading && (!results || !results.length)">
                        <div class="title-size3 titleDarkColor mb-3">No results for</div>
                        <h1 class="title-size1 titleDarkColor" v-if="searchStr">“{{searchStr}}”</h1>
                    </template>
                </div>
            </div>

            <div class="row pad-70b">
                <div class="col-12">
                    <SearchFilters @on-filters-changed="onFiltersChanged" :search-str="queryName"></SearchFilters>
                </div>
            </div>

            <div class="row" v-if="!isLoading && results && results.length">
                <div class="col-sm-6 col-xl-4 mb-4" v-for="item in results">
                    <OfferInfoBlock :offer-info="item"></OfferInfoBlock>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchFilters from '../components/SearchFilters';
import Loading from 'vue-loading-overlay';
import OfferInfoBlock from '../components/OfferInfoBlock';
import api from "../api";
export default {
    name: "SearchResults",
    components: {SearchFilters, Loading, OfferInfoBlock},
    data: () => ({
        queryName: '',
        searchStr: '',
        isLoading: false,
        results: [],
        loaderOptions: {
            color: '#009C90',
            isFullPage: false
        },
        wasSearched: false,
        userCoordinates: {
            lat: '',
            lng: ''
        }
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const { name = '' } = vm.$route.query;
            vm.queryName = name;
            vm.initPage();
        });
    },
    beforeRouteUpdate (to, from, next) {
        next(() => {
            const { name = '' } = this.$route.query;
            this.queryName = name;
            this.initPage();
        });
    },
    methods: {
        getUserLocation () {
            let vm = this;
            const _options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            function _successHandler (pos) {
                const crd = pos.coords;
                vm.userCoordinates.lat = crd.latitude;
                vm.userCoordinates.lng = crd.longitude;
                console.log('\n >> vm.userCoordinates > ', vm.userCoordinates)
            }
            function _errorHandler (err) {
                console.log('\n >> err get location > ', err);
            }
            navigator.geolocation.getCurrentPosition(_successHandler, _errorHandler, _options);
        },
        clearPageData () {
            this.searchStr = '';
            this.results = [];
            this.userCoordinates.lat = '';
            this.userCoordinates.lng = '';
            this.isLoading = false;
            this.wasSearched = false;
        },
        initPage () {
            this.clearPageData();
            this.getUserLocation();
            if (this.queryName && this.queryName.length) {
                // TODO: get data
                this.searchStr = this.queryName;
                this.searchOffers({ name: this.queryName });
            }
        },
        onFiltersChanged (model) {
            console.log('\n >> model > ', model);
            this.searchStr = model['name'] || '';
            this.searchOffers(model);
        },
        searchOffers (form) {
            this.isLoading = true;
            let query = [];
            let resultQuery = [];
            let shouldUseOr = false;
            // ?s={"$and": [{"isActive": true}, {"createdAt": {"$ne": "2008-10-01T17:04:32"}}]}
            // let _queryStr = '?s={'
            if (form['date']) {
                const _date = new Date(form['date']);
                _date.setDate(_date.getDate() + 1);
                const _dateEndStr = `${_date.getUTCFullYear()}-${_date.getUTCMonth() + 1}-${_date.getUTCDate()}`;
                query.push({
                    type: 'filter',
                    field: 'pickupTime',
                    condition: '$between',
                    value: `${form['date']},${_dateEndStr}`
                });
            }
            if (form['proximity']) {
                // TODO
                const _item = {
                    type: 'filter',
                    field: 'location',
                    condition: '$between',
                    value: `${this.userCoordinates.lat},${this.userCoordinates.lng},${form['proximity']}`
                };
                if (this.userCoordinates && this.userCoordinates.lat && this.userCoordinates.lng) {
                    // query.push({_item});
                    // temp
                    // TODO: send other queries to search by name/desc, pickupTime too
                    return api.dashboard.places.getPlacesByLocation(_item)
                        .then(result => {
                            console.log('\n >> result > ', result);
                            if (result && result.data && result.data.length) {
                                // TODO: parse result
                                const _offers = [];
                                result.data.forEach(place => {
                                    if (place.offers && place.offers.length) {
                                        place.offers.forEach(offer => {
                                            _offers.push({ ...offer, place: place });
                                        })
                                    }
                                });
                                if (_offers && _offers.length) {
                                    this.results = _offers.slice(0);
                                } else {
                                    this.results = [];
                                }
                            } else {
                                this.results = [];
                            }
                            this.isLoading = false;
                        })
                        .catch(err => {
                            this.searchErrorHandler(err);
                        })
                } else {
                    console.log('undefined location');
                    this.isLoading = false;
                    return;
                }
            }
            if (form['name'] && form['name'].length) {
                query.push({ type: 'filter', field: 'meal.name', condition: '$contL', value: form['name'] });
                shouldUseOr = true;
            }
            resultQuery = query;
            if (query.length && shouldUseOr) {
                query.forEach(item => {
                    resultQuery.push({
                        type: 'or',
                        field: item.field !== 'meal.name' ? item.field : 'meal.description',
                        condition: item.condition,
                        value: item.value
                    });
                })
            }
            api.dashboard.offers.getOffers(resultQuery)
                .then(result => {
                    this.searchSuccessHandler(result);
                })
                .catch(err => {
                    this.searchErrorHandler(err);
                });
        },
        searchSuccessHandler (result) {
            console.log('\n >> result > ', result);
            if (result && result.data && result.data.length) {
                this.results = result.data.slice(0);
            } else {
                this.results = [];
            }
            this.isLoading = false;
            this.wasSearched = true;
        },
        searchErrorHandler (error) {
            console.log('\n >> error > ', error);
            this.isLoading = false;
            this.wasSearched = true;
        }
    }
}
</script>

<style scoped lang="scss">
.search-results-page {
    position: relative;
}
</style>
