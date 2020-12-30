import { cerPalette, conversions, tooltipPoint } from "../../modules/util.js";
import { productionChart, errorChart } from "../../modules/charts.js";
import nglProdData from "./figures.json";
import Series from "../../../../highseries/dist/index.js";

export const ryanNglProduction = () => {
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");
  var nglProdColors = {
    Ethane: cerPalette["Ocean"],
    Propane: cerPalette["Forest"],
    Butanes: cerPalette["Night Sky"],
  };

  const mainNglProd = () => {
    let series = new Series({
      data: nglProdData,
      xCol: "Year",
      yCols: ["Ethane", "Propane", "Butanes"],
      colors: nglProdColors,
    });
    var params = {
      div: "container_ngl_production",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: "Source: Energy Futures",
      units: units,
      series: series.hcSeries,
    };
    var chartNgl = productionChart(params);
    var selectUnitsNglProd = document.getElementById("select_units_ngl_prod");
    selectUnitsNglProd.addEventListener("change", (selectUnitsNglProd) => {
      units.unitsCurrent = selectUnitsNglProd.target.value;
      if (units.unitsCurrent !== units.unitsBase) {
        series.update({
          data: nglProdData,
          transform: {
            conv: [units.conversion, units.type],
            decimals: 1,
          },
        });
      } else {
        series.update({
          data: nglProdData,
          transform: {
            conv: undefined,
            decimals: undefined,
          },
        });
      }
      chartNgl.update({
        series: series.hcSeries,
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
    mainNglProd();
  } catch (err) {
    errorChart("container_ngl_production");
  }
};
