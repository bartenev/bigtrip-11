import {formatTimeDD, formatTimeMMM} from "../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component";

const getDates = (events) => {
  let dates = ``;

  const firstEvent = events[0].dateFrom;
  const lastEvent = events[events.length - 1].dateFrom;

  const firstEventDay = formatTimeDD(firstEvent);
  const lastEventDay = formatTimeDD(lastEvent);
  const firstEventMonth = formatTimeMMM(firstEvent);
  const lastEventMonth = formatTimeMMM(lastEvent);

  if (firstEvent.getMonth() === lastEvent.getMonth()) {
    if (firstEvent.getDate() === lastEvent.getDate()) {
      dates = `${firstEventMonth} ${firstEventDay}`;
    } else {
      dates = `${firstEventMonth} ${firstEventDay}&nbsp;&mdash;&nbsp;${lastEventDay}`;
    }
  } else {
    dates = `${firstEventDay} ${firstEventMonth}&nbsp;&mdash;&nbsp;${lastEventDay} ${lastEventMonth}`;
  }

  return dates;
};

const getDirections = (events) => {
  const directions = [];
  for (const [index, event] of events.entries()) {
    if (directions === [] || event.destination.name !== directions[index - 1]) {
      directions.push(event.destination.name);
    }
  }
  let route = ``;

  if (directions.length <= 3) {
    route = directions.join(` &mdash; `);
  } else {
    route = `${directions[0]} &mdash; ... &mdash; ${directions[directions.length - 1]}`;
  }

  return route;
};

const createInfoMainTemplate = (events) => {
  const directions = events.length ? getDirections(events) : ``;
  const dates = events.length ? getDates(events) : ``;
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${directions}</h1>

      <p class="trip-info__dates">${dates}</p>
    </div>`
  );
};

export default class InfoMain extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();

    this._eventsModel = eventsModel;

    this._onDataChange = this._onDataChange.bind(this);
    this._eventsModel.setDataChangeHandler(this._onDataChange);
  }

  getTemplate() {
    return createInfoMainTemplate(this._eventsModel.getEventsAll());
  }

  _onDataChange() {
    this.rerender();
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {

  }
}
