import AbstractSmartComponent from "./abstract-smart-component";

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
