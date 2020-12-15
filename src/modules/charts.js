import {
  tooltipPoint,
  creditsClick,
  cerPalette,
  bands,
  annotation,
} from "./util.js";
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

    xAxis: {
      categories: true,
      plotBands: bands(2019.5, 2020.5, "Estimated Value", 10),
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
      crosshair: params.crosshair,
    },

    yAxis: {
      title: { text: params.units.unitsCurrent },
    },

    series: params.series,
  });
};

export const errorChart = (div) => {
  console.log("Error loading chart to div: " + div);
  return new Highcharts.chart(div, {
    chart: {
      zoomType: "x",
      borderWidth: 1,
    },
    credits: {
      text: "",
    },
    series: null,
    lang: {
      noData: "Error loading chart. Please try again later.",
    },
  });
};

export const instructionsChart = () => {
  return new Highcharts.chart("hc-instructions", {
    chart: {
      borderWidth: 1,
      zoomType: "x",
    },
    title: {
      text: "",
    },
    credits: {
      text: "",
    },
    yAxis: {
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      title: {
        text: "",
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        var seriesName = this.series.name.split("(")[0].trim();
        var toolText = `<b>${this.x}</b><br>`;
        toolText += `<tr><td> <span style="color: ${this.series.color}">&#9679</span> ${seriesName}: </td><td style="padding:0"><b>${this.point.y}</b></td></tr>`;
        return toolText;
      },
    },
    xAxis: {},
    legend: {},
    plotOptions: {
      series: {
        pointStart: 2013,
      },
    },
    annotations: [
      annotation(
        290,
        16,
        cerPalette["Dim Grey"],
        "Click on this icon to download chart images/data:"
      ),
    ],
    series: [
      {
        name: "Data 1 (click to filter)",
        color: cerPalette["Night Sky"],
        data: [7, 8, 5, 6, 4, 4, 5, 4],
      },
      {
        name: "Data 2 (click to filter)",
        color: cerPalette["Sun"],
        data: [1, 2, 4, 3, 3, 5, 6, 5],
      },
    ],
  });
};
