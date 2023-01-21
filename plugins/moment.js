import Vue from 'vue'
import moment from 'moment';
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).local().format('MM/DD/YYYY hh:mm');
  }
});

Vue.filter('formatDateOnly', function(value) {
  if (value) {
    return moment(String(value)).local().format('MM/DD/YYYY')
  }
});