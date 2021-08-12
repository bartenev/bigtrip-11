import {formatTimeDateTime, formatTimeMD} from "../utils.js";
import AbstractComponent from "./abstract-component.js";

const createDayTemplate = (date, index) => {
  const formattedDate = formatTimeMD(date);
  const formattedDateTime = formatTimeDateTime(date, true);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${formattedDateTime}">${formattedDate}</time>
      </div>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(date, index) {
    super();

    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._index);
  }
}
