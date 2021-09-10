import AbstractComponent from "./abstract-component.js";

export const TabsItem = {
  STATISTICS: `stats`,
  TABLE: `table`
};

const ACTIVE_CLASS = `trip-tabs__btn--active`;

const createTabsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" id="table" href="#">Table</a>
      <a class="trip-tabs__btn" id="stats" href="#">Stats</a>
    </nav>`
  );
};

export default class Tabs extends AbstractComponent {
  getTemplate() {
    return createTabsTemplate();
  }

  setActiveItem(tabsItem) {
    const oldActiveItem = this.getElement().querySelector(`.${ACTIVE_CLASS}`);
    const newActiveItem = this.getElement().querySelector(`#${tabsItem}`);

    if (oldActiveItem !== newActiveItem && newActiveItem) {
      oldActiveItem.classList.remove(ACTIVE_CLASS);
      newActiveItem.classList.add(ACTIVE_CLASS);
    }
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const tabsItem = evt.target.id;
      this.setActiveItem(tabsItem);
      handler(tabsItem);
    });
  }
}
