import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import { productionChart } from "../../modules/charts.js";
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

  const mainGasProducton = () => {
    var params = {
      div: "container_gas_production",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: "Source: Energy Futures",
      units:units,
      series:seriesData
    };
    var gasProdChart = productionChart(params);
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
        tooltip: {
          pointFormat: tooltipPoint(units.unitsCurrent)
        },
      });
    });
  };
  mainGasProducton();
};