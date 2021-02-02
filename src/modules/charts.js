import {
  tooltipPoint,
  creditsClick,
  cerPalette,
  bands,
  annotation,
  mouseOverFunction,
  mouseOutFunction,
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
      endOnTick: false,
    },

    series: params.series,
  });
};

export const errorChart = (div) => {
  console.log("Error loading chart to div: " + div);
  return new Highcharts.chart(div, {
    credits: {
      text: "",
    },
    series: null,
    lang: {
      noData: "Error loading chart. Please try again later.",
    },
  });
};

export const createPaddMap = (div, actionChart, paddColors) => {
  return new Highcharts.mapChart(div, {
    chart: {
      type: "map",
      map: "countries/us/custom/us-all-mainland",
      events: {
        load: function () {
          creditsClick(
            this,
            "https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english"
          );
        },
      },
    },

    credits: {
      text: "Source: CER Commodity Tracking System",
    },

    legend: {
      enabled: false,
    },

    tooltip: {
      formatter: function () {
        return this.series.name;
      },
    },

    plotOptions: {
      map: {
        allAreas: false,
      },
      series: {
        states: {
          inactive: {
            opacity: 0.5,
          },
          hover: {
            brightness: 0,
          },
        },
        events: {
          mouseOver: function () {
            var currentSelection = this.name;
            mouseOverFunction(this.chart.series, currentSelection);
            mouseOverFunction(actionChart.series, currentSelection);
          },
          mouseOut: function () {
            mouseOutFunction(this.chart.series);
            mouseOutFunction(actionChart.series);
          },
        },
      },
    },

    series: [
      {
        name: "PADD I",
        data: [
          ["us-me", 1],
          ["us-vt", 1],
          ["us-nh", 1],
          ["us-ma", 1],
          ["us-ct", 1],
          ["us-ri", 1],
          ["us-ny", 1],
          ["us-pa", 1],
          ["us-nj", 1],
          ["us-de", 1],
          ["us-md", 1],
          ["us-wv", 1],
          ["us-va", 1],
          ["us-nc", 1],
          ["us-sc", 1],
          ["us-ga", 1],
          ["us-fl", 1],
        ],
        color: paddColors["PADD I"],
      },
      {
        name: "PADD II",
        data: [
          ["us-nd", 1],
          ["us-sd", 1],
          ["us-ne", 1],
          ["us-ks", 1],
          ["us-ok", 1],
          ["us-mn", 1],
          ["us-ia", 1],
          ["us-mo", 1],
          ["us-wi", 1],
          ["us-il", 1],
          ["us-mi", 1],
          ["us-in", 1],
          ["us-ky", 1],
          ["us-tn", 1],
          ["us-oh", 1],
        ],
        color: paddColors["PADD II"],
      },
      {
        name: "PADD III",
        data: [
          ["us-tx", 1],
          ["us-la", 1],
          ["us-nm", 1],
          ["us-ms", 1],
          ["us-al", 1],
          ["us-ar", 1],
        ],
        color: paddColors["PADD III"],
      },
      {
        name: "PADD IV",
        data: [
          ["us-mt", 1],
          ["us-id", 1],
          ["us-ut", 1],
          ["us-co", 1],
          ["us-wy", 1],
        ],
        color: paddColors["PADD IV"],
      },
      {
        name: "PADD V",
        data: [
          ["us-wa", 1],
          ["us-or", 1],
          ["us-ca", 1],
          ["us-nv", 1],
          ["us-az", 1],
        ],
        color: paddColors["PADD V"],
      },
    ],
  });
};

export async function instructionsChart(lang) {
  return new Highcharts.chart("hc-instructions", {
    chart: {
      borderWidth: 1,
      zoomType: "x",
      animation: false,
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
        animation: false,
      },
    },
    annotations: [annotation(290, 16, cerPalette["Dim Grey"], lang.annotation)],
    series: [
      {
        name: lang.series1,
        color: cerPalette["Night Sky"],
        data: [7, 8, 5, 6, 4, 4, 5, 4],
      },
      {
        name: lang.series2,
        color: cerPalette["Sun"],
        data: [1, 2, 4, 3, 3, 5, 6, 5],
      },
    ],
  });
}

// export function instructionsChart() {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(createInstructionChart()), 0);
//   });
// }
