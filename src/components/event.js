import {formatTimeEvent, formatTimeDateTime, formatTimeSubtract} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createOfferMarkup = (offers) => {
  // return offers.filter((offer) => offer.isChecked === true).slice(0, 3).map((offer) => {
  return offers.slice(0, 3).map((offer) => {
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
