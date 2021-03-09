import config from '../config';
const DIETARY_NOTES = { ...config.DIETARY_NOTES };

export default {
    parseDate: function (inputDateStr, shouldCompareWithToday) {
        // should return date str in format: 5-6pm Tues, Feb. 1
        const date = new Date(inputDateStr);
        const today = new Date();
        let isToday = false;
        if (shouldCompareWithToday) {
            if (today.getUTCFullYear() === date.getUTCFullYear() && today.getUTCMonth() === date.getUTCMonth() && today.getUTCDate() === date.getUTCDate()) {
                isToday = true;
            }
        }
        const weekdayName = date.toLocaleDateString('en', { weekday: 'short' });
        const monthName = date.toLocaleDateString('en', { month: 'short' });
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const minutesStr = (`0${minutes}`).slice(-2);
        const isPM = hours >= 12;
        // temp time str
        let timeStr = '';
        const ampm = isPM ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        if (minutes === 0) {
            timeStr = `${hours}${ampm}`;
        } else {
            timeStr = `${hours}:${minutesStr}${ampm}`;
        }
        if (isToday) {
            return `${timeStr} today`;
        }
        return `${timeStr} ${weekdayName}, ${monthName}. ${date.getUTCDate()}`;
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
        const today = new Date();
        let isToday = false;
        if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate()) {
            isToday = true;
        }
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
        const today = new Date();
        let isToday = false;
        if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate()) {
            isToday = true;
        }
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
    userNameWithShortLastName: function (userInfo) {
        if (!userInfo || !userInfo.firstName) return ``;
        const lastName = userInfo.lastName && userInfo.lastName.length ? userInfo.lastName : userInfo.fullName.split(' ')[1];
        return `${userInfo.firstName} ${lastName.slice(0, 1)}.`;
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
    getMarkerTemplate (item) {
        const classNameTextAvailable = `num-of-symbols_${item.availableQuantity.toString().length}`;
        const classNameTextTotal = `num-of-symbols_${item.quantity.toString().length}`;

        const markerLabelTemplate = `
            <div class="marker-icon-holder"></div>
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
        let _dateObj;
        if (!str || !str.length) {
            _dateObj = new Date();
        } else {
            _dateObj = new Date(str);
        }
        const _month = (`0${_dateObj.getUTCMonth() + 1}`).slice(-2);
        const _day = (`0${_dateObj.getUTCDate()}`).slice(-2);
        return `${_dateObj.getUTCFullYear()}-${_month}-${_day}T00:00:00.000Z`;
    },
    capitalizeFirstLetter(string) {
        if (!string) return '';
        return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
    },
    convertCurrency (value) {
        if (isNaN(value)) return '$0.00';
        const val = (value/1).toFixed(2).replace('.', ',');
        return `$${val.toString().replace(/B(?=(d{3})+(?!d))/g, ".")}`;
    },
    convertQuestionsDataResponse (responseData) {
        return responseData.map(item => this.convertQuestion(item));
    },
    convertQuestion (question) {
        const _date = new Date(question.createdAt);
        question['createdAtDisplayDate'] = `${_date.toLocaleDateString('en', { month: 'short' })} ${_date.getUTCDate()}`;
        if (question.askedBy && question.askedBy.id) {
            question.askedBy['displayName'] = this.userNameWithShortLastName(question.askedBy);
        }
        return question;
    }
}
