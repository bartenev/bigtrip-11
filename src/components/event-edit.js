import {WAYPOINT_TYPES} from "../const.js";
import {formatTimeEditEvent} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createEventTypeMarkup = (types, kindOfEventType, currentType) => {
  return types.filter((type) => type.type === kindOfEventType).map((type, index) => {
    const {name, title} = type;
    const isChecked = currentType === type ? `checked` : ``;
    return (
      `<div class="event__type-item">
        <input id="event-type-${name}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}" ${isChecked}>
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
    const checkedInfo = isChecked ? `checked` : ``;
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index}" type="checkbox" name="event-offer-${type}" ${checkedInfo}>
        <label class="event__offer-label" for="event-offer-${type}-${index}">
          <span class="event__offer-title">${name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createOffersTemplate = (offers) => {
  const offersMarkup = createOffersMarkup(offers);
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersMarkup}
      </div>
    </section>`
  );
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

  const {type, destination, description, photos, price, startTime, finishTime, offers, isFavorite} = event;

  const typeEvent = `${type.title} ${type.type === `transport` ? `to` : `in`}`;
  const transportEventTypeMarkup = createEventTypeMarkup(WAYPOINT_TYPES, `transport`, type);
  const placeEventTypeMarkup = createEventTypeMarkup(WAYPOINT_TYPES, `place`, type);
  const startTimeDate = formatTimeEditEvent(startTime);
  const finishTimeDate = formatTimeEditEvent(finishTime);
  const destinationMarkup = createDestinationMarkup(cities);
  const offersMarkup = offers.length ? createOffersTemplate(offers) : ``;
  const photosMarkup = createPhotosMarkup(photos);
  const favorite = isFavorite ? `checked` : ``;

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
            ${typeEvent}
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
          value="${startTimeDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${finishTimeDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <!-- <button class="event__reset-btn" type="reset">Cancel</button> -->

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favorite}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>

      </header>
      <section class="event__details">
        ${offersMarkup}
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photosMarkup}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class EventEdit extends AbstractComponent {
  constructor(event, cities) {
    super();

    this._event = event;
    this._cities = cities;
  }

  getTemplate() {
    return createEventEditTemplate(this._event, this._cities);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-icon`).addEventListener(`click`, handler);
  }
}
