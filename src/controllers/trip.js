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
    let isSameItemFound = days.some((day) => day.getDate() === event.startTime.getDate()
      && day.getMonth() === event.startTime.getMonth() && day.getFullYear() === event.startTime.getFullYear());

    if (!isSameItemFound) {
      days.push(event.startTime);
    }
  });
  return days;
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const eventsDuplicate = events.slice();

  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = eventsDuplicate;
      break;
    case SortType.TIME:
      sortedEvents = eventsDuplicate.sort((firstEvent, secondEvent) => (secondEvent.finishTime - secondEvent.startTime) - (firstEvent.finishTime - firstEvent.startTime));
      break;
    case SortType.PRICE:
      sortedEvents = eventsDuplicate.sort((firstEvent, secondEvent) => secondEvent.price - firstEvent.price);
      break;
  }
  return sortedEvents;
};

const renderEvents = (tripDaysListElement, events, sortType, onDataChange) => {
  let eventsControllers = [];
  const renderEventsLoop = (tripEventsListElement, points) => {
    return points.map((point) => {
      const eventController = new EventController(tripEventsListElement, onDataChange);
      eventController.render(point);
      return eventController;
    });
  };

  let eventsDuplicate = events.concat();

  if (sortType === SortType.EVENT) {
    const uniqueDays = getUniqueDays(eventsDuplicate);

    for (const [index, uniqueDay] of uniqueDays.entries()) {
      render(tripDaysListElement, new DayComponent(uniqueDay, index + 1));
      const tripDayElements = document.querySelectorAll(`.day`);
      render(tripDayElements[tripDayElements.length - 1], new EventsListComponent());

      const tripEventsListElements = document.querySelectorAll(`.trip-events__list`);

      const firstEvent = eventsDuplicate[0];
      const lastElementIndex = eventsDuplicate.filter((event) => event.startTime.getDate() === firstEvent.startTime.getDate()
        && event.startTime.getMonth() === firstEvent.startTime.getMonth()
        && event.startTime.getFullYear() === firstEvent.startTime.getFullYear()).length;

      let remainingEvents = eventsDuplicate.splice(lastElementIndex);

      eventsControllers = [].concat(eventsControllers, renderEventsLoop(tripEventsListElements[tripEventsListElements.length - 1], eventsDuplicate));

      eventsDuplicate = remainingEvents;
    }
  } else {
    render(tripDaysListElement, new DayComponent());
    const tripDayElement = document.querySelector(`.day`);
    render(tripDayElement, new EventsListComponent());

    const tripEventsListElement = document.querySelector(`.trip-events__list`);

    eventsControllers = renderEventsLoop(tripEventsListElement, eventsDuplicate);
  }

  return eventsControllers;
};

export default class TripController {
  constructor(container) {
    this._events = [];
    this._eventsControllers = [];

    this._container = container;
    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();

    this._onDataChange = this._onDataChange.bind(this);
  }

  render(events) {
    this._events = events;

    if (!this._events.length) {
      render(this._container, this._noPointsComponent);
      return;
    }

    render(this._container, this._sortComponent);
    render(this._container, this._daysListComponent);

    const tripDaysListElement = document.querySelector(`.trip-days`);

    this._eventsControllers = renderEvents(tripDaysListElement, this._events, SortType.EVENT, this._onDataChange);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(this._events, sortType);

      tripDaysListElement.innerHTML = ``;

      this._eventsControllers = renderEvents(tripDaysListElement, sortedEvents, sortType, this._onDataChange);
    });
  }

  _onDataChange(oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);
    const eventController = this._eventsControllers.find((it) => it._eventComponent._event === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    eventController.render(newData);
  }

}
