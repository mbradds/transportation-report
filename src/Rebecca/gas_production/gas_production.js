import {
  cerPalette,
  fillDropUpdate,
  prepareSeriesTidy,
  getUnique,
  creditsClick,
  conversions,
} from "../../modules/util.js";

import gasProdData from "./Natural_Gas_Production.json";

export const rebeccaGasProd = () => {
  const gasProdColors = {
    Solution: cerPalette["Aubergine"],
    "Non Associated": cerPalette["Forest"],
    Tight: cerPalette["Ocean"],
    Shale: cerPalette["Night Sky"],
    "Coalbed Methane": cerPalette["Sun"],
  };

  var units = conversions("Bcf/d to Million m3/d", "Bcf/d", "Bcf/d");
  var seriesData = prepareSeriesTidy(
    gasProdData,
    false,
    units,
    "Production Type",
    "Year",
    "Production (BCf/d)",
    gasProdColors
  );

  const createGasProdChart = (seriesData, units) => {
    return new Highcharts.chart("container_gas_production", {
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

  const mainGasProducton = () => {
    var gasProdChart = createGasProdChart(seriesData, units);
    var selectUnitsGasProd = document.getElementById("select_units_gas_prod");
    selectUnitsGasProd.addEventListener("change", (selectUnitsGasProd) => {
      units.unitsCurrent = selectUnitsGasProd.target.value;
      var seriesData = prepareSeriesTidy(
        gasProdData,
        false,
        units,
        "Production Type",
        "Year",
        "Production (BCf/d)",
        gasProdColors
      );
      gasProdChart.update({
        series: seriesData,
        yAxis: {
          title: { text: units.unitsCurrent },
        },
      });
    });
  };
  mainGasProducton();
};