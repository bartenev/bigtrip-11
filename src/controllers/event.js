import {render, replace, remove, RenderPosition} from "../utils/render.js";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import {WAYPOINT_TYPES} from "../const";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyEvent = {
  basePrice: ``,
  dateFrom: new Date().setHours(0, 0, 0),
  dateTo: new Date().setHours(0, 0, 1),
  destination: ``,
  id: String(Math.random()).replace(`.`, ``),
  isFavorite: false,
  offers: [],
  type: WAYPOINT_TYPES[0],
};

export default class EventController {
  constructor(container, destinationsModel, offersModel, onDataChange, onViewChange) {
    this._container = container;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;

    if (this._mode === Mode.ADDING) {
      event.offers = this._offersModel.getOffer(event.type.name).offers;
    }

    this._eventComponent = new EventComponent(event);
    this._eventEditComponent = new EventEditComponent(event, this._destinationsModel, this._offersModel, this._mode);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._eventEditComponent.getData();
      if (data) {
        this._onDataChange(this, event, data);
        this._replaceEditToEvent();
      }
    });

    this._eventEditComponent.setRemoveHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, event, null);
      // this._replaceEditToEvent();
    });

    this._eventEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, event, Object.assign({}, event, {
        isFavorite: !event.isFavorite,
      }), false);
    });

    this._eventEditComponent.setCloseButtonClickHandler(() => {
      this._eventEditComponent.reset();
      this._replaceEditToEvent();
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEventEditComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
        } else {
          render(this._container, this._eventComponent);
        }
        break;
      case Mode.ADDING:
        // if (oldTaskEditComponent && oldTaskComponent) {
        //   remove(oldTaskComponent);
        //   remove(oldTaskEditComponent);
        // }

        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.AFTER);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._eventEditComponent.reset();

    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
      console.log(111);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
    }
  }

}
