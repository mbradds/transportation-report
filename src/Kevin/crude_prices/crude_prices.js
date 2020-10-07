import { cerPalette, prepareSeriesNonTidy } from "../../modules/util.js";

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
      ["WCS", "WTI", "Differential"],
      "Date",
      crudePriceColors
    )
  );

  const createCrudePriceChart = (seriesData) => {
    const chart = new Highcharts.chart("container_crude_prices", {
      chart: {
        zoomType: "x", //allows the user to focus in on the x or y (x,y,xy)
        borderColor: "black",
        borderWidth: 1,
        animation: true,
        events: {
          load: function () {
            this.credits.element.onclick = function () {
              window.open(
                "https://www.ne2group.com/",
                "_blank" // <- This is what makes it open in a new window.
              );
            };
          },
        },
      },

      title: {
        text: null,
      },

      credits: {
        text: "Source: Net Energy Group",
      },

      plotOptions: {
        area: {
          stacking: "normal",
          marker: false,
          dataLabels: {
            enabled: false,
          },
        },
      },

      tooltip: {
        animation: true,
        shared: true,
      },

      // title: { text: 'Canada Propane Exports' },

      xAxis: {
        type: "datetime",
      },

      yAxis: {
        title: { text: "USD/bbl" },
        stackLabels: {
          enabled: false,
        },
      },

      lang: {
        noData: "No Exports",
      },

      noData: {
        style: {
          fontWeight: "bold",
          fontSize: "15px",
          color: "#303030",
        },
      },
      series: seriesData,
    });

    return chart;
  };

  const chart = createCrudePriceChart(seriesData);
};
