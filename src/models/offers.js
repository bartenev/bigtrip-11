export default class Offers {
  constructor() {
    this._offers = null;
  }

  setOffers(offers) {
    this._offers = Array.from(offers);
  }

  getOffers() {
    return this._offers;
  }

  getOffer(name) {
    return this._offers.find((it) => it.type === name).offers;
  }
}
