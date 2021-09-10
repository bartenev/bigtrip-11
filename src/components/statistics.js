import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {WAYPOINT_TYPES} from "../const";
import moment from "moment";

const getChart = (ctx, name, measure, labels, data) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}${measure}`,
        }
      },
      title: {
        display: true,
        text: name,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const getData = (allTypes) => {
  const types = allTypes; // .filter((type) => type.data !== 0);

  types.sort((first, second) => second.data - first.data);

  const labels = types.map((type) => type.name.toUpperCase());
  const data = types.map((type) => type.data);

  return {
    labels,
    data
  };
};

const renderMoneyChart = (moneyCtx, events) => {
  const allTypes = WAYPOINT_TYPES.map((type) => {
    return {
      name: type.name,
      data: 0,
    };
  });

  events.forEach((event) => {
    const index = allTypes.findIndex((type) => type.name === event.type.name);
    allTypes[index].data = allTypes[index].data + event.basePrice;
  });

  const {labels, data} = getData(allTypes);

  return getChart(moneyCtx, `MONEY`, ` €`, labels, data);
};


const renderTransportChart = (transportCtx, events) => {
  const allTypes = WAYPOINT_TYPES.filter((type) => type.type === `transport`).map((type) => {
    return {
      name: type.name,
      data: 0,
    };
  });

  events.forEach((event) => {
    const index = allTypes.findIndex((type) => type.name === event.type.name);
    if (index !== -1) {
      allTypes[index].data = allTypes[index].data + 1;
    }
  });

  const {labels, data} = getData(allTypes);

  return getChart(transportCtx, `TRANSPORT`, `x`, labels, data);
};

const renderTimeSpentChart = (timeSpendCtx, events) => {
  const allTypes = WAYPOINT_TYPES.map((type) => {
    return {
      name: type.name,
      data: 0,
    };
  });

  events.forEach((event) => {
    const index = allTypes.findIndex((type) => type.name === event.type.name);
    if (index !== -1) {
      const startMoment = moment(event.dateFrom);
      const finalMoment = moment(event.dateTo);
      const subtractDates = moment.duration(finalMoment.diff(startMoment)).asHours();
      allTypes[index].data = allTypes[index].data + subtractDates;
    }
  });

  const roundAllTypes = allTypes.map((type) => {
    return {
      name: type.name,
      data: Math.round(type.data),
    };
  });

  const {labels, data} = getData(roundAllTypes);

  return getChart(timeSpendCtx, `TIME SPENT`, `H`, labels, data);
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(eventsModel) {
    super();

    this._eventsModel = eventsModel;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;

    this._renderCharts();
  }
  getTemplate() {
    return createStatisticsTemplate();
  }

  recoveryListeners() {}

  rerender(eventsModel) {
    this._eventsModel = eventsModel;
    super.rerender();
    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx =
      element.querySelector(`.statistics__chart--money`);
    const transportCtx =
      element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx =
      element.querySelector(`.statistics__chart--time`);

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 10;
    transportCtx.height = BAR_HEIGHT * 7;
    timeSpendCtx.height = BAR_HEIGHT * 10;

    this._resetCharts();

    const events = this._eventsModel.getEvents();

    this._moneyChart = renderMoneyChart(moneyCtx, events);
    this._transportChart = renderTransportChart(transportCtx, events);
    this._timeSpentChart = renderTimeSpentChart(timeSpendCtx, events);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpentChart) {
      this._timeSpentChart.destroy();
      this._timeSpentChart = null;
    }
  }
}
