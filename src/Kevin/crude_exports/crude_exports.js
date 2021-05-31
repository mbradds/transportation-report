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

const createChart = (lang, langUnits, translate) => {
  const crudeExportColors = {
    "PADD I": cerPalette["Sun"],
    "PADD II": cerPalette["Night Sky"],
    "PADD III": cerPalette["Ocean"],
    "PADD IV": cerPalette["Forest"],
    "PADD V": cerPalette["Cool Grey"],
    Other: cerPalette["Flame"],
  };

  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");
  units.display = langUnits[units.unitsCurrent];

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
        pointFormat: tooltipPoint(units.display),
      },

      yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: { text: units.display },
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
      crudeExportColors,
      lang
    );
  } catch (err) {
    errorChart("container_padd_map");
  }

  var selectCrudeExports = document.getElementById(
    "select_units_crude_exports"
  );
  selectCrudeExports.addEventListener("change", (selectCrudeExports) => {
    units.unitsCurrent = selectCrudeExports.target.value;
    units.display = langUnits[units.unitsCurrent];
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
        title: { text: units.display },
      },
      tooltip: {
        pointFormat: tooltipPoint(units.display),
      },
    });
    translate(chartCrudeExports);
  });

  return chartCrudeExports;
};

export function kevinCrudeExports(lang, langUnits, translate) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang, langUnits, translate)), 0);
  });
}
