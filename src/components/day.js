import {formatTimeDateTime, formatTimeMD} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const getDayInfo = (date, index) => {
  const formattedDate = formatTimeMD(date);
  const formattedDateTime = formatTimeDateTime(date, true);

  return (
    `<span class="day__counter">${index}</span>
    <time class="day__date" datetime="${formattedDateTime}">${formattedDate}</time>`
  );
};

const createDayTemplate = (date, index) => {
  const dayInfo = date && index ? getDayInfo(date, index) : ``;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfo}
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
