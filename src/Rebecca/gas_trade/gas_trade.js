import {
  cerPalette,
  creditsClick,
  mouseOverFunction,
  mouseOutFunction,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import gasTradeData from "./natural-gas-exports-and-imports-annual.json";
import Series from "highseries";

const createChart = () => {
  const gasTrafficColors = {
    ["U.S. West"]: cerPalette["Forest"],
    ["U.S. Midwest"]: cerPalette["Ocean"],
    ["U.S. East"]: cerPalette["Night Sky"],
    Other: cerPalette["Dim Grey"],
  };
  var gasTradeFilters = { Activity: "Exports" };
  var gasTradeUnits = { unitsCol: "Volume (Bcf/d)", unitsCurrent: "Bcf/d" };

  const setTitle = (figure_title, filters) => {
    if (filters.Activity == "Exports") {
      figure_title.innerText =
        "Figure 10: Natural Gas Exports from Canada to U.S. Region";
    } else {
      figure_title.innerText =
        "Figure 10: Natural Gas Imports from U.S. Region to Canada";
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
          name: "U.S. West",
          data: [
            ["us-wa", 1],
            ["us-id", 1],
          ],

          color: gasTrafficColors["U.S. West"],
        },
        {
          name: "U.S. Midwest",
          data: [
            ["us-mt", 1],
            ["us-nd", 1],
            ["us-mn", 1],
            ["us-mi", 1],
          ],
          color: gasTrafficColors["U.S. Midwest"],
        },
        {
          name: "U.S. East",
          data: [
            ["us-ny", 1],
            ["us-vt", 1],
            ["us-nh", 1],
            ["us-me", 1],
          ],
          color: gasTrafficColors["U.S. East"],
        },
      ],
    });
  };

  const createGasTrafficChart = (seriesData, units) => {
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

      tooltip: {
        pointFormat: tooltipPoint(units.unitsCurrent),
      },

      yAxis: {
        title: { text: units.unitsCurrent },
        stackLabels: {
          enabled: true,
        },
      },

      series: seriesData,
    });
  };

  try {
    var series = new Series({
      data: gasTradeData,
      xCol: "Year",
      yCols: "Region",
      valuesCol: "Volume (Bcf/d)",
      filters: gasTradeFilters,
      colors: gasTrafficColors,
    });
    var mapGasTraffic = createGasRegionMap();
    var chartGasTraffic = createGasTrafficChart(series.hcSeries, gasTradeUnits);
    var figure_title = document.getElementById("gas_trade_title");
    setTitle(figure_title, gasTradeFilters);
    var selectUnitsGasTrade = document.getElementById("select_units_gas_trade");
    selectUnitsGasTrade.addEventListener("change", (selectUnitsGasTrade) => {
      var units = selectUnitsGasTrade.target.value;
      gasTradeUnits.unitsCurrent = units;
      if (units == "Bcf/d") {
        gasTradeUnits.unitsCol = "Volume (Bcf/d)";
      } else {
        gasTradeUnits.unitsCol = "Volume (Million m3/d)";
      }
      series.update({
        data: gasTradeData,
        valuesCol: gasTradeUnits.unitsCol,
        filters: gasTradeFilters,
      });
      chartGasTraffic.update({
        series: series.hcSeries,
        yAxis: { title: { text: units } },
        tooltip: {
          pointFormat: tooltipPoint(units),
        },
      });
    });

    var selectTradeType = document.getElementById("select_gas_trade_type");
    selectTradeType.addEventListener("change", (selectTradeType) => {
      gasTradeFilters.Activity = selectTradeType.target.value;
      setTitle(figure_title, gasTradeFilters);
      series.update({ data: gasTradeData, filters: gasTradeFilters });
      chartGasTraffic = createGasTrafficChart(series.hcSeries, gasTradeUnits);
    });
  } catch (err) {
    errorChart("container_gas_trade");
    errorChart("container_gas_trade_map");
  }
};

export function rebeccaGasTrade() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart()), 0);
  });
}
