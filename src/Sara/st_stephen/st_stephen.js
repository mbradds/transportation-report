import {
  cerPalette,
  prepareSeriesNonTidy,
  tooltipPoint,
} from "../../modules/util.js";

import mnpData from "./st_stephen.json";
import offshoreData from "./ns_offshore.json";

export const saraMnp = () => {
  const mnpColors = {
    Exports: cerPalette["Night Sky"],
    Imports: cerPalette["Sun"],
    Capacity: cerPalette["Dim Grey"],
  };

  const offshoreColors = {
    "Deep Panuke": cerPalette["Ocean"],
    "Sable Island": cerPalette["Night Sky"],
  };

  const createMnpSeries = (mnpData) => {
    const mnpSeries = prepareSeriesNonTidy(
      mnpData,
      false,
      false,
      ["Exports", "Imports", "Capacity"],
      "Date",
      mnpColors
    );
    return mnpSeries.map((series) => {
      if (series.name == "Capacity") {
        series.type = "line";
      } else {
        series.type = "area";
      }
      return series;
    });
  };

  const offshoreSeries = prepareSeriesNonTidy(
    offshoreData,
    false,
    false,
    ["Deep Panuke", "Sable Island"],
    "Date",
    offshoreColors
  );

  const createChartMnp = (seriesData, div) => {
    if (div == "container_mnp") {
      var titleText = "M&NP Pipeline Traffic";
      var sourceText = "";
    } else {
      var titleText = "N.S. Offshore Natural Gas Production";
      var sourceText = "Source: CER, CNSOPB";
    }
    return new Highcharts.chart(div, {
      chart: {
        type: "area",
        zoomType: "x",
        //height: "45%",
      },

      credits: {
        text: sourceText,
      },

      title: {
        text: titleText,
      },

      tooltip: {
        shared: true,
        pointFormat: tooltipPoint("Million m3/d"),
      },

      xAxis: {
        type: "datetime",
        crosshair: true,
      },

      yAxis: {
        title: { text: "Million m3/d" },
      },

      series: seriesData,
    });
  };

  createChartMnp(createMnpSeries(mnpData), "container_mnp");
  var offshoreChart = createChartMnp(offshoreSeries, "container_offshore");
  offshoreChart.update({
    xAxis: {
      plotLines: [
        {
          color: cerPalette['Ocean'],
          //dashStyle: "longdashdot",
          value: Date.UTC(2018, 5, 7),
          width: 2,
          zIndex: 5,
          label: {
            text: "Production ceases",
            align: "left",
          },
        },
        {
          color: cerPalette['Night Sky'],
          value: Date.UTC(2018, 12, 1),
          width: 2,
          zIndex: 5,
          label: {
            text: "Production ceases",
            align: "left",
          },
        },
      ],
    },
  });
};
