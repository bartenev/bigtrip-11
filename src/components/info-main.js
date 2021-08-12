import {castTimeFormat, formatMMM} from "../utils.js";
import AbstractComponent from "./abstract-component.js";

const getDates = (events) => {
  let dates = ``;

  const firstEvent = events[0].startTime;
  const lastEvent = events[events.length - 1].startTime;

  const firstEventDay = castTimeFormat(firstEvent.getDate());
  const lastEventDay = castTimeFormat(lastEvent.getDate());
  const firstEventMonth = formatMMM(firstEvent.getMonth());
  const lastEventMonth = formatMMM(lastEvent.getMonth());

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
    if (directions === [] || event.destination !== directions[index - 1]) {
      directions.push(event.destination);
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

export default class InfoMain extends AbstractComponent {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return createInfoMainTemplate(this._events);
  }
}
