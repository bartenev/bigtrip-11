import API from "./api";
import DestinationsModel from "./models/destinations.js";
import EventsModel from "./models/events.js";
import FilterController from "./controllers/filter";
import InfoComponent from './components/info.js';
import InfoMainComponent from './components/info-main.js';
import InfoCostComponent from './components/info-cost.js';
import Message from "./components/message";
import {MessageText} from "./components/message";
import NewEventButtonComponent from "./components/new-event-button.js";
import OffersModel from "./models/offers";
import StatisticsComponent from "./components/statistics";
import TabsComponent, {TabsItem} from './components/tabs.js';
import TripController from "./controllers/trip";
import TripComponent from "./components/trip";
import {destinations} from "./mock/waypoint.js";
import {render, RenderPosition} from "./utils/render";
import {SortType} from "./components/sort";


const AUTHORIZATION = `Basic kjsfnfdsvnsfdvn`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const eventsModel = new EventsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

destinationsModel.setDestinations(destinations);

// ---------
// const sortEvents = events.sort((firstEvent, secondEvent) => (firstEvent.dateFrom - secondEvent.dateFrom));
// console.log(sortEvents.map((event) => {
//   return event.dateFrom;
// }));
// ---------

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoComponent = new InfoComponent();
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);

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

const loadingComponent = new Message(MessageText.LOADING);
render(tripComponent.getElement(), loadingComponent);

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

api.getEvents()
  .then((events) => {
    console.log(events);
    eventsModel.setEvents(events);
    render(tripInfoComponent.getElement(), new InfoMainComponent(eventsModel));
    render(tripInfoComponent.getElement(), new InfoCostComponent(eventsModel));

    api.getOffers()
      .then((offers) => {
        console.log(offers);
        offersModel.setOffers(offers);
        loadingComponent.getElement().remove();
        loadingComponent.removeElement();
        tripController.render();
      });

  });


