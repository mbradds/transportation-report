import { cerPalette } from "../../modules/util.js";
import { lineAndStackedArea, errorChart } from "../../modules/charts.js";
import crudePriceData from "./oil_prices.json";
import Series from "highseries";

const createChart = () => {
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
      sourceText: "Source: ne2 Group",
      units: { unitsCurrent: "USD/bbl" },
      series: series.hcSeries,
      xAxisType: "datetime",
      crosshair: true,
    };
    const chartCrudePrice = lineAndStackedArea(params);
  } catch (err) {
    errorChart("container_crude_prices");
  }
};

export function kevinCrudePrices() {
  return new Promise((resolve) => {
    resolve(createChart());
  });
}
