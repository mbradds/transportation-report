import {
  cerPalette,
  prepareSeriesNonTidy,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart, createPaddMap } from "../../modules/charts.js";
import nglData from "./destination.json";

export const ryanNglDestination = () => {
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");

  const nglFilters = {
    Product: "Propane",
  };

  const setTitle = (figure_title, filters) => {
    figure_title.innerText = `Figure 16 b: ${filters.Product} Export Destination`;
  };

  const nglDestinationColors = {
    "PADD I": cerPalette["Sun"],
    "PADD II": cerPalette["Night Sky"],
    "PADD III": cerPalette["Ocean"],
    "PADD IV": cerPalette["Forest"],
    "PADD V": cerPalette["Cool Grey"],
    Other: cerPalette["Flame"],
  };
  const createNglDestSeries = (nglData, nglFilters, units, nglColors) => {
    return prepareSeriesNonTidy(
      nglData,
      nglFilters,
      units,
      ["PADD I", "PADD II", "PADD III", "PADD IV", "PADD V", "Other"],
      "Period",
      nglColors
    );
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
        noData: "No Exports",
      },

      series: seriesData,
    });
  };

  try {
    var nglDestChart = createNglChart(
      createNglDestSeries(nglData, nglFilters, units, nglDestinationColors),
      units
    );
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
    nglDestChart.update({
      series: createNglDestSeries(
        nglData,
        nglFilters,
        units,
        nglDestinationColors
      ),
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
    nglDestChart.update({
      series: createNglDestSeries(
        nglData,
        nglFilters,
        units,
        nglDestinationColors
      ),
      yAxis: {
        title: { text: units.unitsCurrent },
      },
      tooltip: {
        pointFormat: tooltipPoint(units.unitsCurrent),
      },
    });
  });
};
