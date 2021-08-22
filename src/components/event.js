import {castTimeFormat, formatTimeEvent, formatTimeDateTime, formatTimeSubtract} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

// const MILLISECONDS_PER_SECOND = 1000;
// const SECONDS_PER_MINUTE = 60;
// const MINUTES_PER_HOUR = 60;
// const HOURS_PER_DAY = 24;

const createOfferMarkup = (offers) => {
  return offers.filter((offer) => offer.isChecked === true).slice(0, 3).map((offer) => {
    const {title, price} = offer;
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
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

// const calculatingDurationEvent = (dateFrom, dateTo) => {
//
//   const durationEventInMilliseconds = dateTo.getTime() - dateFrom.getTime();
//   const durationEventInHours = durationEventInMilliseconds / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE / MINUTES_PER_HOUR;
//   const durationEventInMinutes = durationEventInMilliseconds / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE;
//
//   let durationEvent = ``;
//   const oneHour = 1;
//
//   const durationEventDays = castTimeFormat(Math.floor(durationEventInHours / HOURS_PER_DAY));
//   const durationEventHours = castTimeFormat(Math.floor(durationEventInHours % HOURS_PER_DAY));
//   const durationEventMinutes = castTimeFormat(Math.floor(durationEventInMinutes % 60));
//
//   if (durationEventInHours > HOURS_PER_DAY) {
//     durationEvent = `${durationEventDays}D ${durationEventHours}H ${durationEventMinutes}M`;
//   } else if (durationEventInHours > oneHour) {
//     durationEvent = `${durationEventHours}H ${durationEventMinutes}M`;
//   } else {
//     durationEvent = `${durationEventMinutes}M`;
//   }
//   const durationEventTemp = formatTimeSubtract(dateFrom, dateTo);
//
//   return durationEvent;
// };

const createEventTemplate = (event) => {
  const {type, destination, basePrice, dateFrom, dateTo, offers} = event;
  const typeEvent = `${type.name[0].toUpperCase() + type.name.slice(1)} ${type.type === `transport` ? `to` : `in`}`;
  const dateFromDate = formatTimeEvent(dateFrom);
  const dateFromDateTime = formatTimeDateTime(dateFrom);
  const dateToDate = formatTimeEvent(dateTo);
  const dateToDateTime = formatTimeDateTime(dateTo);
  const duration = formatTimeSubtract(dateFrom, dateTo);
  const offersMarkup = createOffersMarkup(offers);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.name}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeEvent} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFromDateTime}">${dateFromDate}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateToDateTime}">${dateToDate}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${offersMarkup}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
