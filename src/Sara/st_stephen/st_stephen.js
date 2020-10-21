import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
  conversions,
} from "../../modules/util.js";

import mnpData from "./st_stephen.json";

export const saraMnp = () => {
  const mnpColors = {
    "Throughput (million m3/d)": cerPalette["Night Sky"],
    "Capacity (million m3/d)": cerPalette["Sun"],
  };
  const splitData = (data) => {
    return [
      data.filter((row) => row["Trade Type"] == "export"),
      data.filter((row) => row["Trade Type"] == "import"),
    ];
  };

  const createMnpSeries = (mnpData) => {
    var [exports, imports] = splitData(mnpData);
    exports = prepareSeriesNonTidy(
      exports,
      false,
      false,
      ["Throughput (million m3/d)", "Capacity (million m3/d)"],
      "Date",
      mnpColors
    );
    imports = prepareSeriesNonTidy(
      imports,
      false,
      false,
      ["Throughput (million m3/d)", "Capacity (million m3/d)"],
      "Date",
      mnpColors
    );

    [exports, imports].map((tradeSeries, i) => {
      tradeSeries.map((series, seriesNum) => {
        if (series.name == "Throughput (million m3/d)") {
          series.type = "area";
        } else {
          series.type = "line";
        }
        return series;
      });
    });

    return [exports, imports];
  };

  var [exports, imports] = createMnpSeries(mnpData);

  const createChartMnp = (seriesData, div) => {
    return new Highcharts.chart(div, {
      chart: {
        zoomType: "x",
        height: "45%",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(
              this,
              "https://open.canada.ca/data/en/dataset/dc343c43-a592-4a27-8ee7-c77df56afb34"
            );
          },
        },
      },

      credits: {
        text: "Source: Open Government Throughput and Capacity Data",
      },

      tooltip: {
        shared: true,
      },

      xAxis: {
        type: "datetime",
        crosshair: true,
        events: {
          setExtremes: syncExtremes,
        },
      },

      yAxis: {
        title: { text: "Bcf/d" },
      },

      series: seriesData,
    });
  };
  createChartMnp(exports, "container_mnp_exports");
  createChartMnp(imports, "container_mnp_imports");
};
