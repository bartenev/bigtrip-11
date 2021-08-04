import {WAYPOINT_TYPES} from "../const.js";

const trueOrFalse = () => {
  return (Math.random() > 0.5);
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.round(Math.random() * (max - min));
};

const descriptionText = (
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Cras aliquet varius magna, non porta ligula feugiat eget.
Fusce tristique felis at fermentum pharetra.
Aliquam id orci ut lectus varius viverra.
Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.
Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.
Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
Sed sed nisi sed augue convallis suscipit in sed felis.
Aliquam erat volutpat.
Nunc fermentum tortor ac porta dapibus.
In rutrum ac purus sit amet tempus.`);

const descriptionItems = descriptionText.split(`.\n`);

const destinations = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];

const additionalOffers = [
  {
    type: `luggage`,
    name: `Add luggage`,
  },
  {
    type: `comfort`,
    name: `Switch to comfort class`,
  },
  {
    type: `meal`,
    name: `Add meal`,
  },
  {
    type: `seats`,
    name: `Choose seats`,
  },
  {
    type: `train`,
    name: `Travel by train`,
  },
];

const getDescription = () => {
  let descriptionItem = ``;
  for (let i = 0; i < getRandomIntegerNumber(1, 5); i++) {
    descriptionItem += descriptionItems[getRandomIntegerNumber(0, descriptionItems.length - 1)];
    descriptionItem += `. `;
  }
  return descriptionItem;
};

const getPhotos = () => {
  let photos = [];
  for (let i = 0; i < 5; i++) {
    photos.push({
      url: `http://picsum.photos/248/152?r=${Math.random()}`,
      description: `Event photo`,
    });
  }
  return photos;
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const rangeDays = 1;
  const diffValue = sign * getRandomIntegerNumber(0, rangeDays);
  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(getRandomIntegerNumber(0, 23));
  targetDate.setMinutes(getRandomIntegerNumber(0, 59));
  return targetDate;
};

const getRandomOffers = (count) => {

  if (count === 0) {
    return [];
  }

  let randomOffers = additionalOffers.map((it) => {
    return {
      type: it.type,
      name: it.name,
      price: getRandomIntegerNumber(1, 300),
      isChecked: trueOrFalse(),
    };
  });

  let indices = randomOffers.map((it, index)=> {
    return index;
  });

  let offers = [];
  for (let i = 0; i < count; i++) {
    const currentIndex = getRandomIntegerNumber(0, indices.length - 1);
    offers.push(randomOffers[indices[currentIndex]]);
    indices.splice(currentIndex, 1);
  }

  return offers;
};

const generateEvent = () => {
  let startTime = getRandomDate();
  let finishTime = getRandomDate();

  if (finishTime < startTime) {
    const temp = startTime;
    startTime = finishTime;
    finishTime = temp;
  }

  return {
    type: WAYPOINT_TYPES[getRandomIntegerNumber(0, WAYPOINT_TYPES.length - 1)],
    destination: destinations[getRandomIntegerNumber(0, destinations.length - 1)],
    description: getDescription(),
    photos: getPhotos(),
    price: Math.round(Math.random() * 100),
    startTime,
    finishTime,
    offers: getRandomOffers(getRandomIntegerNumber(0, 5)),
    isFavorite: trueOrFalse(),
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvents, destinations, additionalOffers};
