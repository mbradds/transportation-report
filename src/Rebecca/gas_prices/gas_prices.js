import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
  mouseOverFunction,
  mouseOutFunction,
  tooltipPoint,
  tooltipSymbol,
} from "../../modules/util.js";

import gasPriceData from "./gas_prices.json";

export const rebeccaGasPrices = () => {
  const gasPriceColors = {
    ["Dawn Ontario TDt Com"]: cerPalette["Sun"],
    ["TC Alb AECO-C TDt Com Dly"]: cerPalette["Forest"],
    ["Henry Hub TDt Com"]: cerPalette["Night Sky"],
    ["Westcoast Stn 2 TDt Com"]: cerPalette["Ocean"],
  };

  var gasPriceFilters = { Units: "Price ($CN/GIG)", unitsCurrent: "$CN/GIG" };

  var seriesData = prepareSeriesTidy(
    gasPriceData,
    false,
    false,
    "Location",
    "Date",
    gasPriceFilters.Units,
    gasPriceColors
  );

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
          name: "Dawn Ontario TDt Com",
          color: gasPriceColors["Dawn Ontario TDt Com"],
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
          name: "Henry Hub TDt Com",
          color: gasPriceColors["Henry Hub TDt Com"],
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
          name: "TC Alb AECO-C TDt Com Dly",
          color: gasPriceColors["TC Alb AECO-C TDt Com Dly"],
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
          name: "Westcoast Stn 2 TDt Com",
          color: gasPriceColors["Westcoast Stn 2 TDt Com"],
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

  const createGasPriceChart = (seriesData, units) => {
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
          var toolText = `<b> ${Highcharts.dateFormat(
            "%B-%Y",
            this.x
          )} </b><table>`;
          this.points.map((p) => {
            toolText += tooltipSymbol(p, units.unitsCurrent, true);
          });
          return toolText + "</table>";
        },
      },

      xAxis: {
        type: "datetime",
        crosshair: true,
      },

      yAxis: {
        title: { text: units.Units },
        stackLabels: {
          enabled: false,
        },
      },
      series: seriesData,
    });
  };

  var gasMap = createGasPriceMap();
  var chartGasPrice = createGasPriceChart(seriesData, gasPriceFilters);

  var selectUnitsGasPrice = document.getElementById("select_units_gas_prices");
  selectUnitsGasPrice.addEventListener("change", (selectUnitsGasPrice) => {
    var units = selectUnitsGasPrice.target.value;
    gasPriceFilters.unitsCurrent = units;
    if (units == "$CN/GIG") {
      gasPriceFilters.Units = "Price ($CN/GIG)";
    } else {
      gasPriceFilters.Units = "Price ($US/MMB)";
    }
    var seriesData = prepareSeriesTidy(
      gasPriceData,
      false,
      false,
      "Location",
      "Date",
      gasPriceFilters.Units,
      gasPriceColors
    );

    chartGasPrice.update({
      series: seriesData,
      yAxis: {
        title: { text: gasPriceFilters.Units },
      },
    });
  });
};
