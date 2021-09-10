const transportWaypointTypes = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const placeWaypointTypes = [`check-in`, `sightseeing`, `restaurant`];

const generateWaypointTypes = () => {
  return transportWaypointTypes.map((it) => {
    return {
      name: it,
      type: `transport`,
    };
  }).concat(placeWaypointTypes.map((it) => {
    return {
      name: it,
      type: `place`,
    };
  }));
};

const WAYPOINT_TYPES = generateWaypointTypes();

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export {WAYPOINT_TYPES, FilterType};
