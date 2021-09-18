import AbstractSmartComponent from "./abstract-smart-component";

const getTotalCost = (events) => {
  return events.reduce((acc, event) => {
    const sumEvents = acc + event.basePrice;
    let sumOffers = 0;
    if (event.offers) {
      sumOffers = event.offers.reduce((acc2, offer) => {
        return acc2 + offer.price;
      }, 0);
    }
    return sumEvents + sumOffers;
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

export default class InfoCost extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();

    this._eventsModel = eventsModel;
    this._onDataChange = this._onDataChange.bind(this);
    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  getTemplate() {
    return createInfoCostTemplate(this._eventsModel.getEventsAll());
  }

  _onDataChange() {
    this.rerender();
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {

  }
}
