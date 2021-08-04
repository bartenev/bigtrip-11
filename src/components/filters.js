import {createElement} from "../utils.js";

const filterNames = [`everything`, `future`, `past`];

const createFiltersMarkup = () => {
  return filterNames.map((name) => {
    const isChecked = name === `everything` ? `checked` : ``;
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
      </div>`
    );
  }).join(`\n`);
};

const createFiltersTemplate = () => {
  const filtersMarkup = createFiltersMarkup();
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate();
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
