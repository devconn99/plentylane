<template>
  <div>
    <div class="row pad-70b">
      <div class="col-12">
        <SearchFilters
          @on-filters-changed="onFiltersChanged"
          @on-view-type-changed="onViewTypeChanged"
          :search-str="searchStr"
          :is-submitting="isSubmitting"
        />
      </div>
    </div>

    <div class="row" v-if="showTitle && results && results.length">
      <div class="col-12">
        <div class="dashboard-title-box mb-3 ">
          <div class="title-size3 titleGreenNavyColor mb-3">Meals near you</div>
        </div>
      </div>
    </div>

    <div class="row" v-if="results && results.length && !shouldShowMap">
      <div class="col-sm-6 col-xl-4 mb-4" v-for="(item,i) in results" :key="i">
        <OfferInfoBlock :offer-info="item" />
      </div>
    </div>

    <div class="row search-map-wrapper" v-show="shouldShowMap">
      <div id="map" ref="map" class="map-container"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import MapInfoWindow from './MapInfoWindow';
import OfferInfoBlock from './OfferInfoBlock';
import SearchFilters from './SearchFilters';
import api from '../api';
import helpers from '../helpers';

export default {
  name: "MainSearch",
  components: {SearchFilters, OfferInfoBlock},
  props: ['showTitle'],
  data: () => ({
    searchStr: '',
    results: [],
    isSubmitting: false,
    userCoordinates: {
      lat: '',
      lng: ''
    },
    currentForm: null,
    isMapInitialized: false,
    shouldShowMap: false, // indicates that "Map" tab is selected
    map: null,
    mapMarkers: [],
    mapInfoWindows: {},
    defaultMapZoom: 16,
    _infoWindowComponent: null,
    _infoWindowComponentInstance: null,
    favoriteUsers: []
  }),
  created () {
    this.$eventHub.$on('browser-coordinates', (coordinates, additionalData) => {
      this.userCoordinates.lat = coordinates.lat;
      this.userCoordinates.lng = coordinates.lng;
      api.dashboard.profile.updateUserLocation(coordinates.lng, coordinates.lat).catch(res => {

      });
      this.getFavorites();
      this.handleInitSearch(additionalData);
    });

    this.$eventHub.$on('error-browser-coordinates', (additionalData) => {
      this.handleInitSearch(additionalData);
    });
  },
  mounted () {
    this._infoWindowComponent = Vue.extend(MapInfoWindow);
    this._infoWindowComponentInstance = new this._infoWindowComponent({});
    this._infoWindowComponentInstance.$mount();
    this.$eventHub.$on('marker-info-window_redirect-to-offer', (id) => {
      if (!id) return;
      this.closeInfoWindowById(id);
      this.$router.push({ path: `/dashboard/offers/${id}` }).catch(() => {});
    });
    this.$eventHub.$on('marker-info-window_redirect-to-cook', (id, cookId) => {
      if (!id || !cookId) return;
      this.closeInfoWindowById(id);
      this.$router.push({ path: `/dashboard/cook-profile/${cookId}` }).catch(() => {});
    });
  },
  beforeDestroy () {
    this.$eventHub.$off('browser-coordinates');
    this.$eventHub.$off('error-browser-coordinates');
    this.$eventHub.$off('marker-info-window_redirect-to-offer');
    this.$eventHub.$off('marker-info-window_redirect-to-cook');
    this._infoWindowComponentInstance.$destroy();
    this._infoWindowComponentInstance = null;
    this._infoWindowComponent = null;
    this.closeInfoWindows();
    this.clearMarkers();
    this.map = null;
    this.mapInfoWindows = {};
  },
  methods: {
    handleInitSearch (additionalData) {
      const _form = this.currentForm ? this.currentForm : {};
      let _cb = null;

      if (additionalData) {
        if (additionalData.name && additionalData.name.length) {
          this.searchStr = additionalData.name;
          _form['name'] = additionalData.name;
        }
        if (additionalData.cb) {
          _cb = additionalData.cb;
        }
      }
      this.searchOffers(_form)
        .then(() => {
          if (_cb) _cb();
        })
        .catch(() => {
          if (_cb) _cb();
        });
    },
    getFavorites() {
      api.dashboard.follows.getMyFavorites().then(result => {
        this.favoriteUsers = result.data;
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
      this.$emit('search-started', this.searchStr);
      this.isSubmitting = true;
      if (this.isMapInitialized) {
        this.clearMarkers();
      }
      const { resultQuery, shouldUseLocationEndpoint } = this.prepareRequestFilters(form);

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
      if (result && result.data && result.data.length) {
        this.results = result.data.slice(0);
      } else {
        this.results = [];
      }
      if (this.shouldShowMap) {
        this.addMarkers();
      }
      this.$emit('search-finished', this.results, this.searchStr);
      this.isSubmitting = false;
    },
    searchErrorHandler (error) {
      console.log('\n search error:', error);
      this.$emit('search-finished');
      this.isSubmitting = false;
      if (this.shouldShowMap) {
        // center the map to user's location if available
        this.centerMapToUsersLocation();
      }
    },
    prepareRequestFilters (form) {
      let query = [];
      let resultQuery = [];
      let shouldUseOr = false;
      let fieldPrefix = '';
      let shouldUseLocationEndpoint = false;
      const defaultType = 'filter';
      const currentUserId = localStorage.getItem('plUserId') || this.$store.getters.userId || '';

      if (this.userCoordinates && this.userCoordinates.lat && this.userCoordinates.lng) {
        fieldPrefix = 'offers.';
        shouldUseLocationEndpoint = true;
        const proximity = form['proximity'] ? form['proximity'] : '0,10';
        query.push({
          type: defaultType,
          field: 'location',
          condition: '$between',
          value: `${this.userCoordinates.lat},${this.userCoordinates.lng},${proximity}`
        })
      }
      if (form['date']) {
        const _date = new Date(form['date']);
        _date.setDate(_date.getDate() + 1);
        const _dateEndStr = `${_date.getUTCFullYear()}-${_date.getUTCMonth() + 1}-${_date.getUTCDate()}`;
        query.push({
          type: defaultType,
          field: `${fieldPrefix}pickupTime`,
          condition: '$between',
          value: `${form['date']},${_dateEndStr}`
        });
      } else {
        query.push(this.prepareDefaultPickupTimeFilter(fieldPrefix));
      }
      if (currentUserId) {
        // to exclude current user's offers from the result
        query.push({
          type: defaultType,
          field: 'user.id', // no need to use fieldPrefix there
          condition: '$ne',
          value: currentUserId
        })
      }
      if (form['name'] && form['name'].length) {
        query.push({
          type: defaultType,
          field: `${fieldPrefix}meal.name`,
          condition: '$contL',
          value: form['name']
        });
        shouldUseOr = true;
      }
      if (form['availableServings']) {
        const availableServingToSearch=form['availableServings']
        const availableCriteria=availableServingToSearch>0?availableServingToSearch-1:0
        query.push({
          type: defaultType,
          field: `${fieldPrefix}availableQuantity`,
          condition: '$gt',
          value: availableCriteria
        })
      } else {
        query.push({
          type: defaultType,
          field: `${fieldPrefix}availableQuantity`,
          condition: '$gt',
          value: 0
        })
      }
      /*
      if (form['dietaryNotes'] && form['dietaryNotes'].length) {
        query.push({
          type: defaultType,
          field: `${fieldPrefix}meal.dietaryNotes`,
          condition: '$in',
          value: form['dietaryNotes'].join(',')
        });
      }
      */
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
      return {
        type: 'filter',
        field: `${fieldPrefix}pickupTime`,
        condition: '$gte',
        value: helpers.getStartOfDateFilterStr()
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
      this.centerMapToUsersLocation();
      this.addMarkers();
    },
    centerMapToUsersLocation () {
      if (!this.map || !this.isMapInitialized) return;
      if (this.userCoordinates && this.userCoordinates.lat && this.userCoordinates.lng) {
        this.map.setCenter(new google.maps.LatLng(this.userCoordinates.lat, this.userCoordinates.lng));
      }
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
      if (!this.map) return;
      if (!this.results || !this.results.length) {
        // center the map to user's location if available
        this.centerMapToUsersLocation();
        return;
      }
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

        const markerOffset = 0.00025; // marker's coordinates will be shifted to avoid showing actual address
        const marker = new MarkerWithLabel({
          map: this.map,
          position: { lat: pos.lat + markerOffset, lng: pos.lng + markerOffset },
          ...helpers.getMarkerTemplate(item)
        });
        marker.addListener('click', () => {
          this.markerClickHandler(item, marker);
        });
        this.mapMarkers.push(marker);
      });
      // pan map to the first marker
      setTimeout(() => {
        this.map.panTo(this.mapMarkers[0].position);
      }, 0, false);
      if (this.map.zoom < this.defaultMapZoom) {
        this.map.setZoom(this.defaultMapZoom);
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
    closeInfoWindowById (id) {
      if (!id || !this.mapInfoWindows || !this.mapInfoWindows[id]) return;
      this.mapInfoWindows[id].close();
    },
    closeInfoWindows () {
      const keys = Object.keys(this.mapInfoWindows);
      if (keys && keys.length) {
        for (let key of keys) {
          this.closeInfoWindowById(key);
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../scss/utils/vars";
.search-map-wrapper {
  @media screen and (min-width: $tableMinWidth + 1) {
    margin-left: -30px;
    margin-right: -30px;
  }
  @media screen and (min-width: $desktopBigWidth + 1) {
    margin-left: -80px;
    margin-right: -80px;
  }

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
