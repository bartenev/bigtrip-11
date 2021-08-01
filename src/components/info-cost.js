const getTotalCost = (events) => {
  return events.reduce((sumEvents, event) => {
    return sumEvents + event.price + event.offers.reduce((sumOffers, offer) => {
      return sumOffers + (offer.isChecked ? offer.price : 0);
    }, 0);
  }, 0);
};


export const createInfoCostTemplate = (events) => {
  const totalCost = getTotalCost(events);
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};
