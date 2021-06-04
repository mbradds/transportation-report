import {
  cerPalette,
  creditsClick,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import Series from "highseries";
import marineData from "./marine_exports.json";

const createChart = (lang, langUnits) => {
  const marineColors = { "Mb/d": cerPalette["Ocean"] };
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");
  units.display = langUnits[units.unitsCurrent];

  const createMarineChart = (seriesData, units) => {
    return new Highcharts.chart("container_crude_marine", {
      chart: {
        type: "area",
        zoomType: "x",
        // borderWidth: 1,
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
        pointFormat: tooltipPoint(units.display),
      },

      legend: {
        enabled: false,
      },

      xAxis: {
        type: "datetime",
        crosshair: true,
      },

      yAxis: {
        title: { text: units.display },
      },

      series: seriesData,
    });
  };

  const mainMarine = () => {
    let series = new Series({
      data: marineData,
      xCol: "Date",
      yCols: ["Mb/d"],
      colors: marineColors,
    });
    var marineChart = createMarineChart(series.hcSeries, units);
    var selectUnitsMarine = document.getElementById("select_units_marine");

    selectUnitsMarine.addEventListener("change", (selectUnitsMarine) => {
      units.unitsCurrent = selectUnitsMarine.target.value;
      units.display = langUnits[units.unitsCurrent];
      if (units.unitsCurrent !== units.unitsBase) {
        series.update({
          data: marineData,
          transform: {
            conv: [units.conversion, units.type],
            decimals: 1,
          },
        });
      } else {
        series.update({
          data: marineData,
          transform: {
            conv: undefined,
            decimals: undefined,
          },
        });
      }
      marineChart.update({
        series: series.hcSeries,
        yAxis: {
          title: { text: units.display },
        },
        tooltip: {
          pointFormat: tooltipPoint(units.display),
        },
      });
    });
  };

  try {
    return mainMarine();
  } catch (err) {
    return errorChart("container_crude_marine");
  }
};

export function coletteMarine(lang, langUnits) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang, langUnits)), 0);
  });
}
