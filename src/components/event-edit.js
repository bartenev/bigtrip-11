import {WAYPOINT_TYPES} from "../const.js";
import {formatTimeEditEvent, createElement} from "../utils.js";

const createEventTypeMarkup = (types, kindOfEventType, currentType) => {
  return types.filter((type) => type.type === kindOfEventType).map((type, index) => {
    const {name, title} = type;
    return (
      `<div class="event__type-item">
        <input id="event-type-${name}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}" ${currentType === type ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-${index}">${title}</label>
      </div>`
    );
  })
    .join(`\n`);
};

const createDestinationMarkup = (cities) => {
  return cities.map((city) => {
    return (
      `<option value="${city}"></option>`
    );
  }).join(`\n`);
};

const createOffersMarkup = (offers) => {
  return offers.map((offer, index) => {
    const {type, name, price, isChecked} = offer;
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index}" type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${type}-${index}">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createPhotosMarkup = (photos) => {
  return photos.map((photo) => {
    const {url, description} = photo;
    return (
      `<img class="event__photo" src="${url}" alt="${description}">`
    );
  }).join(`\n`);
};

const createEventEditTemplate = (event, cities) => {

  const {type, destination, description, photos, price, startTime, finishTime, offers} = event;

  const transportEventTypeMarkup = createEventTypeMarkup(WAYPOINT_TYPES, `transport`, type);
  const placeEventTypeMarkup = createEventTypeMarkup(WAYPOINT_TYPES, `place`, type);
  const destinationMarkup = createDestinationMarkup(cities);
  const offersMarkup = createOffersMarkup(offers);
  const photosMarkup = createPhotosMarkup(photos);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.name}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transportEventTypeMarkup}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${placeEventTypeMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type.title} ${type.type === `transport` ? `to` : `in`}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
          value="${formatTimeEditEvent(startTime)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatTimeEditEvent(finishTime)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photosMarkup};
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class EventEdit {
  constructor(event, cities) {
    this._event = event;
    this._cities = cities;
    this._element = null;
  }

  getTemplate() {
    return createEventEditTemplate(this._event, this._cities);
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
