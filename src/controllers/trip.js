import {render, replace} from "../utils/render.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import {destinations} from "../mock/waypoint.js";
import NoPointsComponent from "../components/no-points.js";
import SortComponent from "../components/sort.js";
import DaysListComponent from "../components/days-list.js";
import DayComponent from "../components/day.js";
import EventsListComponent from "../components/events-list.js";
import {SortType} from "../components/sort.js";

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

const renderEvent = (eventListElement, event) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replace(eventComponent, eventEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const eventComponent = new EventComponent(event);
  eventComponent.setEditButtonClickHandler(() => {
    replace(eventEditComponent, eventComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const eventEditComponent = new EventEditComponent(event, destinations);
  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replace(eventComponent, eventEditComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent);
};

const renderEvents = (tripDaysListElement, events, sortType = SortType.EVENT) => {
  const renderEventsLoop = (tripEventsListElement, points) => {
    points.forEach((point) => {
      renderEvent(tripEventsListElement, point);
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

      renderEventsLoop(tripEventsListElements[tripEventsListElements.length - 1], eventsDuplicate);

      eventsDuplicate = remainingEvents;
    }
  } else {
    render(tripDaysListElement, new DayComponent());
    const tripDayElement = document.querySelector(`.day`);
    render(tripDayElement, new EventsListComponent());

    const tripEventsListElement = document.querySelector(`.trip-events__list`);

    renderEventsLoop(tripEventsListElement, eventsDuplicate);
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._noPointsComponent = new NoPointsComponent();
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();
  }

  render(events) {
    if (!events.length) {
      render(this._container, this._noPointsComponent);
      return;
    }

    render(this._container, this._sortComponent);
    render(this._container, this._daysListComponent);

    const tripDaysListElement = document.querySelector(`.trip-days`);

    renderEvents(tripDaysListElement, events);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(events, sortType);

      tripDaysListElement.innerHTML = ``;

      renderEvents(tripDaysListElement, sortedEvents, sortType);
    });
  }
}