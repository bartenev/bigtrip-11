import {WAYPOINT_TYPES} from "../const";

export default class Event {
  constructor(data) {
    this.basePrice = data[`base_price`];
    this.dateFrom = new Date(data[`date_from`]);
    this.dateTo = new Date(data[`date_to`]);
    this.destination = data[`destination`] || ``;
    this.id = data[`id`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`] || [];
    this.type = WAYPOINT_TYPES.find((type) => type.name === data[`type`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "description": this.description,
      "due_date": this.dueDate ? this.dueDate.toISOString() : null,
      "repeating_days": this.repeatingDays,
      "color": this.color,
      "is_favorite": this.isFavorite,
      "is_archived": this.isArchive,
    };
  }

  static parseEvent(data) {
    return new Event(data);
  }

  static parseEvents(data) {
    return data.map(Event.parseEvent);
  }

  static clone(data) {
    return new Event(data.toRAW());
  }
}
