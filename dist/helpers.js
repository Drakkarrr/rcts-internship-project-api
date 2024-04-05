import fs from 'fs';
import currency from 'currency.js';
import moment from 'moment';
export const icon = (name) => {
    try {
        return fs.readFileSync(`./public/images/icons/${name}.svg`);
    }
    catch (error) {
        return null;
    }
};
export const image = (name) => fs.readFileSync(`./public/images/photos/${name}.jpg`);
export const siteName = `ResponsivCode Technology Solutions - Backend`;
export const timeRange = (start, end, format, interval) => {
    if (format === undefined) {
        format = 'HH:mm';
    }
    if (interval === undefined) {
        interval = 60;
    }
    interval = interval > 0 ? interval : 60;
    const range = [];
    let currentMoment = moment(start);
    while (moment(currentMoment).isBefore(moment(end))) {
        range.push(moment(currentMoment).format(format));
        currentMoment = moment(currentMoment).add(interval, 'minutes');
    }
    return range;
};
export const calculate = {
    add: (firstValue, secondValue) => {
        return currency(firstValue).add(secondValue).value;
    },
    sub: (firstValue, secondValue) => {
        return currency(firstValue).subtract(secondValue).value;
    },
    multiply: (firstValue, secondValue) => {
        return currency(firstValue).multiply(secondValue).value;
    },
    divide: (firstValue, secondValue) => {
        return currency(firstValue).divide(secondValue).value;
    },
};
