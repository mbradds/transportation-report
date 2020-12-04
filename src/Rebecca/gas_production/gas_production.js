import {
  cerPalette,
  prepareSeriesTidy,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import { productionChart, errorChart } from "../../modules/charts.js";
import gasProdData from "./Natural_Gas_Production.json";

export const rebeccaGasProd = () => {
  const gasProdColors = {
    Solution: cerPalette["Aubergine"],
    "Conventional Non-tight": cerPalette["Forest"],
    Tight: cerPalette["Ocean"],
    Shale: cerPalette["Night Sky"],
    "Coalbed Methane": cerPalette["Sun"],
  };

  var units = conversions("Bcf/d to Million m3/d", "Bcf/d", "Bcf/d");

  const createGasProdSeries = (gasProdData, units, gasProdColors) => {
    return prepareSeriesTidy(
      gasProdData,
      false,
      units,
      "Production Type",
      "Year",
      "Production (BCf/d)",
      gasProdColors
    );
  };

  const mainGasProducton = () => {
    var params = {
      div: "container_gas_production",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: "Source: Energy Futures",
      units: units,
      series: createGasProdSeries(gasProdData, units, gasProdColors),
    };
    var gasProdChart = productionChart(params);
    var selectUnitsGasProd = document.getElementById("select_units_gas_prod");
    selectUnitsGasProd.addEventListener("change", (selectUnitsGasProd) => {
      units.unitsCurrent = selectUnitsGasProd.target.value;
      gasProdChart.update({
        series: createGasProdSeries(gasProdData, units, gasProdColors),
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
    mainGasProducton();
  } catch (err) {
    errorChart("container_gas_production");
  }
};
