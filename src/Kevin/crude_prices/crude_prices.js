import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
} from "../../modules/util.js";

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

  const createCrudePriceChart = (seriesData) => {
    return new Highcharts.chart("container_crude_prices", {
      chart: {
        zoomType: "x", //allows the user to focus in on the x or y (x,y,xy)
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(this, "https://www.ne2group.com/");
          },
        },
      },

      credits: {
        text: "Source: ne2 Group",
      },

      tooltip: {
        shared: true,
      },

      xAxis: {
        type: "datetime",
        crosshair:true,
      },

      yAxis: {
        title: { text: "USD/bbl" },
        stackLabels: {
          enabled: false,
        },
      },
      series: seriesData,
    });
  };
  const chart = createCrudePriceChart(seriesData);
};