import {createElement} from "../utils.js";

const getTotalCost = (events) => {
  return events.reduce((sumEvents, event) => {
    return sumEvents + event.price + event.offers.reduce((sumOffers, offer) => {
      return sumOffers + (offer.isChecked ? offer.price : 0);
    }, 0);
  }, 0);
};


const createInfoCostTemplate = (events) => {
  const totalCost = getTotalCost(events);
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export default class InfoCost {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getTemplate() {
    return createInfoCostTemplate(this._events);
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
