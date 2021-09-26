import {FilterType} from "../const.js";
import AbstractSmartComponent from "./abstract-smart-component";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFiltersMarkup = (activeFilterType, availableFilters) => {
  return Object.values(FilterType).map((name) => {
    const disabledFilter = availableFilters.indexOf(name) > -1 ? `` : `disabled`;
    const isChecked = name === activeFilterType ? `checked` : ``;
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked} ${disabledFilter}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
      </div>`
    );
  }).join(`\n`);
};

const createFiltersTemplate = (activeFilterType, availableFilters) => {
  const filtersMarkup = createFiltersMarkup(activeFilterType, availableFilters);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractSmartComponent {
  constructor(getAvailableFilters) {
    super();
    this._getAvailableFilters = getAvailableFilters;
    this._filterHandler = null;
    this._activeFilterType = FilterType.EVERYTHING;
  }

  getTemplate() {
    return createFiltersTemplate(this._activeFilterType, this._getAvailableFilters());
  }

  setFilterChangeHandler(handler) {
    this._filterHandler = handler;
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      this._activeFilterType = filterName;
      handler(filterName);
    });
  }

  setActiveFilter(filterName) {
    this._activeFilterType = filterName;
    this.rerender();
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._filterHandler);
  }
}
