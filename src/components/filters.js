const filterNames = [`everything`, `future`, `past`];

const createFiltersMarkup = () => {
  return filterNames.map((name) => {
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${name === `everything` ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
      </div>`
    );
  }).join(`\n`);
};

export const createFiltersTemplate = () => {
  const filtersMarkup = createFiltersMarkup();
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
