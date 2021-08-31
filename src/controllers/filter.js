import FiltersComponent from "../components/filters";
import {render} from "../utils/render";

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

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
    // this._activeFilterType = filterType;
  }
}
