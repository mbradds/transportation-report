import {
  cerPalette,
  conversions,
  mouseOverFunction,
  mouseOutFunction,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart, createPaddMap } from "../../modules/charts.js";
import crudeExportsData from "./crude-oil-exports-by-destination-annual.json";
import Series from "highseries";

const createChart = (lang) => {
  const crudeExportColors = {
    "PADD I": cerPalette["Sun"],
    "PADD II": cerPalette["Night Sky"],
    "PADD III": cerPalette["Ocean"],
    "PADD IV": cerPalette["Forest"],
    "PADD V": cerPalette["Cool Grey"],
    Other: cerPalette["Flame"],
  };

  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");

  const createCrudeExportsChart = (seriesData, units) => {
    return new Highcharts.chart("container_crude_exports", {
      chart: {
        type: "column",
      },

      credits: {
        enabled: false,
      },

      plotOptions: {
        series: {
          events: {
            mouseOver: function () {
              var currentSelection = this.name;
              mouseOverFunction(paddMap.series, currentSelection);
            },
            mouseOut: function () {
              mouseOutFunction(paddMap.series);
            },
          },
        },
      },

      tooltip: {
        pointFormat: tooltipPoint(units.unitsCurrent),
      },

      yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: { text: units.unitsCurrent },
        stackLabels: {
          enabled: true,
        },
      },

      series: seriesData,
    });
  };

  try {
    var series = new Series({
      data: crudeExportsData,
      colors: crudeExportColors,
      xCol: "Year",
      yCols: "PADD",
      valuesCol: "Value",
    });
    var chartCrudeExports = createCrudeExportsChart(series.hcSeries, units);
  } catch (err) {
    errorChart("container_crude_exports");
  }

  try {
    var paddMap = createPaddMap(
      "container_padd_map",
      chartCrudeExports,
      crudeExportColors
    );
  } catch (err) {
    errorChart("container_padd_map");
  }

  var selectCrudeExports = document.getElementById(
    "select_units_crude_exports"
  );
  selectCrudeExports.addEventListener("change", (selectCrudeExports) => {
    units.unitsCurrent = selectCrudeExports.target.value;
    if (units.unitsCurrent !== units.unitsBase) {
      series.update({
        data: crudeExportsData,
        transform: {
          conv: [units.conversion, units.type],
          decimals: 2,
        },
      });
    } else {
      series.update({
        data: crudeExportsData,
        transform: {
          conv: undefined,
          decimals: undefined,
        },
      });
    }

    chartCrudeExports.update({
      series: series.hcSeries,
      yAxis: {
        title: { text: units.unitsCurrent },
      },
      tooltip: {
        pointFormat: tooltipPoint(units.unitsCurrent),
      },
    });
  });

  return chartCrudeExports;
};

export function kevinCrudeExports(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
