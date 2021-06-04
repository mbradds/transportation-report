import { cerPalette, conversions, tooltipPoint } from "../../modules/util.js";
import { productionChart, errorChart } from "../../modules/charts.js";
import gasProdData from "./Natural_Gas_Production.json";
import Series from "highseries";

const createChart = (lang, langShared, langUnits) => {
  const gasProdColors = {
    Solution: cerPalette["Aubergine"],
    "Conventional Non-tight": cerPalette["Forest"],
    Tight: cerPalette["Ocean"],
    Shale: cerPalette["Night Sky"],
    "Coalbed Methane": cerPalette["Sun"],
  };

  var units = conversions("Bcf/d to Million m3/d", "Bcf/d", "Bcf/d");
  units.display = langUnits[units.unitsCurrent];

  const mainGasProducton = () => {
    let series = new Series({
      data: gasProdData,
      xCol: "Year",
      yCols: "Production Type",
      valuesCol: "Production (BCf/d)",
      colors: gasProdColors,
      names: lang.series,
    });
    var params = {
      div: "container_gas_production",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: lang.source,
      units: units,
      series: series.hcSeries,
      lang: langShared,
    };
    var gasProdChart = productionChart(params, false);
    var selectUnitsGasProd = document.getElementById("select_units_gas_prod");
    selectUnitsGasProd.addEventListener("change", (selectUnitsGasProd) => {
      units.unitsCurrent = selectUnitsGasProd.target.value;
      units.display = langUnits[units.unitsCurrent];
      if (units.unitsCurrent !== units.unitsBase) {
        series.update({
          data: gasProdData,
          transform: {
            conv: [units.conversion, units.type],
            decimals: 1,
          },
        });
      } else {
        series.update({
          data: gasProdData,
          transform: {
            conv: undefined,
            decimals: undefined,
          },
        });
      }
      gasProdChart.update({
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
    return mainGasProducton();
  } catch (err) {
    return errorChart("container_gas_production");
  }
};

export function rebeccaGasProd(lang, langShared, langUnits) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang, langShared, langUnits)), 0);
  });
}
