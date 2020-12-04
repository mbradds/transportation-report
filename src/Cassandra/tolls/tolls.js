import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";

import tollsData from "./tolls.json";

export const cassandraTolls = () => {
  const setTitle = (figure_title, filters) => {
    if (filters.Commodity == "Oil & Gas") {
      figure_title.innerText =
        "Figure 18: Crude Oil & Natural Gas Average Tolls Index";
    } else {
      figure_title.innerText = `Figure 18: ${filters.Commodity.replace(
        "Breakdown",
        ""
      )} Pipeline Tolls`;
    }
  };

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

  var tollFilters = { Commodity: "Oil & Gas" };
  var tollDate = { Date: "Start" };

  const tollColors = {
    "Gas Tolls": cerPalette["Sun"],
    "Oil Tolls": cerPalette["Night Sky"],
    "Oil Tolls (omit TNPI)": cerPalette["Ocean"],
    "GDP Deflator": cerPalette["Cool Grey"],
    "TransCanada Mainline": cerPalette["Forest"],
    "Enbridge BC Pipeline": cerPalette["Aubergine"],
    "TQM Pipeline": cerPalette["Dim Grey"],
    "Alliance Pipeline": cerPalette["Ocean"],
    "M&NP Pipeline": cerPalette["Sun"],
    "NGTL System": cerPalette["Flame"],
    "Trans-Northern Pipeline": cerPalette["Aubergine"],
    "Keystone Pipeline": cerPalette["Ocean"],
    "Express Pipeline": cerPalette["Cool Grey"],
    "Enbridge Canadian Mainline": cerPalette["Flame"],
  };

  const createTollSeries = (tollsData, tollFilters, tollDate, tollColors) => {
    return tollChartTypes(
      prepareSeriesTidy(
        tollsData,
        tollFilters,
        false,
        "Pipeline",
        tollDate.Date,
        "Rate Normalized",
        tollColors
      )
    );
  };
  const createTollsChart = (seriesData, tollDate) => {
    return new Highcharts.chart("container_tolls", {
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
    var seriesData = createTollSeries(
      tollsData,
      tollFilters,
      tollDate,
      tollColors
    );
    var figure_title = document.getElementById("tolls_title");
    setTitle(figure_title, tollFilters);
    var chartTolls = createTollsChart(seriesData, tollDate);

    var selectTolls = document.getElementById("select_commodity_tolls");
    selectTolls.addEventListener("change", (selectTolls) => {
      tollFilters.Commodity = selectTolls.target.value;
      setTitle(figure_title, tollFilters);
      var seriesData = createTollSeries(
        tollsData,
        tollFilters,
        tollDate,
        tollColors
      );
      chartTolls = createTollsChart(seriesData, tollDate);
    });
  };
  try {
    mainTolls();
  } catch (err) {
    errorChart("container_tolls");
  }
};
