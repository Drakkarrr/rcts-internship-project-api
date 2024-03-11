import fs from 'fs';
import currency from 'currency.js';
import moment from 'moment';

export const icon = (name: string): Buffer | null => {
  try {
    return fs.readFileSync(`./public/images/icons/${name}.svg`);
  } catch (error) {
    return null;
  }
};

export const image = (name: string): Buffer =>
  fs.readFileSync(`./public/images/photos/${name}.jpg`);

export const siteName: string = `Express.js / MongoBD / Rest Api`;

export const timeRange = (
  start: moment.MomentInput,
  end: moment.MomentInput,
  format?: string,
  interval?: number
): string[] => {
  if (format === undefined) {
    format = 'HH:mm';
  }

  if (interval === undefined) {
    interval = 60;
  }
  interval = interval > 0 ? interval : 60;

  const range: string[] = [];
  let currentMoment = moment(start);

  while (moment(currentMoment).isBefore(moment(end))) {
    range.push(moment(currentMoment).format(format));
    currentMoment = moment(currentMoment).add(interval, 'minutes');
  }
  return range;
};

export const calculate = {
  add: (firstValue: string | number, secondValue: string | number): string | number => {
    return currency(firstValue).add(secondValue).value;
  },
  sub: (firstValue: string | number, secondValue: string | number): string | number => {
    return currency(firstValue).subtract(secondValue).value;
  },
  multiply: (firstValue: string | number, secondValue: string | number): string | number => {
    return currency(firstValue).multiply(secondValue).value;
  },
  divide: (firstValue: string | number, secondValue: string | number): string | number => {
    return currency(firstValue).divide(secondValue).value;
  },
};
