import {generateEvents, destinations} from "./mock/waypoint.js";

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
import {render, RenderPosition} from "./utils.js";


const EVENTS_COUNT = 20;

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

// ---------
console.log(events.map((event) => {
  return event.startTime;
})
);

// ----------

const tripMainElement = document.querySelector(`.trip-main`);

render(tripMainElement, new InfoComponent().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);

render(tripInfoElement, new InfoMainComponent(events).getElement());
render(tripInfoElement, new InfoCostComponent(events).getElement());

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripControlsMenuTitleElement = document.querySelector(`.trip-controls h2`);

render(tripControlsMenuTitleElement, new TabsComponent().getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new FiltersComponent().getElement());

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, new SortComponent().getElement());
render(tripEventsElement, new EventEditComponent(events[0], destinations).getElement());

render(tripEventsElement, new DaysListComponent().getElement());

const tripDaysListElement = document.querySelector(`.trip-days`);

let eventsDuplicate = events.concat();
eventsDuplicate.shift();
const uniqueDays = getUniqueDays(eventsDuplicate);

// ----==

console.log(uniqueDays.map((day) => {
  return day;
})
);

// ====

for (const [index, uniqueDay] of uniqueDays.entries()) {
  render(tripDaysListElement, new DayComponent(uniqueDay, index + 1).getElement());
  const tripDayElements = document.querySelectorAll(`.day`);
  render(tripDayElements[tripDayElements.length - 1], new EventsListComponent().getElement());

  const tripEventsListElements = document.querySelectorAll(`.trip-events__list`);

  const firstEvent = eventsDuplicate[0];
  const lastElementIndex = eventsDuplicate.filter((event) => event.startTime.getDate() === firstEvent.startTime.getDate() && event.startTime.getMonth() === firstEvent.startTime.getMonth() && event.startTime.getFullYear() === firstEvent.startTime.getFullYear()).length;
  let remainingEvents = eventsDuplicate.splice(lastElementIndex);

  eventsDuplicate.forEach((event) => {
    render(tripEventsListElements[tripEventsListElements.length - 1], new EventComponent(event).getElement());
  });

  eventsDuplicate = remainingEvents;
}
