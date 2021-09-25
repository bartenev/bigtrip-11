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

  setItems(type, section) {
    const store = this.getItems();
    this._changeData(store, section, type);
  }

  setItem(key, value, type) {
    const store = this.getItems();

    const oldSectionOfStore = store[type];
    const newSectionOfStore = Object.assign({}, oldSectionOfStore, {
      [key]: value
    });

    this._changeData(store, newSectionOfStore, type);
  }

  removeItem(id, type) {
    const store = this.getItems();

    const sectionOfStore = store[type];
    delete sectionOfStore[id];

    this._changeData(store, sectionOfStore, type);
  }

  _changeData(oldData, newData, typeOfSection) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, oldData, {
              [typeOfSection]: newData
            })
        )
    );
  }
}
