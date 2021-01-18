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
    }
}
