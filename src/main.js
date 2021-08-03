import {generateEvents, destinations, additionalOffers} from "./mock/waypoint.js";

import {createInfoTemplate} from './components/info.js';
import {createInfoMainTemplate} from './components/info-main.js';
import {createInfoCostTemplate} from './components/info-cost.js';
import {createTabsTemplate} from './components/tabs.js';
import {createFiltersTemplate} from './components/filters.js';
import {createSortTemplate} from './components/sort.js';
import {createEventEditTemplate} from './components/event-edit.js';
import {createDaysListTemplate} from './components/days-list.js';
import {createDayTemplate} from './components/day.js';
import {createEventsListTemplate} from './components/events-list.js';
import {createEventTemplate} from './components/event.js';
import {render} from "./utils.js";


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

render(tripMainElement, createInfoTemplate(), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info`);

render(tripInfoElement, createInfoMainTemplate(events));
render(tripInfoElement, createInfoCostTemplate(events));

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripControlsMenuTitleElement = document.querySelector(`.trip-controls h2`);

render(tripControlsMenuTitleElement, createTabsTemplate(), `afterend`);
render(tripControlsElement, createFiltersTemplate());

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, createSortTemplate());
render(tripEventsElement, createEventEditTemplate(events[0], destinations, additionalOffers));

render(tripEventsElement, createDaysListTemplate());

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
  render(tripDaysListElement, createDayTemplate(uniqueDay, index + 1));
  const tripDayElements = document.querySelectorAll(`.day`);
  render(tripDayElements[tripDayElements.length - 1], createEventsListTemplate());

  const tripEventsListElements = document.querySelectorAll(`.trip-events__list`);

  const firstEvent = eventsDuplicate[0];
  const lastElementIndex = eventsDuplicate.filter((event) => event.startTime.getDate() === firstEvent.startTime.getDate() && event.startTime.getMonth() === firstEvent.startTime.getMonth() && event.startTime.getFullYear() === firstEvent.startTime.getFullYear()).length;
  let remainingEvents = eventsDuplicate.splice(lastElementIndex);

  eventsDuplicate.forEach((event) => {
    render(tripEventsListElements[tripEventsListElements.length - 1], createEventTemplate(event));
  });

  eventsDuplicate = remainingEvents;
}
