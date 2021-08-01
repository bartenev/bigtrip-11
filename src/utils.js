import {MONTH_NAMES} from "./const.js";

const castTimeFormat = (value) => {
  const time = value < 10 ? `0${value}` : String(value);
  return `${time}`;
};

const formatTimeEditEvent = (date) => {
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = castTimeFormat(date.getFullYear() % 100);
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatTimeEvent = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatTimeDateTime = (date, isOnlyYMD = false) => {
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = castTimeFormat(date.getFullYear());
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  let dateTime = `${year}-${month}-${day}`;

  if (!isOnlyYMD) {
    dateTime += `T${hours}:${minutes}`;
  }

  return dateTime;
};

const formatTimeMD = (date) => {
  const day = castTimeFormat(date.getDate());
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);

  return `${month} ${day}`;
};

const formatMMM = (value) => {
  const month = MONTH_NAMES[value].slice(0, 3);
  return `${month}`;
};

export {castTimeFormat, formatTimeEditEvent, formatTimeEvent, formatTimeDateTime, formatTimeMD, formatMMM};
