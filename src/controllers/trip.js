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

const renderEvents = (tripDaysListElement, events, sortType, destinationsModel, offersModel, onDataChange, onViewChange) => {
  let eventsControllers = [];
  const renderEventsLoop = (tripEventsListElement, points) => {
    return points.map((point) => {
      const eventController = new EventController(tripEventsListElement, destinationsModel, offersModel, onDataChange, onViewChange);
      eventController.render(point);
      return eventController;
    });
  };

  let sortEvents = getSortedEvents(events, sortType);

  if (sortType === SortType.EVENT) {
    const uniqueDays = getUniqueDays(sortEvents);

    for (const [index, uniqueDay] of uniqueDays.entries()) {
      render(tripDaysListElement, new DayComponent(uniqueDay, index + 1));
      const tripDayElements = document.querySelectorAll(`.day`);
      render(tripDayElements[tripDayElements.length - 1], new EventsListComponent());

      const tripEventsListElements = document.querySelectorAll(`.trip-events__list`);

      const firstEvent = sortEvents[0];
      const lastElementIndex = sortEvents.filter((event) => event.dateFrom.getDate() === firstEvent.dateFrom.getDate()
        && event.dateFrom.getMonth() === firstEvent.dateFrom.getMonth()
        && event.dateFrom.getFullYear() === firstEvent.dateFrom.getFullYear()).length;

      let remainingEvents = sortEvents.splice(lastElementIndex);

      eventsControllers = [].concat(eventsControllers, renderEventsLoop(tripEventsListElements[tripEventsListElements.length - 1], sortEvents));

      sortEvents = remainingEvents;
    }
  } else {
    render(tripDaysListElement, new DayComponent());
    const tripDayElement = document.querySelector(`.day`);
    render(tripDayElement, new EventsListComponent());

    const tripEventsListElement = document.querySelector(`.trip-events__list`);

    eventsControllers = renderEventsLoop(tripEventsListElement, sortEvents);
  }

  return eventsControllers;
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
  }

  render() {
    const events = this._eventsModel.getEvents();

    if (!events.length) {
      render(this._container, this._noPointsComponent);
      return;
    }

    render(this._container, this._sortComponent);
    render(this._container, this._daysListComponent);

    const tripDaysListElement = document.querySelector(`.trip-days`);

    this._eventsControllers = renderEvents(tripDaysListElement, events, SortType.EVENT, this._destinationsModel, this._offersModel, this._onDataChange, this._onViewChange);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      tripDaysListElement.innerHTML = ``;
      this._eventsControllers = renderEvents(tripDaysListElement, events, sortType, this._destinationsModel, this._offersModel, this._onDataChange, this._onViewChange);
    });
  }

  _onDataChange(oldData, newData) {
    this._eventsModel.updateEvent(oldData.id, newData);

    const eventController = this._eventsControllers.find((it) => it._eventComponent._event === oldData);
    eventController.render(newData);
  }

  _onViewChange() {
    this._eventsControllers.forEach((it) => it.setDefaultView());
  }

}
