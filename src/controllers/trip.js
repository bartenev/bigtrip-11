import {render} from "../utils/render.js";
import NoPointsComponent from "../components/no-points.js";
import SortComponent from "../components/sort.js";
import DaysListComponent from "../components/days-list.js";
import DayComponent from "../components/day.js";
import EventsListComponent from "../components/events-list.js";
import {SortType} from "../components/sort.js";
import EventController from "./event.js";

const getUniqueDays = (listOfEvent) => {
  let days = [];

  listOfEvent.forEach((event) => {
    let isSameItemFound = days.some((day) => day.getDate() === event.dateFrom.getDate()
      && day.getMonth() === event.dateFrom.getMonth() && day.getFullYear() === event.dateFrom.getFullYear());

    if (!isSameItemFound) {
      days.push(event.dateFrom);
    }
  });
  return days;
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const eventsDuplicate = events.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = eventsDuplicate.sort((firstEvent, secondEvent) => (firstEvent.dateFrom - secondEvent.dateFrom));
      break;
    case SortType.TIME:
      sortedEvents = eventsDuplicate.sort((firstEvent, secondEvent) => (secondEvent.dateTo - secondEvent.dateFrom) - (firstEvent.dateTo - firstEvent.dateFrom));
      break;
    case SortType.PRICE:
      sortedEvents = eventsDuplicate.sort((firstEvent, secondEvent) => secondEvent.basePrice - firstEvent.basePrice);
      break;
  }
  return sortedEvents;
};

const renderEvents = (tripEventsListElement, events, destinationsModel, offersModel, onDataChange, onViewChange) => {
  return events.map((point) => {
    const eventController = new EventController(tripEventsListElement, destinationsModel, offersModel, onDataChange, onViewChange);
    eventController.render(point);
    return eventController;
  });
};

const renderEventsOfOneDay = (date, dayIndex, events, destinationsModel, offersModel, onDataChange, onViewChange) => {
  const tripDaysListElement = document.querySelector(`.trip-days`);
  render(tripDaysListElement, new DayComponent(date, dayIndex));
  const tripDayElements = document.querySelectorAll(`.day`);
  render(tripDayElements[tripDayElements.length - 1], new EventsListComponent());
  const tripEventsListElements = document.querySelectorAll(`.trip-events__list`);

  return renderEvents(tripEventsListElements[tripEventsListElements.length - 1], events, destinationsModel, offersModel, onDataChange, onViewChange);
};

export default class TripController {
  constructor(container, eventsModel, destinationsModel, offersModel) {
    this._eventsModel = eventsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._eventsControllers = [];

    this._container = container;
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const events = this._eventsModel.getEvents();

    if (!events.length) {
      render(this._container, this._noPointsComponent);
      return;
    }

    render(this._container, this._sortComponent);
    render(this._container, this._daysListComponent);

    const tripDaysListElement = this._daysListComponent.getElement();

    this._renderEvents(events, SortType.EVENT);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      tripDaysListElement.innerHTML = ``;
      this._renderEvents(this._eventsModel.getEvents(), sortType);
    });
  }

  _renderEvents(events, sortType) {
    let sortEvents = getSortedEvents(events, sortType);

    if (sortType === SortType.EVENT) {
      const uniqueDays = getUniqueDays(sortEvents);

      for (const [index, uniqueDay] of uniqueDays.entries()) {
        const firstEvent = sortEvents[0];
        const lastElementIndex = sortEvents.filter((event) => event.dateFrom.getDate() === firstEvent.dateFrom.getDate()
          && event.dateFrom.getMonth() === firstEvent.dateFrom.getMonth()
          && event.dateFrom.getFullYear() === firstEvent.dateFrom.getFullYear()).length;

        let remainingEvents = sortEvents.splice(lastElementIndex);
        this._eventsControllers = [].concat(this._eventsControllers,
            renderEventsOfOneDay(uniqueDay, index + 1, sortEvents,
                this._destinationsModel, this._offersModel, this._onDataChange, this._onViewChange));

        sortEvents = remainingEvents;
      }
    } else {
      this._eventsControllers = renderEventsOfOneDay(null, null, sortEvents, this._destinationsModel, this._offersModel, this._onDataChange, this._onViewChange);
    }

    return this._eventsControllers;
  }

  _removeEvents() {
    this._eventsControllers.forEach((eventController) => eventController.destroy());
    this._eventsControllers = [];
    this._daysListComponent.getElement().innerHTML = ``;
  }

  _updateEvents(sortType) {
    this._removeEvents();
    this._renderEvents(this._eventsModel.getEvents(), sortType);
  }

  _onDataChange(oldData, newData) {
    this._eventsModel.updateEvent(oldData.id, newData);

    const eventController = this._eventsControllers.find((it) => it._eventComponent._event === oldData);
    eventController.render(newData);
  }

  _onViewChange() {
    this._eventsControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateEvents(SortType.EVENT);
    this._sortComponent.setDefaultSortType();
  }
}
