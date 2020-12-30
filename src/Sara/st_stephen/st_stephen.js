import {
  cerPalette,
  tooltipPoint,
  conversions,
  lines,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import mnpData from "./st_stephen.json";
import offshoreData from "./ns_offshore.json";
import Series from "../../../../highseries/dist/index.js";

export const saraMnp = () => {
  const mnpColors = {
    Exports: cerPalette["Night Sky"],
    Imports: cerPalette["Sun"],
    Capacity: cerPalette["Dim Grey"],
  };

  const mnpTypes = {
    Exports: "area",
    Imports: "area",
    Capacity: "line",
  };

  var units = conversions("Bcf/d to Million m3/d", "Bcf/d", "Bcf/d");

  var yMax = 0.5;
  const ticks = (units) => {
    if (units.unitsCurrent == "Bcf/d") {
      yMax = 0.5;
      return 0.1;
    } else {
      yMax = 15;
      return 5;
    }
  };

  const offshoreColors = {
    "Deep Panuke": cerPalette["Ocean"],
    "Sable Island": cerPalette["Night Sky"],
  };

  const createChartMnp = (seriesData, div, units, yMax) => {
    if (div == "container_mnp") {
      var titleText = "M&NP Pipeline Throughput & Capacity";
      var sourceText = "";
    } else {
      var titleText = "N.S. Offshore Natural Gas Production";
      var sourceText = "Source: CER, CNSOPB";
    }
    return new Highcharts.chart(div, {
      chart: {
        type: "area",
        zoomType: "x",
      },

      credits: {
        text: sourceText,
      },

      title: {
        text: titleText,
      },

      tooltip: {
        shared: true,
        pointFormat: tooltipPoint(units.unitsCurrent),
      },

      xAxis: {
        type: "datetime",
        crosshair: true,
      },

      yAxis: {
        title: { text: units.unitsCurrent },
        tickInterval: ticks(units),
        max: yMax,
        labels: {
          formatter: function () {
            return this.value;
          },
        },
      },

      series: seriesData,
    });
  };

  const mainMnp = () => {
    let mnpseries = new Series({
      data: mnpData,
      xCol: "Date",
      yCols: ["Exports", "Imports", "Capacity"],
      colors: mnpColors,
      seriesTypes: mnpTypes,
    });
    let offseries = new Series({
      data: offshoreData,
      xCol: "Date",
      yCols: ["Deep Panuke", "Sable Island"],
      colors: offshoreColors,
    });
    const chartObj = {};
    chartObj.mnp = { series: mnpseries.hcSeries };
    chartObj.offshore = { series: offseries.hcSeries };
    chartObj.mnp.chart = createChartMnp(
      chartObj.mnp.series,
      "container_mnp",
      units,
      yMax
    );
    chartObj.offshore.chart = createChartMnp(
      chartObj.offshore.series,
      "container_offshore",
      units,
      yMax
    );

    var selectUnitsGasInsert = document.getElementById(
      "select_units_gas_insert"
    );
    selectUnitsGasInsert.addEventListener("change", (selectUnitsGasInsert) => {
      units.unitsCurrent = selectUnitsGasInsert.target.value;
      if (units.unitsCurrent !== units.unitsBase) {
        mnpseries.update({
          data: mnpData,
          transform: {
            conv: [units.conversion, units.type],
            decimals: 1,
          },
        });
        offseries.update({
          data: offshoreData,
          transform: {
            conv: [units.conversion, units.type],
            decimals: 1,
          },
        });
      } else {
        mnpseries.update({
          data: mnpData,
          transform: {
            conv: undefined,
            decimals: undefined,
          },
        });
        offseries.update({
          data: offshoreData,
          transform: {
            conv: undefined,
            decimals: undefined,
          },
        });
      }
      chartObj.mnp.series = mnpseries.hcSeries;
      chartObj.offshore.series = offseries.hcSeries;
      for (const [key, value] of Object.entries(chartObj)) {
        value.chart.update({
          series: value.series,
          yAxis: {
            title: { text: units.unitsCurrent },
            tickInterval: ticks(units),
            max: yMax,
          },
          tooltip: {
            pointFormat: tooltipPoint(units.unitsCurrent),
          },
        });
      }
    });

    chartObj.offshore.chart.update({
      xAxis: {
        plotLines: [
          lines(
            cerPalette["Ocean"],
            null,
            Date.UTC(2018, 5, 7),
            "Production ceases",
            90
          ),
          lines(
            cerPalette["Night Sky"],
            null,
            Date.UTC(2018, 12, 1),
            "Production ceases",
            90
          ),
        ],
      },
    });
  };
  try {
    mainMnp();
  } catch (err) {
    errorChart("container_mnp");
    errorChart("container_offshore");
  }
};
