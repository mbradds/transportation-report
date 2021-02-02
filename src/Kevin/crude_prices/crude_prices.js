import { cerPalette } from "../../modules/util.js";
import { lineAndStackedArea, errorChart } from "../../modules/charts.js";
import crudePriceData from "./oil_prices.json";
import Series from "highseries";

const createChart = (lang) => {
  const crudePriceColors = {
    WCS: cerPalette["Night Sky"],
    WTI: cerPalette["Sun"],
    Differential: cerPalette["Ocean"],
  };

  const crudePriceTypes = {
    WCS: "line",
    WTI: "line",
    Differential: "area",
  };

  try {
    let series = new Series({
      data: crudePriceData,
      xCol: "Date",
      yCols: ["WCS", "WTI", "Differential"],
      colors: crudePriceColors,
      seriesTypes: crudePriceTypes,
    });
    var params = {
      div: "container_crude_prices",
      sourceLink: "https://www.ne2group.com/",
      sourceText: lang.source,
      units: { unitsCurrent: "USD/bbl" },
      series: series.hcSeries,
      xAxisType: "datetime",
      crosshair: true,
    };
    return lineAndStackedArea(params);
  } catch (err) {
    errorChart("container_crude_prices");
    return;
  }
};

export function kevinCrudePrices(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
