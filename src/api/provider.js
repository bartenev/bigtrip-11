import Event from "../models/event";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

export default class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map((event) => event.toRAW()));
          this._storage.setItems(`events`, items);

          return events;
        });
    }

    const storeEvents = Object.values(this._storage.getItems().events);
    return Promise.resolve(Event.parseEvents(storeEvents));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._storage.setItems(`offers`, offers);
          return offers;
        });
    }

    const storeOffers = Object.values(this._storage.getItems().offers);
    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._storage.setItems(`destinations`, destinations);

          return destinations;
        });
    }

    const storeDestinations = Object.values(this._storage.getItems().destinations);
    return Promise.resolve(storeDestinations);
  }

  createEvent(data) {
    if (isOnline()) {
      return this._api.createEvent(data)
        .then((newEvent) => {
          this._storage.setItem(newEvent.id, newEvent.toRAW(), `events`);

          return newEvent;
        });
    }
    const localEventNewId = nanoid();
    const localEvent = Event.clone(Object.assign(data, {id: localEventNewId}));
    this._storage.setItem(localEventNewId, localEvent.toRAW(), `events`);

    return Promise.resolve(localEvent);
  }

  updateEvent(id, data) {
    if (isOnline()) {
      return this._api.updateEvent(id, data)
        .then((newEvent) => {
          this._storage.setItem(newEvent.id, newEvent.toRAW(), `events`);

          return newEvent;
        });
    }

    const localEvent = Event.clone(Object.assign(data, {id}));
    this._storage.setItem(id, localEvent.toRAW(), `events`);

    return Promise.resolve(localEvent);
  }

  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => {
          this._storage.removeItem(id, `events`);
        });
    }

    this._storage.removeItem(id, `events`);
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._storage.getItems().events);
      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = response.created;
          const updateEvents = getSyncedTasks(response.updated);
          const allEvents = [...createdEvents, ...updateEvents];

          const items = createStoreStructure(allEvents);

          this._storage.setItems(`events`, items);

          return Event.parseEvents(allEvents);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
