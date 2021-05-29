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

const EVENTS_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);

render(tripMainElement, createInfoTemplate(), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info`);

render(tripInfoElement, createInfoMainTemplate());
render(tripInfoElement, createInfoCostTemplate());

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripControlsMenuTitleElement = document.querySelector(`.trip-controls h2`);

render(tripControlsMenuTitleElement, createTabsTemplate(), `afterend`);
render(tripControlsElement, createFiltersTemplate());

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, createSortTemplate());
render(tripEventsElement, createEventEditTemplate());

render(tripEventsElement, createDaysListTemplate());

const tripDaysListElement = document.querySelector(`.trip-days`);

render(tripDaysListElement, createDayTemplate());

const tripDayElement = document.querySelector(`.day`);

render(tripDayElement, createEventsListTemplate());

const tripEventsListElement = document.querySelector(`.trip-events__list`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventsListElement, createEventTemplate());
}

