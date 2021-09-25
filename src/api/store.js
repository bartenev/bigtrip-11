export default class Store {
  constructor(key, storage) {
    this._storeKey = key;
    this._storage = storage;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItem(key, value, type) {
    const store = this.getItems();

    const oldData = store[type];
    const newData = Object.assign({}, oldData, {
      [key]: value
    });

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [type]: newData
            })
        )
    );
  }

  setItems(key, values) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: values
            })
        )
    );
  }

  removeItem() {

  }
}
