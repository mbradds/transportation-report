import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";

import marineData from "./marine_exports.json";

export const coletteMarine = () => {
  const marineColors = { "Mb/d": cerPalette["Ocean"] };
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");

  const createMarineSeries = (marineData, units, marineColors) => {
    var seriesData = prepareSeriesNonTidy(
      marineData,
      false,
      units,
      ["Mb/d"],
      "Date",
      marineColors
    );
    seriesData[0].name = "Marine Volumes";
    return seriesData;
  };

  const createMarineChart = (seriesData, units) => {
    return new Highcharts.chart("container_crude_marine", {
      chart: {
        type: "area",
        zoomType: "x",
        borderWidth: 1,
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

      plotOptions: {
        series: {
          events: {
            legendItemClick: function (e) {
              e.preventDefault();
            },
          },
        },
      },

      tooltip: {
        shared: true,
        pointFormat: tooltipPoint(units.unitsCurrent),
      },

      xAxis: {
        type: "datetime",
        crosshair: true,
      },

      yAxis: {
        title: { text: units.unitsCurrent },
      },

      series: seriesData,
    });
  };

  const mainMarine = () => {
    var seriesData = createMarineSeries(marineData, units, marineColors);
    var marineChart = createMarineChart(seriesData, units);
    var selectUnitsMarine = document.getElementById("select_units_marine");

    selectUnitsMarine.addEventListener("change", (selectUnitsMarine) => {
      units.unitsCurrent = selectUnitsMarine.target.value;
      marineChart.update({
        series: createMarineSeries(marineData, units, marineColors),
        yAxis: {
          title: { text: units.unitsCurrent },
        },
        tooltip: {
          pointFormat: tooltipPoint(units.unitsCurrent),
        },
      });
    });
  };

  try {
    mainMarine();
  } catch (err) {
    errorChart("container_crude_marine");
  }
};
