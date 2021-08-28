export default class Destinations {
  constructor() {
    this._destinations = null;
  }

  setDestinations(destinations) {
    this._destinations = Array.from(destinations);
  }

  getDestinations() {
    return this._destinations;
  }

  getDestination(name) {
    return this._destinations.find((it) => it.name === name);
  }

  isNameValid(name) {
    return this._destinations.some((it) => it.name === name);
  }
}
