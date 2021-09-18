import {render, replace, remove, RenderPosition} from "../utils/render.js";
import EventModel from "../models/event";
import EventComponent from "../components/event.js";
import EventEditComponent from "../components/event-edit.js";
import {WAYPOINT_TYPES} from "../const";
import {parseDate} from "../utils/common";

const SHAKE_ANIMATION_TIMEOUT = 600;

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

const parseFormData = (formData, eventId, destinationsModel, offersModel) => {
  const type = formData.get(`event-type`);
  const offers = [];

  offersModel.getOffer(type).slice().forEach((offer) => {
    const offerName = offer.title.toLowerCase().replace(/ /g, `-`);
    const offerData = Boolean(formData.get(`event-offer-${offerName}`));
    if (offerData) {
      offers.push({
        title: offer.title,
        price: offer.price,
      });
    }
  });

  return new EventModel({
    "base_price": Number(formData.get(`event-price`)),
    "date_from": parseDate(formData.get(`event-start-time`)),
    "date_to": parseDate(formData.get(`event-end-time`)),
    "destination": destinationsModel.getDestination(formData.get(`event-destination`)),
    "id": eventId,
    "is_favorite": Boolean(formData.get(`event-favorite`)),
    "offers": offers,
    "type": type,
  });
};

export default class EventController {
  constructor(container, destinationsModel, offersModel, onDataChange, onViewChange) {
    this._container = container;
    this._event = null;
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
    this._event = event;
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
      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._event.id, this._destinationsModel, this._offersModel);

      if (this._eventEditComponent.isValidData(data)) {
        this._eventEditComponent.setData({
          saveButtonText: `Saving...`,
        });
        this._onDataChange(this, event, data);
      }
    });

    this._eventEditComponent.setRemoveHandler((evt) => {
      evt.preventDefault();
      this._eventEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this._onDataChange(this, event, null);
    });

    this._eventEditComponent.setFavoriteButtonClickHandler(() => {
      const newEvent = EventModel.clone(event);
      newEvent.isFavorite = !newEvent.isFavorite;
      this._onDataChange(this, event, newEvent, false);
    });

    this._eventEditComponent.setCloseButtonClickHandler(() => {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, event, null);
      } else {
        this._eventEditComponent.reset();
        this._replaceEditToEvent();
      }
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
        // if (oldEventEditComponent && oldEventComponent) {
        //   remove(oldEventComponent);
        //   remove(oldEventEditComponent);
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

  shake() {
    this._eventComponent.getElement().classList.add(`shake`);
    this._eventEditComponent.getElement().classList.add(`shake`);

    setTimeout(() => {
      this._eventComponent.getElement().classList.remove(`shake`);
      this._eventEditComponent.getElement().classList.remove(`shake`);

      this._eventEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
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
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {

      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      }
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
