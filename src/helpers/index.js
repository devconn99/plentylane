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
    }
}
