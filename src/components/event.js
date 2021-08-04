import {castTimeFormat, formatTimeEvent, formatTimeDateTime, createElement} from "../utils.js";

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const createOfferMarkup = (offers) => {
  return offers.filter((offer) => offer.isChecked === true).slice(0, 3).map((offer) => {
    const {name, price} = offer;
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
       </li>`
    );
  }).join(`\n`);
};

const createOffersMarkup = (offers) => {
  if (offers.length > 0) {
    const offersMarkup = createOfferMarkup(offers);
    return (
      `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersMarkup}
      </ul>`
    );
  } else {
    return ``;
  }
};

const calculatingDurationEvent = (startTime, finishTime) => {

  const durationEventInMilliseconds = finishTime.getTime() - startTime.getTime();
  const durationEventInHours = durationEventInMilliseconds / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE / MINUTES_PER_HOUR;
  const durationEventInMinutes = durationEventInMilliseconds / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE;

  let durationEvent = ``;
  const oneHour = 1;

  const durationEventDays = castTimeFormat(Math.floor(durationEventInHours / HOURS_PER_DAY));
  const durationEventHours = castTimeFormat(Math.floor(durationEventInHours % HOURS_PER_DAY));
  const durationEventMinutes = castTimeFormat(Math.floor(durationEventInMinutes % 60));

  if (durationEventInHours > HOURS_PER_DAY) {
    durationEvent = `${durationEventDays}D ${durationEventHours}H ${durationEventMinutes}M`;
  } else if (durationEventInHours > oneHour) {
    durationEvent = `${durationEventHours}H ${durationEventMinutes}M`;
  } else {
    durationEvent = `${durationEventMinutes}M`;
  }

  return durationEvent;
};

const createEventTemplate = (event) => {
  const {type, destination, price, startTime, finishTime, offers} = event;
  const typeEvent = `${type.title} ${type.type === `transport` ? `to` : `in`}`;
  const startTimeDate = formatTimeEvent(startTime);
  const startTimeDateTime = formatTimeDateTime(startTime);
  const finishTimeDate = formatTimeEvent(finishTime);
  const finishTimeDateTime = formatTimeDateTime(finishTime);
  const duration = calculatingDurationEvent(startTime, finishTime);
  const offersMarkup = createOffersMarkup(offers);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.name}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeEvent} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTimeDateTime}">${startTimeDate}</time>
            &mdash;
            <time class="event__end-time" datetime="${finishTimeDateTime}">${finishTimeDate}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        ${offersMarkup}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
