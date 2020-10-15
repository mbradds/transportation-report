import {
  cerPalette,
  fillDropUpdate,
  getUnique,
  prepareSeriesNonTidyUnits,
  creditsClick
} from "../../modules/util.js";

import nglData from "./natural-gas-liquids-exports-monthly.json";

export const ryanNglExports = () => {
  const nglUnits = { Units: "Mb/d" };
  const nglFilters = {
    Product: "Propane",
    Region: "Canada",
  };
  const nglColors = {
    Pipeline: cerPalette["Sun"],
    Railway: cerPalette["Night Sky"],
    Truck: cerPalette["Forest"],
    Marine: cerPalette["Ocean"],
  };

  var seriesData = prepareSeriesNonTidyUnits(
    nglData,
    nglFilters,
    nglUnits.Units,
    "Mb/d",
    159,
    "*",
    ["Pipeline", "Railway", "Truck", "Marine"],
    "Period",
    nglColors
  );
  fillDropUpdate(
    "select_region_ngl",
    getUnique(nglData, "Region"),
    false,
    "Canada"
  );

  const createNglChart = (seriesData, nglFilters, nglUnits) => {
    const chart = new Highcharts.chart("container_ngl", {
      chart: {
        type: "line",
        zoomType: "x", 
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(this,"https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english")
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
      },

      title: { text: `${nglFilters.Region} ${nglFilters.Product} Exports` },

      xAxis: {
        type: "datetime",
        dateTimeLabelFormats: {
          day: "%e of %,b",
        },
        crosshair: true,
      },

      yAxis: {
        title: { text: nglUnits.Units },
      },

      lang: {
        noData: "No Exports",
      },

      series: seriesData,
    });

    return chart;
  };

  var nglChart = createNglChart(seriesData, nglFilters, nglUnits);

  var selectProductNgl = document.getElementById("select_product_ngl");
  selectProductNgl.addEventListener("change", (selectProductNgl) => {
    var product = selectProductNgl.target.value;
    nglFilters.Product = product;
    var seriesData = prepareSeriesNonTidyUnits(
      nglData,
      nglFilters,
      nglUnits.Units,
      "Mb/d",
      159,
      "*",
      ["Pipeline", "Railway", "Truck", "Marine"],
      "Period",
      nglColors
    );

    nglChart = createNglChart(seriesData, nglFilters, nglUnits);
  });

  var selectRegionNgl = document.getElementById("select_region_ngl");
  selectRegionNgl.addEventListener("change", (selectRegionNgl) => {
    var region = selectRegionNgl.target.value;
    nglFilters.Region = region;
    var seriesData = prepareSeriesNonTidyUnits(
      nglData,
      nglFilters,
      nglUnits.Units,
      "Mb/d",
      159,
      "*",
      ["Pipeline", "Railway", "Truck", "Marine"],
      "Period",
      nglColors
    );

    nglChart = createNglChart(seriesData, nglFilters, nglUnits);
  });

  var selectUnitsNgl = document.getElementById("select_units_ngl");
  selectUnitsNgl.addEventListener("change", (selectUnitsNgl) => {
    var units = selectUnitsNgl.target.value;
    nglUnits.Units = units;
    var seriesData = prepareSeriesNonTidyUnits(
      nglData,
      nglFilters,
      nglUnits.Units,
      "Mb/d",
      159,
      "*",
      ["Pipeline", "Railway", "Truck", "Marine"],
      "Period",
      nglColors
    );

    nglChart.update({
      series: seriesData,
      yAxis: {
        title: { text: units },
      },
    });
  });
};
