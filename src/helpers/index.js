import moment from 'moment';
import config from '../config';
const DIETARY_NOTES = { ...config.DIETARY_NOTES };

export default {
  parseDate: function (inputDateStr, shouldCompareWithToday) {
    // should return date str in format: 5-6pm Tues, Feb. 1
    const date = new Date(inputDateStr);
    const pickupTime = moment(date).local()
    const now = moment().local();
    const isToday = shouldCompareWithToday && pickupTime.isSame(now,'date');

    if (isToday) {
      const timeStr = moment(inputDateStr).local().format('hh:mma');
      return `${timeStr} today`;
    }

    return  moment(inputDateStr).local().format('hh:mma ddd, MMM, DD');
  },
  parseMessageDate: function (inputDateStr) {
    // NOTE, time will be converted to local format, not UTC
    if (typeof inputDateStr === 'string' && inputDateStr.slice(-1) === 'Z') {
      const _split = inputDateStr.split(':');
      if (_split && _split[3]) {
        inputDateStr = inputDateStr.replace(`:${_split[3]}`, '');
      }
    }
    const date = new Date(inputDateStr);
    const pickupTime = moment(date).local();
    const now = moment().local();
    const isToday = pickupTime.isSame(now,'date');
    const monthName = date.toLocaleDateString('en', { month: 'short' });
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const minutesStr = (`0${minutes}`).slice(-2);
    const isPM = hours >= 12;
    const ampm = isPM ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const timeStr = `${hours}:${minutesStr}${ampm}`;
    return `${isToday ? 'today': `${monthName} ${day}`}, ${timeStr}`;
  },
  parseNewMessageDate (inputDateStr) {
    const date = new Date(inputDateStr);
    const pickupTime = moment(date).local();
    const now = moment().local();
    const isToday = pickupTime.isSame(now,'date');
    const monthName = date.toLocaleDateString('en', { month: 'short' });
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const minutesStr = (`0${minutes}`).slice(-2);
    const isPM = hours >= 12;
    // temp time str
    let timeStr = '';
    const ampm = isPM ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    timeStr = `${hours}:${minutesStr}${ampm}`;
    return `${isToday ? 'today': `${monthName} ${day}`}, ${timeStr}`;
  },
  retrieveDietaryNotes: function (data) {
    const notes = { ...DIETARY_NOTES };
    return data.map(item => {
      const textLabel = notes[item.label];
      return { label: item.label, text: textLabel, value: item.label };
    });
  },
  prepareDietaryNotesCheckboxOptions: function () {
    const notes = { ...DIETARY_NOTES };
    const options = [];
    for (let key of Object.keys(notes)) {
      if (key && notes[key]) {
        options.push({ value: key, text: notes[key] })
      }
    }
    return options;
  },
  getMarkerTemplate(item, isFavorite) {
    const classNameTextAvailable = `num-of-symbols_${item.availableQuantity.toString().length}`;
    const classNameTextTotal = `num-of-symbols_${item.quantity.toString().length}`;
    const markerClass = isFavorite ? "favorite-marker-icon-holder" : "marker-icon-holder";

    const markerLabelTemplate = `
      <div class=${markerClass}></div>
      <div class="marker-label-holder">
        <div class="marker-label-container">
          <div class="marker-label-line"></div>
          <div class="marker-label-text-wrapper">
            <span class="marker-label-available-num ${classNameTextAvailable}">${item.availableQuantity}</span>
            <span class="marker-label-total-num ${classNameTextTotal}">${item.quantity}</span>
          </div>
        </div>
      </div>
    `;
    // NOTE, markerIcon should be transparent, visible marker + label is inside .marker-label-wrapper
    const markerIcon = {
      path: 'M 0 -66 C 7.1888 -65.9916 13.6965 -63.0419 18.409 -58.2752 C 23.1174 -53.5127 26.0333 -46.936 26.0424 -39.6685 C 25.9554 -22 8.5476 -5.6884 3.1677 -1.1576 C 2.2488 -0.3855 1.123 0 -0.0024 0 C -1.1279 0 -2.2537 -0.3855 -3.1728 -1.1578 C -8.5601 -5.688 -26.0446 -21.8847 -26.0446 -39.667 C -26.0363 -46.9338 -23.1206 -53.5112 -18.4122 -58.2742 C -13.6997 -63.0415 -7.1915 -65.9916 0 -66 Z',
      fillColor: "transparent",
      fillOpacity: 1,
      scale: 1,
      strokeColor: "transparent",
      strokeWeight: 2,
      anchor: new google.maps.Point(0, 0)
    };
    return {
      icon: markerIcon,
      labelContent: markerLabelTemplate,
      labelAnchor: new google.maps.Point(28, 68),
      labelClass: "marker-label-wrapper",
      labelInBackground: true
    }
  },
  getStartOfDateFilterStr (str) {
    return moment(str).format("YYYY-MM-DDTHH:mm:ss");
  },
  capitalizeFirstLetter(string) {
    if (!string) return '';
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
  },
  convertCurrency (value) {
    if (isNaN(value)) return '$0.00';
    const val = (value/1).toFixed(2);
    return `$${val.toString().replace(/B(?=(d{3})+(?!d))/g, ".")}`;
  },
  convertQuestionsDataResponse (responseData, sorting) {
    responseData = responseData.map(item => this.convertQuestion(item));
    if (sorting && sorting.key) {
      switch (sorting.key) {
        case 'createdAt':
          responseData.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            if (sorting.isDesc) {
              if (dateA > dateB) return -1;
              if (dateA < dateB) return 1;
              return 0;
            } else {
              if (dateA > dateB) return 1;
              if (dateA < dateB) return -1;
              return 0;
            }
          });
          break;
        case 'question':
          responseData.sort((a, b) => {
            if (sorting.isDesc) {
              if (a.question > b.question) return -1;
              if (a.question < b.question) return 1;
              return 0;
            } else {
              if (a.question > b.question) return 1;
              if (a.question < b.question) return -1;
              return 0;
            }
          });
          break;
        default:
          break;
      }
    }
    return responseData;
  },
  convertQuestion (question) {
    const _date = new Date(question.createdAt);
    question['createdAtDisplayDate'] = `${_date.toLocaleDateString('en', { month: 'short' })} ${_date.getUTCDate()}`;
    return question;
  },
  parseDateForTokensTable (inputDateStr) {
    return moment(inputDateStr).local().format("MM/DD/YYYY hh:mm A");
  }
}
