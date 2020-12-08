import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
  mouseOverFunction,
  mouseOutFunction,
  tooltipSymbol,
  dateFormat,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import gasPriceData from "./gas_prices.json";

export const rebeccaGasPrices = () => {
  const gasPriceColors = {
    ["Dawn"]: cerPalette["Sun"],
    ["Alberta NIT"]: cerPalette["Forest"],
    ["Henry Hub"]: cerPalette["Night Sky"],
    ["Station 2"]: cerPalette["Ocean"],
  };

  var gasPriceFilters = { Units: "Price ($CN/GIG)", unitsCurrent: "$CN/GIG" };

  const createGasPriceSeries = (
    gasPriceData,
    gasPriceFilters,
    gasPriceColors
  ) => {
    return prepareSeriesTidy(
      gasPriceData,
      false,
      false,
      "Location",
      "Date",
      gasPriceFilters.Units,
      gasPriceColors
    );
  };

  const createGasPriceMap = () => {
    return Highcharts.mapChart("container_gas_map", {
      chart: {
        type: "map",
        map: "custom/north-america-no-central",
        events: {
          load: function () {
            creditsClick(this, "https://www.spglobal.com/platts/en");
          },
        },
      },
      credits: {
        text: "Source: Platts",
      },

      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          states: {
            inactive: {
              opacity: 0.5,
            },
            hover: {
              brightness: 0,
            },
          },
          stickyTracking: false,
          marker: {
            radius: 10,
          },
          point: {
            events: {
              mouseOver: function () {
                var currentSelection = this.series.name;
                mouseOverFunction(chartGasPrice.series, currentSelection);
              },
              mouseOut: function () {
                mouseOutFunction(chartGasPrice.series);
              },
            },
          },
        },
      },

      tooltip: {
        formatter: function () {
          return this.series.name;
        },
      },

      series: [
        {
          name: "Basemap",
          borderColor: "#606060",
          nullColor: "rgba(200, 200, 200, 0.2)",
          showInLegend: false,
        },
        {
          type: "mappoint",
          name: "Dawn",
          color: gasPriceColors["Dawn"],
          data: [
            {
              lat: 42.7071,
              lon: -82.0843,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "Henry Hub",
          color: gasPriceColors["Henry Hub"],
          data: [
            {
              lat: 29.9583,
              lon: -92.036,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "Alberta NIT",
          color: gasPriceColors["Alberta NIT"],
          data: [
            {
              lat: 53.5461,
              lon: -113.4938,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "Station 2",
          color: gasPriceColors["Station 2"],
          data: [
            {
              lat: 55.6977,
              lon: -121.6297,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
      ],
    });
  };

  const createGasPriceChart = (seriesData) => {
    return new Highcharts.chart("container_gas_prices", {
      chart: {
        zoomType: "x",
      },

      credits: {
        text: "",
      },

      tooltip: {
        shared: true,
        formatter: function () {
          var toolText = `<b> ${dateFormat(this.x, "%B-%Y")} </b><table>`;
          this.points.map((p) => {
            toolText += tooltipSymbol(p, "", true, false);
          });
          return toolText + "</table>";
        },
      },

      xAxis: {
        type: "datetime",
        crosshair: true,
      },

      yAxis: {
        title: { text: "Prices (Normalized)" },
        labels: {
          enabled: false,
        },
      },
      series: seriesData,
    });
  };

  try {
    var seriesData = createGasPriceSeries(
      gasPriceData,
      gasPriceFilters,
      gasPriceColors
    );
    var gasMap = createGasPriceMap();
    var chartGasPrice = createGasPriceChart(seriesData, gasPriceFilters);
  } catch (err) {
    console.log(err);
    errorChart("container_gas_map");
    errorChart("container_gas_prices");
  }
};
