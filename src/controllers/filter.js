import FiltersComponent from "../components/filters";
import {render} from "../utils/render";
import {FilterType} from "../const";
import {getEventsByFilter} from "../utils/filter";

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filtersComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._getAvailableFilters = this._getAvailableFilters.bind(this);
    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    this._filtersComponent = new FiltersComponent(this._getAvailableFilters);
    render(this._container, this._filtersComponent);
    this._filtersComponent.setFilterChangeHandler(this._onFilterChange);
  }

  setActiveFilter(filterType) {
    this._filtersComponent.setActiveFilter(filterType);
    this._onFilterChange(filterType);
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this._filtersComponent.rerender();
  }

  _getAvailableFilters() {
    const filterTypes = Object.values(FilterType);
    const availableFilters = [];
    const events = this._eventsModel.getEventsAll();
    filterTypes.forEach((filterType) => {
      const currentFilterCount = getEventsByFilter(events, filterType);
      if (currentFilterCount && currentFilterCount.length > 0) {
        availableFilters.push(filterType);
      }
    });

    return availableFilters;
  }
}
