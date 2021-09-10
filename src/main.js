import {generateEvents, destinations, offers} from "./mock/waypoint.js";
import EventsModel from "./models/events.js";
import DestinationsModel from "./models/destinations.js";
import OffersModel from "./models/offers";
import InfoComponent from './components/info.js';
import InfoMainComponent from './components/info-main.js';
import InfoCostComponent from './components/info-cost.js';
import TabsComponent, {TabsItem} from './components/tabs.js';
import FilterController from "./controllers/filter";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/trip";
import NewEventButtonComponent from "./components/new-event-button.js";
import StatisticsComponent from "./components/statistics";
import TripComponent from "./components/trip";
import {SortType} from "./components/sort";

const EVENTS_COUNT = 5;

const events = generateEvents(EVENTS_COUNT);

// ---------
const sortEvents = events.sort((firstEvent, secondEvent) => (firstEvent.dateFrom - secondEvent.dateFrom));
console.log(sortEvents.map((event) => {
  return event.dateFrom;
}));
// ---------

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(destinations);

const offersModel = new OffersModel();
offersModel.setOffers(offers);

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoComponent = new InfoComponent();
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoComponent.getElement(), new InfoMainComponent(eventsModel));
render(tripInfoComponent.getElement(), new InfoCostComponent(eventsModel));

const tripControlsElement = document.querySelector(`.trip-controls`);
const tabsComponent = new TabsComponent();
render(tripControlsElement, tabsComponent, RenderPosition.AFTERBEGIN);
const filterController = new FilterController(tripControlsElement, eventsModel);
filterController.render();

const newEventButtonComponent = new NewEventButtonComponent();
render(tripMainElement, newEventButtonComponent);

const mainContainerElement = document.querySelector(`.page-main .page-body__container`);

const tripComponent = new TripComponent();
render(mainContainerElement, tripComponent);
const tripController = new TripController(tripComponent, eventsModel, destinationsModel, offersModel);
tripController.render();

const statisticsComponent = new StatisticsComponent(eventsModel);
render(mainContainerElement, statisticsComponent);
statisticsComponent.hide();

newEventButtonComponent.setButtonClickHandler(() => {
  tabsComponent.setActiveItem(TabsItem.TABLE);
  statisticsComponent.hide();
  tripController.show();
  tripController.createTask();
});

tabsComponent.setOnChange((tabsItem) => {
  switch (tabsItem) {
    case TabsItem.STATISTICS:
      tripController.hide();
      statisticsComponent.rerender(eventsModel);
      statisticsComponent.show();
      break;
    case TabsItem.TABLE:
      statisticsComponent.hide();
      tripController.setSortType(SortType.EVENT);
      tripController.show();
      break;
  }
});
