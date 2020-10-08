import { fillDrop, cerPalette, prepareSeriesTidy } from "../../modules/util.js";

import tollsData from "./tolls.json";

export const cassandraTolls = () => {
  fillDrop("Commodity", "select_commodity_tolls", "Oil & Gas", tollsData);

  const tollChartTypes = (series) => {
    series.map((data, seriesNum) => {
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
  const tollColors = {
    "Gas Tolls": cerPalette["Sun"],
    "Oil Tolls": cerPalette["Night Sky"],
    "GDP Deflator": cerPalette["Cool Grey"],
    "TC Mainline": cerPalette["Forest"],
    Westcoast: cerPalette["Aubergine"],
    TQM: cerPalette["Dim Grey"],
    Alliance: cerPalette["Ocean"],
    "M&NP": cerPalette["Sun"],
    NGTL: cerPalette["Flame"],
    TNPI: cerPalette["Aubergine"],
    Keystone: cerPalette["Ocean"],
    Express: cerPalette["Cool Grey"],
    "Enbridge ML": cerPalette["Flame"],
  };

  const seriesData = tollChartTypes(
    prepareSeriesTidy(
      tollsData,
      tollFilters,
      "Pipeline",
      "Start",
      "Rate Normalized",
      tollColors
    )
  );

  const createTollsChart = (seriesData) => {
    const chart = new Highcharts.chart("container_tolls", {
      chart: {
        zoomType: "x",
        borderColor: "black",
        borderWidth: 1,
        animation: true,
        events: {
          load: function () {
            this.credits.element.onclick = function () {
              window.open(
                "https://www.cer-rec.gc.ca/en/index.html",
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
        text: "Source: CER",
      },

      tooltip: {
        shared: false,
      },

      xAxis: {
        type: "datetime",
      },

      yAxis: {
        title: { text: "Benchmark Toll" },
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

  const chartTolls = createTollsChart(seriesData);

  var selectTolls = document.getElementById("select_commodity_tolls");
  selectTolls.addEventListener("change", (selectTolls) => {
    var tollsCommodity = selectTolls.target.value;
    tollFilters.Commodity = tollsCommodity;
    const seriesData = tollChartTypes(
      prepareSeriesTidy(
        tollsData,
        tollFilters,
        "Pipeline",
        "Start",
        "Rate Normalized",
        tollColors
      )
    );
    const chartTolls = createTollsChart(seriesData);
  });
};
