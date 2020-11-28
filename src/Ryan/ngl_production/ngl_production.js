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
  var seriesData = prepareSeriesNonTidy(
    nglProdData,
    false,
    units,
    ["Ethane", "Propane", "Butanes"],
    "Year",
    nglProdColors
  );

  const mainNglProd = () => {
    var params = {
      div: "container_ngl_production",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: "Source: Energy Futures",
      units: units,
      series: seriesData,
    };
    var chartNgl = productionChart(params);
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
