import {WAYPOINT_TYPES} from "../const.js";
import {formatTimeEditEvent, parseDate} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {Mode as EventControllerMode} from "../controllers/event";

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
  cancelButtonText: `Cancel`,
};

const createEventTypeMarkup = (types, kindOfEventType, currentType, id) => {
  return types.filter((type) => type.type === kindOfEventType).map((type) => {
    const {name} = type;
    const isChecked = currentType === type ? `checked` : ``;
    return (
      `<div class="event__type-item">
        <input id="event-type-${name}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}" ${isChecked}>
        <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-${id}">${type.name[0].toUpperCase() + type.name.slice(1)}</label>
      </div>`
    );
  })
    .join(`\n`);
};

const createDestinationMarkup = (destinations) => {
  return destinations.map((destination) => {
    return (
      `<option value="${destination.name}"></option>`
    );
  }).join(`\n`);
};

const createOffersMarkup = (offers, allOffers, id) => {
  return allOffers.map((offer) => {
    const {title, price} = offer;
    const type = title.toLowerCase().replace(/ /g, `-`);
    let checkedInfo = ``;
    if (offers) {
      checkedInfo = offers.findIndex((currentOffer) => currentOffer.title === offer.title) !== -1 ? `checked` : ``;
    }
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
        id="event-offer-${type}-${id}"
        type="checkbox"
        name="event-offer-${type}"
        value="${title}"
        ${checkedInfo}>
        <label class="event__offer-label" for="event-offer-${type}-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);
};

const createOffersTemplate = (offers, allOffers, id) => {
  const offersMarkup = createOffersMarkup(offers, allOffers, id);
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
  if (!photos) {
    return ``;
  }

  return photos.map((photo) => {
    const {src, description} = photo;
    return (
      `<img class="event__photo" src="${src}" alt="${description}">`
    );
  }).join(`\n`);
};

const createEventEditTemplate = (event, destinationsModel, offersModel, options = {}, mode) => {

  const {id, isFavorite} = event;
  const {type, destination, offers, basePrice, dateFrom, dateTo, externalData} = options;

  const allOffers = offersModel.getOffer(type.name);
  const typeEvent = `${type.name[0].toUpperCase() + type.name.slice(1)} ${type.type === `transport` ? `to` : `in`}`;
  const transportEventTypeMarkup = createEventTypeMarkup(WAYPOINT_TYPES, `transport`, type, id);
  const placeEventTypeMarkup = createEventTypeMarkup(WAYPOINT_TYPES, `place`, type, id);
  const dateFromDate = formatTimeEditEvent(dateFrom);
  const dateToDate = formatTimeEditEvent(dateTo);
  const destinationMarkup = createDestinationMarkup(destinationsModel.getDestinations());

  const offersMarkup = allOffers ? createOffersTemplate(offers, allOffers, id) : ``;
  const photosMarkup = createPhotosMarkup(destination.pictures);
  const favorite = isFavorite ? `checked` : ``;

  const isDefaultMode = mode === EventControllerMode.DEFAULT;

  const deleteButtonText = isDefaultMode ? externalData.deleteButtonText : externalData.cancelButtonText;
  const saveButtonText = externalData.saveButtonText;

  let disabledButton = ``;

  if ((deleteButtonText !== DefaultData.deleteButtonText && deleteButtonText !== DefaultData.cancelButtonText) ||
  saveButtonText !== DefaultData.saveButtonText) {
    disabledButton = `disabled`;
  }

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.name}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

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
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${typeEvent}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination ? destination.name : ``}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
            ${destinationMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time"
          value="${dateFromDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateToDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${disabledButton}>${saveButtonText}</button>
        <button class="event__reset-btn" type="reset" ${disabledButton}>${deleteButtonText}</button>
        ${isDefaultMode ?
      `<input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favorite}>
      <label class="event__favorite-btn" for="event-favorite-${id}">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>` : ``
    }

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>

      </header>
      ${destination ?
      `<section class="event__details">
        ${offersMarkup}
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photosMarkup}
            </div>
          </div>
        </section>
      </section>` : ``
    }
    </form>`
  );
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, destinationsModel, offersModel, mode) {
    super();

    this._event = event;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._mode = mode;

    this._type = this._event.type;
    this._offers = this._event.offers;
    this._destination = this._event.destination;
    this._basePrice = this._event.basePrice;
    this._dateFrom = this._event.dateFrom;
    this._dateTo = this._event.dateTo;
    this._externalData = DefaultData;

    this._submitHandler = null;
    this._removeButtonClickHandler = null;
    this._closeButtonClickHandler = null;
    this._favoriteButtonClickHandler = null;
    this._subscribeOnEvents();

    this._applyFlatpickr();
  }

  getTemplate() {
    return createEventEditTemplate(this._event, this._destinationsModel, this._offersModel, {
      destination: this._destination,
      type: this._type,
      offers: this._offers,
      externalData: this._externalData,
      basePrice: this._basePrice,
      dateFrom: this._dateFrom,
      dateTo: this._dateTo,
    }, this._mode);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setRemoveHandler(handler) {
    this.getElement().addEventListener(`reset`, handler);
    this._removeButtonClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    const favoriteButton = this.getElement().querySelector(`.event__favorite-btn`);
    if (favoriteButton) {
      favoriteButton.addEventListener(`click`, handler);
      this._favoriteButtonClickHandler = handler;
    }
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    this._closeButtonClickHandler = handler;
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  isValidData(data) {
    const dateToElement = this.getElement().querySelector(`#event-end-time-${data.id}`);
    const basePriceElement = this.getElement().querySelector(`#event-price-${data.id}`);
    const destinationElement = this.getElement().querySelector(`#event-destination-${data.id}`);

    let isValid = this._disabledSubmitButton(dateToElement, data.dateFrom < data.dateTo);
    isValid = this._disabledSubmitButton(basePriceElement, !!data.basePrice) && isValid;
    isValid = this._disabledSubmitButton(destinationElement, this._destinationsModel.isNameValid(destinationElement.value)) && isValid;
    return isValid;
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setRemoveHandler(this._removeButtonClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setCloseButtonClickHandler(this._closeButtonClickHandler);
    this._subscribeOnEvents();
  }

  reset() {
    const event = this._event;
    this._destination = event.destination;
    this._type = event.type;
    this._offers = event.offers;
    this._basePrice = event.basePrice;
    this._dateFrom = event.dateFrom;
    this._dateTo = event.dateTo;

    this.rerender();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-btn`)
      .addEventListener(`click`, () => {
        const currentType = this._type.name;
        const newTypeElement = Array.from(this.getElement().querySelectorAll(`.event__type-input`)).find((it) => it.checked);
        const newType = newTypeElement.value;

        if (currentType !== newType) {
          this._type = WAYPOINT_TYPES.find((it) => it.name === newType);
          this._offers = [];

          this.rerender();
        }
      });

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        const currentDestination = this._destination.name;
        const newDestination = evt.target.value;
        if (this._destinationsModel.isNameValid(newDestination) && newDestination !== currentDestination) {
          this._destination = this._destinationsModel.getDestination(newDestination);
          this.rerender();
        } else {
          this._disabledSubmitButton(evt.target, this._destinationsModel.isNameValid(newDestination));
        }
      });

    element.querySelector(`.event__input--price`)
      .addEventListener(`change`, (evt) => {
        this._basePrice = evt.target.value;
      });

    element.querySelector(`#event-start-time-${this._event.id}`)
      .addEventListener(`change`, (evt) => {
        this._dateFrom = parseDate(evt.target.value);
      });

    element.querySelector(`#event-end-time-${this._event.id}`)
      .addEventListener(`change`, (evt) => {
        this._dateTo = parseDate(evt.target.value);
      });

    element.querySelector(`.event__section--offers`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          const checkedOffers = Array.from(this.getElement().querySelectorAll(`.event__offer-checkbox`)).filter((offer) => offer.checked === true);
          const allOffers = this._offersModel.getOffer(this._type.name);
          const offers = [];

          checkedOffers.forEach((checkedOffer) => {
            const addedOffer = allOffers.find((offer) => offer.title === checkedOffer.value);

            if (addedOffer) {
              offers.push(addedOffer);
            }
          });

          this._offers = offers;
        }
      });
  }

  _disabledSubmitButton(element, value) {
    if (!value) {
      element.style.border = `1px solid red`;
    } else {
      element.style.border = ``;
    }

    return value;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateElements = Array.from(this.getElement().querySelectorAll(`.event__input--time`));

    dateElements.forEach((date) => {
      this._flatpickr = flatpickr(date, {
        allInput: true,
        allowInput: true,
        dateFormat: `d/m/y H:i`,
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        // defaultDate: this._task.dueDate || `today`,
      });
    });
  }
}
