import {generateEvents} from "./mock/waypoint.js";
import InfoComponent from './components/info.js';
import InfoMainComponent from './components/info-main.js';
import InfoCostComponent from './components/info-cost.js';
import TabsComponent from './components/tabs.js';
import FiltersComponent from './components/filters.js';
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/trip";

const EVENTS_COUNT = 20;

const events = generateEvents(EVENTS_COUNT).sort((firstEvent, secondEvent) => (firstEvent.dateFrom - secondEvent.dateFrom));

// ---------
console.log(events.map((event) => {
  return event.dateFrom;
})
);
// ----------

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoComponent = new InfoComponent();
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoComponent.getElement(), new InfoMainComponent(events));
render(tripInfoComponent.getElement(), new InfoCostComponent(events));

const tripControlsElement = document.querySelector(`.trip-controls`);
render(tripControlsElement, new TabsComponent(), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new FiltersComponent());

const tripEventsElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsElement);
tripController.render(events);
