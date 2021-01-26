<template>
    <div class="dashboard-content search-page">
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
                    <SearchFilters
                            @on-filters-changed="onFiltersChanged"
                            @on-view-type-changed="onViewTypeChanged"
                            :search-str="queryName"
                    ></SearchFilters>
                </div>
            </div>

            <div class="row" v-if="!isLoading && results && results.length && !shouldShowMap">
                <div class="col-sm-6 col-xl-4 mb-4" v-for="item in results">
                    <OfferInfoBlock :offer-info="item"></OfferInfoBlock>
                </div>
            </div>

            <div class="row search-map-wrapper" v-show="shouldShowMap">
                <div id="map" ref="map" class="map-container"></div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchFilters from '../components/SearchFilters';
import Loading from 'vue-loading-overlay';
import OfferInfoBlock from '../components/OfferInfoBlock';
import api from "../api";
import MyMealInfo from '../components/MyMealInfo';
import Vue from 'vue';
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
        },
        currentForm: null,
        isMapInitialized: false,
        shouldShowMap: false,
        map: null,
        mapMarkers: [],
        mapInfoWindows: {},
        defaultMapZoom: 16,
        _infoWindowComponent: null,
        _infoWindowComponentInstance: null
    }),
    beforeRouteEnter (to, from, next) {
        next(vm => {
            const { name = '' } = to.query;
            vm.queryName = name;
            vm.initPage();
        });
    },
    beforeRouteUpdate (to, from, next) {
        const { name = '' } = to.query;
        this.queryName = name;
        this.initPage(next);
    },
    mounted () {
        this.$eventHub.$on('browser-coordinates', (crd) => {
            this.userCoordinates.lat = crd.lat;
            this.userCoordinates.lng = crd.lng;
        });
        this._infoWindowComponent = Vue.extend(MyMealInfo);
        this._infoWindowComponentInstance = new this._infoWindowComponent({});
        this._infoWindowComponentInstance.$mount();
    },
    beforeDestroy () {
        this.$eventHub.$off('browser-coordinates');
    },
    methods: {
        prepareBrowserLocation () {
            const crd = this.$store.getters.browserCoordinates;
            if (crd && crd.lat && crd.lng) {
                this.userCoordinates.lat = crd.lat;
                this.userCoordinates.lng = crd.lng;
            }
        },
        clearPageData () {
            this.searchStr = '';
            this.results = [];
            this.userCoordinates.lat = '';
            this.userCoordinates.lng = '';
            this.isLoading = false;
            this.wasSearched = false;
            this.currentForm = null;
            this.isMapInitialized = false; // temp
            this.shouldShowMap = false; // temp
            // TODO: destroy map, remove map handlers, marker handlers
            this.clearMarkers();
            this.map = null;
        },
        initPage (cb) {
            this.clearPageData();
            this.prepareBrowserLocation();
            if (this.queryName && this.queryName.length) {
                this.searchStr = this.queryName;
            }
            this.searchOffers({ name: this.searchStr || '' })
                .then(() => {
                    if (cb) cb();
                })
                .catch(() => {
                    if (cb) cb();
                });
        },
        onFiltersChanged (model) {
            this.searchStr = model['name'] || '';
            this.currentForm = { ...model };
            this.searchOffers(model);
        },
        onViewTypeChanged (viewType) {
            if (viewType === 'map') {
                this.shouldShowMap = true;
                if (!this.isMapInitialized) {
                    this.initMap();
                } else if (!this.mapMarkers || !this.mapMarkers.length) {
                    this.addMarkers();
                }
            } else {
                this.shouldShowMap = false;
            }
        },
        searchOffers (form) {
            this.isLoading = true;
            if (this.isMapInitialized) {
                this.clearMarkers();
            }
            const { resultQuery, shouldUseLocationEndpoint }= this.prepareRequestFilters(form);

            if (shouldUseLocationEndpoint) {
                return this.getPlacesByLocation(resultQuery);
            }
            return this.getOffersByQuery(resultQuery);
        },
        getPlacesByLocation (query) {
            return api.dashboard.places.getPlacesByLocation(query)
                .then(result => {
                    const _offers = [];
                    if (result && result.data && result.data.length) {
                        result.data.forEach(place => {
                            if (place.offers && place.offers.length) {
                                place.offers.forEach(offer => {
                                    _offers.push({ ...offer, place: place, user: { ...place.user } });
                                })
                            }
                        });
                    }
                    return this.searchSuccessHandler({ data: _offers });
                })
                .catch(err => {
                    return this.searchErrorHandler(err);
                })
        },
        getOffersByQuery (query) {
            return api.dashboard.offers.getOffers(query)
                .then(result => {
                    return this.searchSuccessHandler(result);
                })
                .catch(err => {
                    return this.searchErrorHandler(err);
                });
        },
        searchSuccessHandler (result) {
            console.log('\n >> result > ', result);
            if (result && result.data && result.data.length) {
                this.results = result.data.slice(0);
            } else {
                this.results = [];
            }
            if (this.shouldShowMap) {
                this.addMarkers();
            }
            this.isLoading = false;
            this.wasSearched = true;
        },
        searchErrorHandler (error) {
            console.log('\n >> error > ', error);
            this.isLoading = false;
            this.wasSearched = true;
        },
        prepareRequestFilters (form) {
            let query = [];
            let resultQuery = [];
            let shouldUseOr = false;
            let fieldPrefix = '';
            let shouldUseLocationEndpoint = false;

            if (form['proximity'] && this.userCoordinates && this.userCoordinates.lat && this.userCoordinates.lng) {
                fieldPrefix = 'offers.';
                shouldUseLocationEndpoint = true;
                query.push({
                    type: 'filter',
                    field: 'location',
                    condition: '$between',
                    value: `${this.userCoordinates.lat},${this.userCoordinates.lng},${form['proximity']}`
                })
            }
            if (form['date']) {
                const _date = new Date(form['date']);
                _date.setDate(_date.getDate() + 1);
                const _dateEndStr = `${_date.getUTCFullYear()}-${_date.getUTCMonth() + 1}-${_date.getUTCDate()}`;
                query.push({
                    type: 'filter',
                    field: `${fieldPrefix}pickupTime`,
                    condition: '$between',
                    value: `${form['date']},${_dateEndStr}`
                });
            } else {
                query.push(this.prepareDefaultPickupTimeFilter(fieldPrefix));
            }
            if (form['name'] && form['name'].length) {
                query.push({ type: 'filter', field: `${fieldPrefix}meal.name`, condition: '$contL', value: form['name'] });
                shouldUseOr = true;
            }
            resultQuery = query;
            if (query.length && shouldUseOr) {
                query.forEach(item => {
                    resultQuery.push({
                        type: 'or',
                        field: !item.field.includes('meal.name') ? item.field : `${fieldPrefix}meal.description`,
                        condition: item.condition,
                        value: item.value
                    });
                })
            }
            return { resultQuery, shouldUseLocationEndpoint };
        },
        prepareDefaultPickupTimeFilter (fieldPrefix) {
            if (!fieldPrefix || !fieldPrefix.length) {
                fieldPrefix = '';
            } else if (!fieldPrefix.endsWith('.')) {
                fieldPrefix += '.';
            }
            const _dateToday = new Date();
            const dateStartStr = `${_dateToday.getUTCFullYear()}-${_dateToday.getUTCMonth() + 1}-${_dateToday.getUTCDate()}`;
            const dateEnd = new Date(_dateToday.setDate(_dateToday.getDate() + 60)); // today + 60 days
            const dateEndStr = `${dateEnd.getUTCFullYear()}-${dateEnd.getUTCMonth() + 1}-${dateEnd.getUTCDate()}`;
            return {
                type: 'filter',
                field: `${fieldPrefix}pickupTime`,
                condition: '$between',
                value: `${dateStartStr},${dateEndStr}`
            }
        },
        initMap () {
            const options = {
                center: { lat: 34.0802619, lng: -118.2628157 }, // temp center
                zoom: this.defaultMapZoom,
                disableDefaultUI: true
            };
            if (this.userCoordinates && this.userCoordinates.lat && this.userCoordinates.lng) {
                options['center'] = {
                    lat: this.userCoordinates.lat,
                    lng: this.userCoordinates.lng
                };
            }
            this.map = new window.google.maps.Map(this.$refs['map'], options);
            this.map.addListener('click', () => {
                this.closeInfoWindows();
            });
            this.isMapInitialized = true;
            this.addMarkers();
        },
        clearMarkers () {
            if (this.mapMarkers && this.mapMarkers.length) {
                this.mapMarkers.forEach(marker => {
                    marker.setMap(null);
                });
                this.mapMarkers = [];
            }
        },
        addMarkers () {
            if (!this.map || !this.results || !this.results.length) return;
            let hasMarkersCollision = false;
            this.results.forEach(item => {
                const pos = {
                    lat: item.place.location.coordinates[0],
                    lng: item.place.location.coordinates[1]
                };
                if (this.isMarkerWithSameCoordinatesExist(pos.lat, pos.lng)) {
                    // marker with current lat/lng already exists => apply a small multiplier to current coordinates
                    hasMarkersCollision = true;
                    const min = .999999;
                    const max = 1.000001;
                    pos.lat = pos.lat * (Math.random() * (max - min) + min);
                    pos.lng = pos.lng * (Math.random() * (max - min) + min);
                }
                let marker = new window.google.maps.Marker({
                    position: { ...pos },
                    map: this.map
                });
                marker.addListener('click', () => {
                    this.markerClickHandler(item, marker);
                });
                this.mapMarkers.push(marker);
            });
            // temp -> pan map to the first marker
            if (!this.userCoordinates || !this.userCoordinates.lat || !this.userCoordinates.lng) {
                this.map.panTo(this.mapMarkers[0].position);
                if (this.map.zoom < this.defaultMapZoom) {
                    this.map.setZoom(this.defaultMapZoom);
                }
            }
            if (hasMarkersCollision) {
                this.map.setZoom(18);
            }
        },
        isMarkerWithSameCoordinatesExist (lat, lng) {
            if (!this.mapMarkers || !this.mapMarkers.length) return false;
            const _found = this.mapMarkers.find(marker => {
                return marker.position.lat() === lat && marker.position.lng() === lng;
            });
            return !!_found;
        },
        markerClickHandler (data, marker) {
            if (!this.map) return;
            this.closeInfoWindows();
            this._infoWindowComponentInstance._props['itemData'] = data;
            this._infoWindowComponentInstance._props['isMapInfoWindow'] = true;
            if (!this.mapInfoWindows[data.id]) {
                this.$nextTick(() => {
                    this.mapInfoWindows[data.id] = new google.maps.InfoWindow({
                        content: this._infoWindowComponentInstance.$el,
                    });
                    this.mapInfoWindows[data.id].open(this.map, marker);
                });
            } else {
                this.mapInfoWindows[data.id].open(this.map, marker);
            }
        },
        closeInfoWindows () {
            const keys = Object.keys(this.mapInfoWindows);
            if (keys && keys.length) {
                for (let key of keys) {
                    if (this.mapInfoWindows[key]) {
                        this.mapInfoWindows[key].close();
                    }
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.search-page {
    &.dashboard-content {
        padding-bottom: 0 !important;
    }
}
.search-map-wrapper {
    // temp
    margin-left: -30px;
    margin-right: -30px;

    .map-container {
        width: 100%;
        height: 600px;
        position: relative;

        &:before {
            content: '';
            height: 11px;
            background: linear-gradient(0deg, #4E4646 0%, rgba(24,24,22,0) 99.94%);
            width: 100%;
            top: 0;
            left: 0;
            position: absolute;
            z-index: 1000;
            opacity: 0.14;
            transform: rotate(-180deg);
        }
    }
}
</style>
