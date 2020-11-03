import { tooltipPoint, creditsClick } from "./util.js";
export const productionChart = (params) => {
  return new Highcharts.chart(params.div, {
    chart: {
      type: "column",
      borderWidth: 1,
      events: {
        load: function () {
          creditsClick(this, params.sourceLink);
        },
      },
    },

    credits: {
      text: params.sourceText,
    },

    tooltip: {
      pointFormat: tooltipPoint(params.units.unitsCurrent),
    },

    yAxis: {
      title: { text: params.units.unitsCurrent },
      stackLabels: {
        enabled: true,
      },
    },

    series: params.series,
  });
};

export const lineAndStackedArea = (params) => {
  return new Highcharts.chart(params.div, {
    chart: {
      zoomType: "x",
      borderWidth: 1,
      events: {
        load: function () {
          creditsClick(this, params.sourceLink);
        },
      },
    },

    credits: {
      text: params.sourceText,
    },

    tooltip: {
      shared: true,
      pointFormat: tooltipPoint(params.units.unitsCurrent),
    },

    xAxis: {
      type: params.xAxisType,
      crosshair: true,
    },

    yAxis: {
      title: { text: params.units.unitsCurrent },
    },

    series: params.series,
  });
};
