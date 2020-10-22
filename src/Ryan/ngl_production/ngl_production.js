import {
  cerPalette,
  fillDropUpdate,
  prepareSeriesNonTidy,
  getUnique,
  creditsClick,
  conversions,
} from "../../modules/util.js";

import nglProdData from "./fgrs-eng.json";

export const ryanNglProduction = () => {
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");
  var nglProdColors = {
    Ethane: cerPalette["Ocean"],
    Propane: cerPalette["Forest"],
    Butanes: cerPalette["Night Sky"],
  };
  var seriesData = prepareSeriesNonTidy(
    nglProdData,
    false,
    units,
    ["Ethane", "Propane", "Butanes"],
    "Year",
    nglProdColors
  );

  const createNglProdChart = (seriesData, units) => {
    return new Highcharts.chart("container_ngl_production", {
      chart: {
        type: "column",
        zoomType: "x",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(
              this,
              "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html"
            );
          },
        },
      },

      credits: {
        text: "Source: Energy Futures",
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
  const mainNglProd = () => {
    var chartNgl = createNglProdChart(seriesData, units);
    var selectUnitsNglProd = document.getElementById("select_units_ngl_prod");
    selectUnitsNglProd.addEventListener("change", (selectUnitsNglProd) => {
      units.unitsCurrent = selectUnitsNglProd.target.value;
      var seriesData = prepareSeriesNonTidy(
        nglProdData,
        false,
        units,
        ["Ethane", "Propane", "Butanes"],
        "Year",
        nglProdColors
      );

      chartNgl.update({
        series: seriesData,
        yAxis: {
          title: { text: units.unitsCurrent },
        },
      });
    });
  };
  mainNglProd();
};
