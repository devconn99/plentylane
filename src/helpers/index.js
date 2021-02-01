const DIETARY_NOTES = {
    DAIRY: 'Contains dairy',
    TREE_NUTS: 'Contains tree nuts',
    SHELLFISH: 'Contains shellfish',
    VEGETARIAN: 'Vegetarian',
    GLUTEN_FREE: 'Gluten free',
    EGGS: 'Contains eggs',
    PEANUTS: 'Contains peanuts',
    FISH: 'Contains fish',
    VEGAN: 'Vegan'
};
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
            <div class="marker-label-container">
                <div class="marker-label-line"></div>
                <div class="marker-label-text-wrapper">
                    <span class="marker-label-available-num ${classNameTextAvailable}">${item.availableQuantity}</span>
                    <span class="marker-label-total-num ${classNameTextTotal}">${item.quantity}</span>
                </div>
            </div>
        `;
        const markerIcon = {
            path: 'M 0 -66 C 7.1888 -65.9916 13.6965 -63.0419 18.409 -58.2752 C 23.1174 -53.5127 26.0333 -46.936 26.0424 -39.6685 C 25.9554 -22 8.5476 -5.6884 3.1677 -1.1576 C 2.2488 -0.3855 1.123 0 -0.0024 0 C -1.1279 0 -2.2537 -0.3855 -3.1728 -1.1578 C -8.5601 -5.688 -26.0446 -21.8847 -26.0446 -39.667 C -26.0363 -46.9338 -23.1206 -53.5112 -18.4122 -58.2742 C -13.6997 -63.0415 -7.1915 -65.9916 0 -66 Z',
            fillColor: "#009C90",
            fillOpacity: 1,
            scale: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
            anchor: new google.maps.Point(0, 0)
        };
        return {
            icon: markerIcon,
            labelContent: markerLabelTemplate,
            labelAnchor: new google.maps.Point(19, 59),
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
    }
}
