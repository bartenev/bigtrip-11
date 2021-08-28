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

const getDescription = () => {
  let descriptionItem = ``;
  for (let i = 0; i < getRandomIntegerNumber(1, 5); i++) {
    descriptionItem += descriptionItems[getRandomIntegerNumber(0, descriptionItems.length - 1)];
    descriptionItem += `. `;
  }
  return descriptionItem;
};

const getPictures = () => {
  let photos = [];
  for (let i = 0; i < 5; i++) {
    photos.push({
      src: `http://picsum.photos/248/152?r=${Math.random()}`,
      description: `Event photo`,
    });
  }
  return photos;
};

const destinationsName = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];

const destinations = destinationsName.map((name) => {
  return {
    description: getDescription(),
    name,
    pictures: getPictures(),
  };
});

const additionalOffers = [
  {
    type: `luggage`,
    title: `Add luggage`,
  },
  {
    type: `comfort`,
    title: `Switch to comfort class`,
  },
  {
    type: `meal`,
    title: `Add meal`,
  },
  {
    type: `seats`,
    title: `Choose seats`,
  },
  {
    type: `train`,
    title: `Travel by train`,
  },
];

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
      title: it.title,
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

const offers = WAYPOINT_TYPES.map((type) => {
  return {
    type,
    offers: getRandomOffers(getRandomIntegerNumber(0, 5)),
  };
});

let indexEvent = -1;

const generateEvent = () => {
  const destination = destinations[getRandomIntegerNumber(0, destinations.length - 1)];
  const type = WAYPOINT_TYPES[getRandomIntegerNumber(0, WAYPOINT_TYPES.length - 1)];
  let dateFrom = getRandomDate();
  let dateTo = getRandomDate();
  indexEvent += 1;

  if (dateTo < dateFrom) {
    const temp = dateFrom;
    dateFrom = dateTo;
    dateTo = temp;
  }

  return {
    basePrice: Math.round(Math.random() * 100),
    dateFrom,
    dateTo,
    destination,
    id: indexEvent,
    isFavorite: trueOrFalse(),
    offers: offers.find((it) => it.type === type).offers,
    type,
  };
};

const generateEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateEvent);
};

export {generateEvents, destinations, offers};
