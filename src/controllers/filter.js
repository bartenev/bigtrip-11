import FiltersComponent from "../components/filters";
import {render} from "../utils/render";
import {FilterType} from "../const";

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filtersComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    this._filtersComponent = new FiltersComponent();
    render(this._container, this._filtersComponent);
    this._filtersComponent.setFilterChangeHandler(this._onFilterChange);
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
