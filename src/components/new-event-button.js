import AbstractComponent from "./abstract-component.js";

const createButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class NewEventButton extends AbstractComponent {
  getTemplate() {
    return createButtonTemplate();
  }

  setButtonClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
