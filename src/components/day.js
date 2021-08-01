import {formatTimeDateTime, formatTimeMD} from "../utils.js";

export const createDayTemplate = (date, index) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index}</span>
        <time class="day__date" datetime="${formatTimeDateTime(date, true)}">${formatTimeMD(date)}</time>
      </div>
    </li>`
  );
};
