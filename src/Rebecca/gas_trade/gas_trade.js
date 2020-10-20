import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
  mouseOverFunction,
  mouseOutFunction,
} from "../../modules/util.js";

import gasTradeData from "./natural-gas-exports-and-imports-annual.json";

export const rebeccaGasTrade = () => {
  const gasTrafficColors = {
    Midwest: cerPalette["Sun"],
    Mountain: cerPalette["Forest"],
    East: cerPalette["Night Sky"],
    Pacific: cerPalette["Ocean"],
    Other: cerPalette["Dim Grey"],
  };
  var gasTradeFilters = { Activity: "Exports" };
  var gasTradeUnits = { unitsCol: "Volume (Bcf/d)" };
  var seriesData = prepareSeriesTidy(
    gasTradeData,
    gasTradeFilters,
    false,
    "Region",
    "Year",
    gasTradeUnits.unitsCol,
    gasTrafficColors
  );
  const setTitle = (figure_title, filters) => {
    if (filters.Activity == "Exports") {
      figure_title.innerText =
        "Figure 12: Natural Gas Exports from Canada to U.S. Region";
    } else {
      figure_title.innerText =
        "Figure 12: Natural Gas Imports from U.S. Region to Canada";
    }
  };
  const createGasRegionMap = () => {
    return new Highcharts.mapChart("container_gas_trade_map", {
      chart: {
        type: "map",
        map: "countries/us/custom/us-all-mainland",
        events: {
          load: function () {
            creditsClick(
              this,
              "https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english"
            );
          },
          load: function () {
            const usedRegions = [];
            this.series.forEach(function (s) {
              s.data.forEach(function (row) {
                usedRegions.push(row["hc-key"]);
              });
            });
            const otherData = [];
            this.series[0].mapData.forEach(function (state) {
              if (!usedRegions.includes(state["hc-key"])) {
                otherData.push([state["hc-key"], 1]);
              }
            });
            this.addSeries({
              name: "Other",
              data: otherData,
              color: gasTrafficColors["Other"],
              allowPointSelect: false,
              enableMouseTracking: false,
            });
          },
        },
      },

      credits: {
        text: "Source: CER Commodity Tracking System, Map:",
      },

      legend: {
        enabled: false,
      },

      tooltip: {
        formatter: function () {
          return this.series.name;
        },
      },

      plotOptions: {
        map: {
          allAreas: false,
        },
        series: {
          states: {
            inactive: {
              opacity: 0.5,
            },
            hover: {
              brightness: 0,
            },
          },
          events: {
            mouseOver: function () {
              var currentSelection = this.name;
              mouseOverFunction(this.chart.series, currentSelection);
              mouseOverFunction(chartGasTraffic.series, currentSelection);
            },
            mouseOut: function () {
              mouseOutFunction(this.chart.series);
              mouseOutFunction(chartGasTraffic.series);
            },
          },
        },
      },

      series: [
        {
          name: "Pacific",
          data: [["us-wa", 1]],
          color: gasTrafficColors["Pacific"],
        },
        {
          name: "Mountain",
          data: [
            ["us-id", 1],
            ["us-mt", 1],
            ["us-nd", 1],
          ],
          color: gasTrafficColors["Mountain"],
        },
        {
          name: "Midwest",
          data: [
            ["us-mn", 1],
            ["us-mi", 1],
          ],
          color: gasTrafficColors["Midwest"],
        },
        {
          name: "East",
          data: [
            ["us-oh", 1],
            ["us-pa", 1],
            ["us-ny", 1],
            ["us-vt", 1],
            ["us-nh", 1],
            ["us-me", 1],
          ],
          color: gasTrafficColors["East"],
        },
      ],
    });
  };

  const createGasTrafficChart = (seriesData) => {
    return new Highcharts.chart("container_gas_trade", {
      chart: {
        type: "column",
      },

      credits: {
        enabled: false,
      },

      plotOptions: {
        series: {
          events: {
            mouseOver: function () {
              var currentSelection = this.name;
              mouseOverFunction(mapGasTraffic.series, currentSelection);
            },
            mouseOut: function () {
              mouseOutFunction(mapGasTraffic.series);
            },
          },
        },
      },

      yAxis: {
        title: { text: "Bcf/d" },
        stackLabels: {
          enabled: true,
        },
      },

      series: seriesData,
    });
  };

  const mapGasTraffic = createGasRegionMap();
  var chartGasTraffic = createGasTrafficChart(seriesData);
  var figure_title = document.getElementById("gas_trade_title");
  setTitle(figure_title, gasTradeFilters);

  var selectUnitsGasTrade = document.getElementById("select_units_gas_trade");
  selectUnitsGasTrade.addEventListener("change", (selectUnitsGasTrade) => {
    var units = selectUnitsGasTrade.target.value;
    if (units == "Bcf/d") {
      gasTradeUnits.unitsCol = "Volume (Bcf/d)";
    } else {
      gasTradeUnits.unitsCol = "Volume (Million m3/d)";
    }
    var seriesData = prepareSeriesTidy(
      gasTradeData,
      gasTradeFilters,
      false,
      "Region",
      "Year",
      gasTradeUnits.unitsCol,
      gasTrafficColors
    );
    chartGasTraffic = createGasTrafficChart(seriesData);
    chartGasTraffic.update({
      yAxis: { title: { text: units } },
    });
  });

  var selectTradeType = document.getElementById("select_gas_trade_type");
  selectTradeType.addEventListener("change", (selectTradeType) => {
    gasTradeFilters.Activity = selectTradeType.target.value;
    setTitle(figure_title, gasTradeFilters);
    var seriesData = prepareSeriesTidy(
      gasTradeData,
      gasTradeFilters,
      false,
      "Region",
      "Year",
      gasTradeUnits.unitsCol,
      gasTrafficColors
    );
    chartGasTraffic = createGasTrafficChart(seriesData);
  });
};
