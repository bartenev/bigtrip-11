import {remove, render} from "../utils/render.js";
import Message from "../components/message.js";
import {MessageText} from "../components/message.js";
import SortComponent from "../components/sort.js";
import DaysListComponent from "../components/days-list.js";
import DayComponent from "../components/day.js";
import EventsListComponent from "../components/events-list.js";
import {SortType} from "../components/sort.js";
import EventController, {EmptyEvent, Mode as EventControllerMode} from "./event.js";
import {FilterType} from "../const";

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
    eventController.render(point, EventControllerMode.DEFAULT);
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
  constructor(container, eventsModel, destinationsModel, offersModel, api) {
    this._eventsModel = eventsModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;
    this._eventsControllers = [];
    this._creatingTask = null;

    this._sortType = SortType.EVENT;

    this._container = container;
    this._noPointsComponent = new Message(MessageText.NO_POINTS);
    this._sortComponent = new SortComponent();
    this._daysListComponent = new DaysListComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render() {
    const events = this._eventsModel.getEvents();
    const container = this._container.getElement();

    if (!events.length) {
      this._renderNoPointsElement();
      return;
    }

    render(container, this._sortComponent);
    render(container, this._daysListComponent);

    const tripDaysListElement = this._daysListComponent.getElement();

    this._renderEvents(events, SortType.EVENT);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      tripDaysListElement.innerHTML = ``;
      this._renderEvents(this._eventsModel.getEvents(), sortType);
    });
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }
    this._onViewChange();
    this._sortType = SortType.EVENT;
    // this._eventsModel.setFilter(FilterType.EVERYTHING);
    this._creatingTask = new EventController(this._sortComponent.getElement(), this._destinationsModel, this._offersModel, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyEvent, EventControllerMode.ADDING);
  }

  setSortType(sortType) {
    this._sortType = sortType;
    this._sortComponent.setDefaultSortType();
    this.updateEvents(this._sortType);
  }

  _renderNoPointsElement() {
    render(this._container.getElement(), this._noPointsComponent);
  }

  _renderEvents(events, sortType) {
    if (!events.length) {
      this._renderNoPointsElement();
    } else if (document.contains(this._noPointsComponent.getElement())) {
      remove(this._noPointsComponent);
    }

    this._sortType = sortType;
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

  updateEvents(sortType = this._sortType) {
    this._removeEvents();
    this._renderEvents(this._eventsModel.getEvents(), sortType);
  }

  _onDataChange(eventController, oldData, newData, isClose = true) {
    if (oldData === EmptyEvent) {
      this._creatingTask = null;
      if (newData === null) {
        eventController.destroy();
        this.updateEvents(this._sortType);
      } else {
        this._api.createEvent(newData)
          .then((eventModel) => {
            this._eventsModel.addEvent(eventModel);
            // eventController.render(newData, EventControllerMode.DEFAULT);
            this._eventsControllers = [].concat(eventController, this._eventsControllers);
            this.updateEvents(this._sortType);
          })
          .catch(() => {
            eventController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deleteEvent(oldData.id)
        .then(() => {
          this._eventsModel.removeEvent(oldData.id);
          this.updateEvents(this._sortType);
        })
        .catch(() => {
          eventController.shake();
        });
    } else {
      this._api.updateEvent(oldData.id, newData)
        .then((eventModel) => {
          const isSuccess = this._eventsModel.updateEvent(oldData.id, newData);

          if (isSuccess) {
            eventController.render(eventModel, EventControllerMode.DEFAULT);
            if (isClose) {
              this.updateEvents(this._sortType);
            }
          }
        })
        .catch(() => {
          eventController.shake();
        });
    }
  }

  _onViewChange() {
    if (this._creatingTask) {
      this._creatingTask.destroy();
      this._creatingTask = null;
    }
    this._eventsControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this.updateEvents(SortType.EVENT);
    this._sortComponent.setDefaultSortType();
  }
}
