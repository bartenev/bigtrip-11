import {FilterType} from "../const";

const getFutureEvents = (events, nowDate) => {
  return events.filter((event) => event.dateFrom > nowDate);
};

const getPastEvents = (events, nowDate) => {
  return events.filter((event) => event.dateTo < nowDate);
};

const getAllEvents = (events) => {
  return events;
};

export const getEventsByFilter = (events, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return getAllEvents(events);
    case FilterType.FUTURE:
      return getFutureEvents(events, nowDate);
    case FilterType.PAST:
      return getPastEvents(events, nowDate);
  }
  return events;
};
