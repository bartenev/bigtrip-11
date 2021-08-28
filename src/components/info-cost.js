import AbstractComponent from "./abstract-component.js";

const getTotalCost = (events) => {
  return events.reduce((sumEvents, event) => {
    return sumEvents + event.basePrice + event.offers.reduce((sumOffers, offer) => {
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

export default class InfoCost extends AbstractComponent {
  constructor(eventsModel) {
    super();

    this._eventsModel = eventsModel;
  }

  getTemplate() {
    return createInfoCostTemplate(this._eventsModel.getEventsAll());
  }
}
