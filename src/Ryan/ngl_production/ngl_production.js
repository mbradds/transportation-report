import {
  cerPalette,
  prepareSeriesNonTidy,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import { productionChart, errorChart } from "../../modules/charts.js";
import nglProdData from "./figures.json";

export const ryanNglProduction = () => {
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");
  var nglProdColors = {
    Ethane: cerPalette["Ocean"],
    Propane: cerPalette["Forest"],
    Butanes: cerPalette["Night Sky"],
  };

  const createNglProdSeries = (nglProdData, units, nglProdColors) => {
    return prepareSeriesNonTidy(
      nglProdData,
      false,
      units,
      ["Ethane", "Propane", "Butanes"],
      "Year",
      nglProdColors
    );
  };

  const mainNglProd = () => {
    var params = {
      div: "container_ngl_production",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: "Source: Energy Futures",
      units: units,
      series: createNglProdSeries(nglProdData, units, nglProdColors),
    };
    var chartNgl = productionChart(params);
    var selectUnitsNglProd = document.getElementById("select_units_ngl_prod");
    selectUnitsNglProd.addEventListener("change", (selectUnitsNglProd) => {
      units.unitsCurrent = selectUnitsNglProd.target.value;
      chartNgl.update({
        series: createNglProdSeries(nglProdData, units, nglProdColors),
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
