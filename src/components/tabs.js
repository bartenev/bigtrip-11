import AbstractComponent from "./abstract-component.js";

const createTabsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class Tabs extends AbstractComponent {
  getTemplate() {
    return createTabsTemplate();
  }
}
