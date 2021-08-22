// import {MONTH_NAMES} from "../const.js";
import moment from "moment";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const castTimeFormat = (value) => {
  const time = value < 10 ? `0${value}` : String(value);
  return `${time}`;
};

const formatTimeDD = (date) => {
  return moment(date).format(`DD`);
};

const formatTimeMMM = (date) => {
  // const month = MONTH_NAMES[value].slice(0, 3);
  // return `${month}`;
  return moment(date).format(`MMM`);
};

const formatTimeEditEvent = (date) => {
  // const day = castTimeFormat(date.getDate());
  // const month = castTimeFormat(date.getMonth() + 1);
  // const year = castTimeFormat(date.getFullYear() % 100);
  // const hours = castTimeFormat(date.getHours());
  // const minutes = castTimeFormat(date.getMinutes());
  //
  // return `${day}/${month}/${year} ${hours}:${minutes}`;
  return moment(date).format(`DD/MM/YY HH:mm`);
};

const formatTimeEvent = (date) => {
  // const hours = castTimeFormat(date.getHours() % 12);
  // const minutes = castTimeFormat(date.getMinutes());
  //
  // return `${hours}:${minutes}`;
  return moment(date).format(`HH:mm`);
};

const formatTimeDateTime = (date, isOnlyYMD = false) => {
  // const day = castTimeFormat(date.getDate());
  // const month = castTimeFormat(date.getMonth() + 1);
  // const year = castTimeFormat(date.getFullYear());
  // const hours = castTimeFormat(date.getHours());
  // const minutes = castTimeFormat(date.getMinutes());
  //
  // let dateTime = `${year}-${month}-${day}`;
  //
  // if (!isOnlyYMD) {
  //   dateTime += `T${hours}:${minutes}`;
  // }
  let dateTime = ``;

  if (isOnlyYMD) {
    dateTime = moment(date).format(`YYYY-MM-DD`);
  } else {
    dateTime = moment(date).format(`YYYY-MM-DDTHH:mm`);
  }

  return dateTime;
};

const formatTimeMD = (date) => {
  // const day = castTimeFormat(date.getDate());
  // const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  //
  // return `${month} ${day}`;
  return moment(date).format(`MMM DD`);
};

const formatTimeSubtract = (startDate, finalDate) => {
  const startMoment = moment(startDate);
  const finalMoment = moment(finalDate);
  const subtractDates = moment.duration(finalMoment.diff(startMoment));
  let durationEvent;

  const durationEventDays = castTimeFormat(Math.floor(subtractDates.asDays()));
  const durationEventHours = castTimeFormat(Math.floor(subtractDates.asHours() % 24));
  const durationEventMinutes = castTimeFormat(Math.floor(subtractDates.asMinutes() % 60));

  if (durationEventDays >= 1) {
    durationEvent = `${durationEventDays}D ${durationEventHours}H ${durationEventMinutes}M`;
  } else if (durationEventHours >= 1) {
    durationEvent = `${durationEventHours}H ${durationEventMinutes}M`;
  } else {
    durationEvent = `${durationEventMinutes}M`;
  }

  return durationEvent;
};

export {formatTimeDD, formatTimeMMM, formatTimeEditEvent, formatTimeEvent, formatTimeDateTime, formatTimeMD, castTimeFormat, formatTimeSubtract};
