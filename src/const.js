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

const MONTH_NAMES = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];

export {WAYPOINT_TYPES, MONTH_NAMES};
