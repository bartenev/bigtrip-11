import AbstractComponent from "./abstract-component.js";
import {FilterType} from "../const.js";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFiltersMarkup = () => {
  return Object.values(FilterType).map((name) => {
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

export default class Filters extends AbstractComponent {
  getTemplate() {
    return createFiltersTemplate();
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
