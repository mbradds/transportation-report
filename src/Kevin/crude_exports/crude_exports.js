import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
  conversions,
  mouseOverFunction,
  mouseOutFunction,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart, createPaddMap } from "../../modules/charts.js";
import crudeExportsData from "./crude-oil-exports-by-destination-annual.json";

export const kevinCrudeExports = () => {
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
        title: { text: units.unitsCurrent },
        stackLabels: {
          enabled: true,
        },
      },

      series: seriesData,
    });
  };

  try {
    var seriesData = prepareSeriesTidy(
      crudeExportsData,
      false,
      units,
      "PADD",
      "Year",
      "Value",
      crudeExportColors
    );
    var chartCrudeExports = createCrudeExportsChart(seriesData, units);
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

  var selectUnitsCrudeExports = document.getElementById(
    "select_units_crude_exports"
  );
  selectUnitsCrudeExports.addEventListener(
    "change",
    (selectUnitsCrudeExports) => {
      units.unitsCurrent = selectUnitsCrudeExports.target.value;
      var seriesData = prepareSeriesTidy(
        crudeExportsData,
        false,
        units,
        "PADD",
        "Year",
        "Value",
        crudeExportColors
      );

      chartCrudeExports.update({
        series: seriesData,
        yAxis: {
          title: { text: units.unitsCurrent },
        },
        tooltip: {
          pointFormat: tooltipPoint(units.unitsCurrent),
        },
      });
    }
  );
};
