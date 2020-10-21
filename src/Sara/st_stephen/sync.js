import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
} from "../../modules/util.js";

import mnpData from "./st_stephen.json"

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

    return [
      { name: "exports", data: exports },
      { name: "imports", data: imports },
    ];
  };

  const hcSyncExports = (dataset, chartDiv) => {
    return Highcharts.chart(chartDiv, {
      chart: {
        height: "45%",
      },
      credits: {
        text: "",
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: "datetime",
        crosshair: true,
        // events: {
        //   setExtremes: syncExtremes,
        // },
      },

      yAxis: {
        title: { text: "Exports" },
      },

      series: dataset,
    });
  };

  const hcSyncImports = (dataset, chartDiv) => {
    return Highcharts.chart(chartDiv, {
      chart: {
        height: "45%",
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
      legend: {
        align: "left",
        verticalAlign: "top",
        x: 50,
        y: 50,
        floating: true,
      },
      xAxis: {
        type: "datetime",
        crosshair: true,
        // events: {
        //   setExtremes: syncExtremes,
        // },
      },

      yAxis: {
        title: { text: "Imports" },
      },

      series: dataset,
    });
  };

  var mnp = createMnpSeries(mnpData);

  mnp.forEach(function (dataset, i) {
    var chartDiv = document.createElement("div");
    chartDiv.className = "chart";
    document.getElementById("container_mnp").appendChild(chartDiv);
    if (dataset.name == "exports") {
      var chartExports = hcSyncExports(dataset.data, chartDiv);
    } else {
      var chartImports = hcSyncImports(dataset.data, chartDiv);
    }
    
  });

//   (function (H) {
//     ["mousemove", "touchmove", "touchstart"].forEach(function (eventType) {
//         document
//           .getElementById("container_mnp")
//           .addEventListener(eventType, function (e) {
//             var chart, point, i, event;
    
//             for (i = 0; i < H.charts.length; i = i + 1) {
//               chart = H.charts[i];
//               // Find coordinates within the chart
//               event = chart.pointer.normalize(e);
//               // Get the hovered point
//               point = chart.series[0].searchPoint(event, true);
    
//               if (point) {
//                 point.highlight(e);
//               }
//             }
//           });
//       });
//   }(Highcharts));

//   (function (H){
//     H.Pointer.prototype.reset = function () {
//         return undefined;
//       };
//   }(Highcharts));

//   (function (H){
//     H.Point.prototype.highlight = function (event) {
//         event = this.series.chart.pointer.normalize(event);
//         this.onMouseOver(); // Show the hover marker
//         this.series.chart.tooltip.refresh(this); // Show the tooltip
//         this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
//       };
//   }(Highcharts));


//   function syncExtremes(e) {
//     var thisChart = this.chart;

//     if (e.trigger !== "syncExtremes") {
//       // Prevent feedback loop
//       Highcharts.each(Highcharts.charts, function (chart) {
//         if (chart !== thisChart) {
//           if (chart.xAxis[0].setExtremes) {
//             // It is null while updating
//             chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
//               trigger: "syncExtremes",
//             });
//           }
//         }
//       });
//     }
//   }
};
