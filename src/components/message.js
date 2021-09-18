import AbstractComponent from "./abstract-component.js";

const createNotificationTemplate = (text) => {
  return (
    `<p class="trip-events__msg">${text}</p>`
  );
};

export const MessageText = {
  NO_POINTS: `Click New Event to create your first point`,
  LOADING: `Loading...`,
};

export default class Message extends AbstractComponent {
  constructor(text) {
    super();
    this._text = text;
  }
  getTemplate() {
    return createNotificationTemplate(this._text);
  }
}
