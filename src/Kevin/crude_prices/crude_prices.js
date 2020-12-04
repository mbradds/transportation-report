import { cerPalette, prepareSeriesNonTidy } from "../../modules/util.js";
import { lineAndStackedArea, errorChart } from "../../modules/charts.js";
import crudePriceData from "./oil_prices.json";

export const kevinCrudePrices = () => {
  const crudePriceChartTypes = (series) => {
    series.map((data, seriesNum) => {
      if (data.name == "Differential") {
        data.type = "area";
      } else {
        data.type = "line";
      }
    });

    return series;
  };

  const crudePriceColors = {
    WCS: cerPalette["Night Sky"],
    WTI: cerPalette["Sun"],
    Differential: cerPalette["Ocean"],
  };

  try {
    var seriesData = crudePriceChartTypes(
      prepareSeriesNonTidy(
        crudePriceData,
        false,
        false,
        ["WCS", "WTI", "Differential"],
        "Date",
        crudePriceColors
      )
    );
    var params = {
      div: "container_crude_prices",
      sourceLink: "https://www.ne2group.com/",
      sourceText: "Source: ne2 Group",
      units: { unitsCurrent: "USD/bbl" },
      series: seriesData,
      xAxisType: "datetime",
      crosshair: true,
    };
    const chartCrudePrice = lineAndStackedArea(params);
  } catch (err) {
    errorChart("container_crude_prices");
  }
};
