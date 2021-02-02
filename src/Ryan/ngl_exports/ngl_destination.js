import { cerPalette, conversions, tooltipPoint } from "../../modules/util.js";
import Series from "highseries";
import { errorChart, createPaddMap } from "../../modules/charts.js";
import nglData from "./destination.json";

const createChart = (lang) => {
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");

  const nglFilters = {
    Product: "Propane",
  };

  const setTitle = (figure_title, filters) => {
    figure_title.innerText = `${lang.figureNum} ${filters.Product} ${lang.exports}`;
  };

  const nglDestinationColors = {
    "PADD I": cerPalette["Sun"],
    "PADD II": cerPalette["Night Sky"],
    "PADD III": cerPalette["Ocean"],
    "PADD IV": cerPalette["Forest"],
    "PADD V": cerPalette["Cool Grey"],
    Other: cerPalette["Flame"],
  };

  const createNglChart = (seriesData, units) => {
    return new Highcharts.chart("container_ngl_destination", {
      chart: {
        type: "area",
        zoomType: "x",
      },

      credits: {
        text: "",
      },

      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
          connectNulls: false,
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
        endOnTick: false,
      },

      lang: {
        noData: lang.noData,
      },

      series: seriesData,
    });
  };

  try {
    var series = new Series({
      data: nglData,
      xCol: "Period",
      yCols: ["PADD I", "PADD II", "PADD III", "PADD IV", "PADD V", "Other"],
      filters: nglFilters,
      colors: nglDestinationColors,
    });
    var nglDestChart = createNglChart(series.hcSeries, units);
  } catch (err) {
    errorChart("container_ngl_destination");
  }

  try {
    var paddMap = createPaddMap(
      "container_padd_map_ngl",
      nglDestChart,
      nglDestinationColors
    );
  } catch (err) {
    errorChart("container_padd_map_ngl");
  }

  var figure_title = document.getElementById("ngl_destination_title");
  setTitle(figure_title, nglFilters);

  var selectProductNgl = document.getElementById(
    "select_product_ngl_destination"
  );
  selectProductNgl.addEventListener("change", (selectProductNgl) => {
    nglFilters.Product = selectProductNgl.target.value;
    setTitle(figure_title, nglFilters);
    series.update({ data: nglData, filters: nglFilters });
    nglDestChart.update({
      series: series.hcSeries,
    });
  });

  var selectNglChart = document.getElementById("select_ngl_chart_type");
  selectNglChart.addEventListener("change", (selectNglChart) => {
    var newChartType = selectNglChart.target.value;
    nglDestChart.update({
      chart: {
        type: newChartType,
      },
    });
  });
  var selectUnitsNgl = document.getElementById("select_units_ngl_destination");
  selectUnitsNgl.addEventListener("change", (selectUnitsNgl) => {
    units.unitsCurrent = selectUnitsNgl.target.value;
    if (units.unitsCurrent !== units.unitsBase) {
      series.update({
        data: nglData,
        transform: {
          conv: [units.conversion, units.type],
          decimals: 2,
        },
      });
    } else {
      series.update({
        data: nglData,
        transform: {
          conv: undefined,
          decimals: undefined,
        },
      });
    }
    nglDestChart.update({
      series: series.hcSeries,
      yAxis: {
        title: { text: units.unitsCurrent },
      },
      tooltip: {
        pointFormat: tooltipPoint(units.unitsCurrent),
      },
    });
  });
  return 1;
};

export function ryanNglDestination(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
