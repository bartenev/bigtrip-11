import {generateEvents, destinations} from "./mock/waypoint.js";

import NoPointsComponent from "./components/no-points.js";
import InfoComponent from './components/info.js';
import InfoMainComponent from './components/info-main.js';
import InfoCostComponent from './components/info-cost.js';
import TabsComponent from './components/tabs.js';
import FiltersComponent from './components/filters.js';
import SortComponent from './components/sort.js';
import EventEditComponent from './components/event-edit.js';
import DaysListComponent from './components/days-list.js';
import DayComponent from './components/day.js';
import EventsListComponent from './components/events-list.js';
import EventComponent from './components/event.js';
import {render, replace, RenderPosition} from "./utils/render";

const EVENTS_COUNT = 20;

const getUniqueDays = (listOfEvent) => {
  let days = [];

  listOfEvent.forEach((event) => {
    let isSameItemFound = days.some((day) => day.getDate() === event.startTime.getDate() && day.getMonth() === event.startTime.getMonth() && day.getFullYear() === event.startTime.getFullYear());

    if (!isSameItemFound) {
      days.push(event.startTime);
    }
  });
  return days;
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

const renderTripEventsComponent = (tripEventsComponent, events) => {
  if (!events.length) {
    render(tripEventsComponent, new NoPointsComponent());
    return;
  }

  render(tripEventsComponent, new SortComponent());
  render(tripEventsComponent, new DaysListComponent());

  const tripDaysListElement = document.querySelector(`.trip-days`);

  let eventsDuplicate = events.concat();
  const uniqueDays = getUniqueDays(eventsDuplicate);

  for (const [index, uniqueDay] of uniqueDays.entries()) {
    render(tripDaysListElement, new DayComponent(uniqueDay, index + 1));
    const tripDayElements = document.querySelectorAll(`.day`);
    render(tripDayElements[tripDayElements.length - 1], new EventsListComponent());

    const tripEventsListElements = document.querySelectorAll(`.trip-events__list`);

    const firstEvent = eventsDuplicate[0];
    const lastElementIndex = eventsDuplicate.filter((event) => event.startTime.getDate() === firstEvent.startTime.getDate() && event.startTime.getMonth() === firstEvent.startTime.getMonth() && event.startTime.getFullYear() === firstEvent.startTime.getFullYear()).length;
    let remainingEvents = eventsDuplicate.splice(lastElementIndex);

    eventsDuplicate.forEach((event) => {
      renderEvent(tripEventsListElements[tripEventsListElements.length - 1], event);
    });

    eventsDuplicate = remainingEvents;
  }
};

const compare = (firstEvent, secondEvent) => {
  if (firstEvent.startTime > secondEvent.startTime) {
    return 1;
  } else if (firstEvent.startTime < secondEvent.startTime) {
    return -1;
  } else {
    return 0;
  }
};

const events = generateEvents(EVENTS_COUNT).sort(compare);

// ---------
console.log(events.map((event) => {
  return event.startTime;
})
);
// ----------

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = new InfoComponent();
render(tripMainElement, tripInfoElement, RenderPosition.AFTERBEGIN);
render(tripInfoElement.getElement(), new InfoMainComponent(events));
render(tripInfoElement.getElement(), new InfoCostComponent(events));

const tripControlsElement = document.querySelector(`.trip-controls`);
render(tripControlsElement, new TabsComponent(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new FiltersComponent());

const tripEventsElement = document.querySelector(`.trip-events`);
renderTripEventsComponent(tripEventsElement, events);
