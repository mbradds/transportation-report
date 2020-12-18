import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import nglData from "./origin.json";

export const ryanNglExports = () => {
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");
  const nglFilters = {
    Product: "Propane",
    Origin: "Canada",
  };
  const setTitle = (figure_title, filters) => {
    figure_title.innerText = `Figure 16 a: ${filters.Origin} ${filters.Product} Exports`;
  };
  const nglColors = {
    Pipeline: cerPalette["Sun"],
    Railway: cerPalette["Night Sky"],
    Truck: cerPalette["Forest"],
    Marine: cerPalette["Ocean"],
  };

  const createNglExpSeries = (nglData, nglFilters, units, nglColors) => {
    return prepareSeriesNonTidy(
      nglData,
      nglFilters,
      units,
      ["Pipeline", "Railway", "Truck", "Marine"],
      "Period",
      nglColors
    );
  };

  const createNglChart = (seriesData, units) => {
    return new Highcharts.chart("container_ngl", {
      chart: {
        type: "line",
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
          connectNulls: false,
          states: {
            inactive: {
              opacity: 1,
            },
            hover: {
              enabled: false,
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
        endOnTick: false,
      },

      lang: {
        noData: "No Exports",
      },

      series: seriesData,
    });
  };

  const mainNglExports = () => {
    var seriesData = createNglExpSeries(nglData, nglFilters, units, nglColors);
    var figure_title = document.getElementById("ngl_title");
    setTitle(figure_title, nglFilters);
    var nglChart = createNglChart(seriesData, units);

    var selectProductNgl = document.getElementById("select_product_ngl");
    selectProductNgl.addEventListener("change", (selectProductNgl) => {
      nglFilters.Product = selectProductNgl.target.value;
      setTitle(figure_title, nglFilters);
      nglChart = createNglChart(
        createNglExpSeries(nglData, nglFilters, units, nglColors),
        units
      );
    });

    var selectRegionNgl = document.getElementById("select_region_ngl");
    selectRegionNgl.addEventListener("change", (selectRegionNgl) => {
      nglFilters.Origin = selectRegionNgl.target.value;
      setTitle(figure_title, nglFilters);
      nglChart = createNglChart(
        createNglExpSeries(nglData, nglFilters, units, nglColors),
        units
      );
    });

    var selectUnitsNgl = document.getElementById("select_units_ngl");
    selectUnitsNgl.addEventListener("change", (selectUnitsNgl) => {
      units.unitsCurrent = selectUnitsNgl.target.value;
      nglChart.update({
        series: createNglExpSeries(nglData, nglFilters, units, nglColors),
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
    mainNglExports();
  } catch (err) {
    errorChart("container_ngl");
  }
};
