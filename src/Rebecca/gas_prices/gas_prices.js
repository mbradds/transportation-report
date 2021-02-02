import {
  cerPalette,
  creditsClick,
  mouseOverFunction,
  mouseOutFunction,
  tooltipSymbol,
  dateFormat,
} from "../../modules/util.js";
import Series from "highseries";
import { errorChart } from "../../modules/charts.js";
import gasPriceData from "./gas_prices.json";

const createChart = (lang) => {
  const gasPriceColors = {
    ["Dawn"]: cerPalette["Sun"],
    ["Alberta NIT"]: cerPalette["Forest"],
    ["Henry Hub"]: cerPalette["Night Sky"],
    ["Station 2"]: cerPalette["Ocean"],
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
        text: lang.source,
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
            radius: 12,
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
              lat: 53.6374,
              lon: -112.018,
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
        endOnTick: false,
        title: { text: lang.yAxis },
        labels: {
          enabled: false,
        },
      },
      series: seriesData,
    });
  };

  try {
    var series = new Series({
      data: gasPriceData,
      xCol: "Date",
      yCols: ["Alberta NIT", "Dawn", "Henry Hub", "Station 2"],
      colors: gasPriceColors,
    });
    var gasMap = createGasPriceMap();
    var chartGasPrice = createGasPriceChart(series.hcSeries);
    return gasMap;
  } catch (err) {
    errorChart("container_gas_map");
    errorChart("container_gas_prices");
    return;
  }
};

export function rebeccaGasPrices(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
