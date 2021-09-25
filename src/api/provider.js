export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getEvents() {
    return this._api.getEvents();
  }

  getOffers() {
    return this._api.getOffers();
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  createEvent(data) {
    return this._api.createEvent(data);
  }

  updateEvent(id, data) {
    return this._api.updateEvent(id, data);
  }

  deleteEvent(id) {
    return this._api.deleteEvent(id);
  }
}
