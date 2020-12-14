import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";

import tollsData from "./tolls.json";

export const cassandraTolls = () => {
  const tollChartTypes = (series) => {
    series.map((data) => {
      if (data.name == "GDP Deflator") {
        data.type = "line";
        data.dashStyle = "longDash";
      } else {
        data.type = "line";
      }
    });

    return series;
  };

  var tollDate = { Date: "Start" };

  const splitCommodity = (data) => {
    const [oil, gas] = [[], []];
    data.map((row) => {
      if (row.Commodity == "Crude Oil Breakdown") {
        oil.push(row);
      } else {
        gas.push(row);
      }
    });
    return [oil, gas];
  };

  const tollColors = {
    "GDP Deflator": cerPalette["Cool Grey"],
    "TC Canadian Mainline": cerPalette["Forest"],
    "Enbridge BC Pipeline": cerPalette["Aubergine"],
    "TQM Pipeline": cerPalette["Dim Grey"],
    "Alliance Pipeline": cerPalette["Ocean"],
    "M&NP Pipeline": cerPalette["Sun"],
    "NGTL System": cerPalette["Flame"],
    "Trans-Northern Pipeline": cerPalette["Aubergine"],
    "Keystone Pipeline": cerPalette["Forest"],
    "Express Pipeline": cerPalette["Cool Grey"],
    "Enbridge Canadian Mainline": cerPalette["Flame"],
  };

  const createTollSeries = (tollsData, tollDate, tollColors) => {
    return tollChartTypes(
      prepareSeriesTidy(
        tollsData,
        false,
        false,
        "Pipeline",
        tollDate.Date,
        "Rate Normalized",
        tollColors
      )
    );
  };
  const createTollsChart = (seriesData, tollDate, div) => {
    return new Highcharts.chart(div, {
      chart: {
        zoomType: "x",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(this, "https://www.cer-rec.gc.ca/en/index.html");
          },
        },
      },

      credits: {
        text: "Source: CER",
      },

      tooltip: {
        pointFormat: tooltipPoint(""),
      },

      xAxis: {
        type: "datetime",
        title: { text: `Toll ${tollDate.Date} date` },
      },

      yAxis: {
        title: { text: "Benchmark Toll (2015 = 1)" },
        labels: {
          formatter: function () {
            return this.value;
          },
        },
      },

      series: seriesData,
    });
  };

  const mainTolls = () => {
    const commoditySeries = () => {
      try {
        return splitCommodity(tollsData);
      } catch (err) {
        errorChart("container_tolls_oil");
        errorChart("container_tolls_gas");
      }
    };
    const [oilTolls, gasTolls] = commoditySeries(tollsData);
    try {
      var chartTollsOil = createTollsChart(
        createTollSeries(oilTolls, tollDate, tollColors),
        tollDate,
        "container_tolls_oil"
      );
    } catch (err) {
      errorChart("container_tolls_oil");
    }

    try {
      var chartTollsGas = createTollsChart(
        createTollSeries(gasTolls, tollDate, tollColors),
        tollDate,
        "container_tolls_gas"
      );
    } catch (err) {
      errorChart("container_tolls_gas");
    }
  };

  mainTolls();
};
