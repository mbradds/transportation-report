import {
  fillDropUpdate,
  getUnique,
  cerPalette,
  prepareSeriesTidy,
  creditsClick
} from "../../modules/util.js";

import tollsData from "./tolls.json";

export const cassandraTolls = () => {
  fillDropUpdate(
    "select_commodity_tolls",
    getUnique(tollsData, "Commodity"),
    false,
    "Oil & Gas"
  );

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
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(this,"https://www.cer-rec.gc.ca/en/index.html")
          },
        },
      },

      title: {
        text: null,
      },

      credits: {
        text: "Source: CER",
      },

      xAxis: {
        type: "datetime",
      },

      yAxis: {
        title: { text: "Benchmark Toll" },
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
