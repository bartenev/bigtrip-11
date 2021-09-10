import moment from "moment";

const castTimeFormat = (value) => {
  const time = value < 10 ? `0${value}` : String(value);
  return `${time}`;
};

const formatTimeDD = (date) => {
  return moment(date).format(`DD`);
};

const formatTimeMMM = (date) => {
  return moment(date).format(`MMM`);
};

const formatTimeEditEvent = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

const formatTimeEvent = (date) => {
  return moment(date).format(`HH:mm`);
};

const formatTimeDateTime = (date, isOnlyYMD = false) => {
  let dateTime = ``;

  if (isOnlyYMD) {
    dateTime = moment(date).format(`YYYY-MM-DD`);
  } else {
    dateTime = moment(date).format(`YYYY-MM-DDTHH:mm`);
  }

  return dateTime;
};

const formatTimeMD = (date) => {
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

const parseDate = (date) => {
  const splitDate = date.replace(/[ :]/g, `/`).split(`/`);

  const day = splitDate[0];
  const month = splitDate[1];
  const year = `20` + splitDate[2];
  const hours = splitDate[3];
  const minutes = splitDate[4];

  return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
};

export {formatTimeDD, formatTimeMMM, formatTimeEditEvent, formatTimeEvent, formatTimeDateTime, formatTimeMD, castTimeFormat, formatTimeSubtract, parseDate};
