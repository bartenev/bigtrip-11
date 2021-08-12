import AbstractComponent from "./abstract-component.js";

const createEventsListTemplate = () => {
  return (
    `<ul class="trip-events__list"></ul>`
  );
};

export default class EventsList extends AbstractComponent {
  getTemplate() {
    return createEventsListTemplate();
  }
}
