import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
} from "../../modules/util.js";

import creditData from "./CreditTables.json";

export const jenniferRatings = () => {

    const creditFilters = {'Company':'Enbridge Inc.'}

  const scale = {
    "Highest credit quality": { "S&P": "AAA", Moodys: "Aaa" },
    "Superior/High Quality #1": { "S&P": "AA+", Moodys: "Aa1" },
  };

  Highcharts.chart("container_ratings", {
    chart: {
      type: "line",
      plotBorderWidth: 1,
      inverted: true,
    },

    legend: {
      enabled: true,
    },

    yAxis: {
      categories: true,
      gridLineWidth: 1,
    },
    xAxis: {
      categories: true,
    },
    tooltip: {
      formatter: function () {
        return this.series.name + " - " + scale[this.key][this.series.name];
      },
    },
    series: [
      {
        name: "S&P",
        data: [
          {
            y: 2015,
            x: 1,
            name: "Highest credit quality",
          },
          {
            y: 2016,
            x: 2,
            name: "Superior/High Quality #1",
          },
        ],
      },
      {
        name: "Moodys",
        data: [
          {
            y: 2015,
            x: 1,
            name: "Highest credit quality",
          },
          {
            y: 2016,
            x: 2,
            name: "Superior/High Quality #1",
          },
        ],
      },
    ],
  });
};
