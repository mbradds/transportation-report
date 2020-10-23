import {
  cerPalette,
  prepareSeriesNonTidy,
  prepareSeriesTidy,
  creditsClick,
} from "../../modules/util.js";

import finResourceData from "./fin_resource_totals.json";
import finResourceClass from "./fin_resource_class.json";
import finResourceNames from "./fin_resource_class_names.json";

export const jenniferFinResources = () => {
  var finResourceFilters = { Commodity: "All" };

  const finResourceChartTypes = (series) => {
    series.map((data, seriesNum) => {
      if (data.name == "Companies using Financial Instrument") {
        data.type = "column";
        data.yAxis = 0;
      } else {
        data.type = "line";
        data.yAxis = 1;
      }
    });

    return series;
  };

  const commodityTotals = (data, colors) => {
    var totals = {};

    data.map((row, rowNum) => {
      if (totals.hasOwnProperty(row.Commodity) && row.Commodity !== "All") {
        totals[row.Commodity] =
          totals[row.Commodity] + row["Financial Instrument Total"];
      } else if (row.Commodity !== "All") {
        totals[row.Commodity] = row["Financial Instrument Total"];
      }
    });

    const totalSeries = [];
    for (const [key, value] of Object.entries(totals)) {
      totalSeries.push({
        name: key,
        data: [value],
        color: colors[key],
      });
    }

    return totalSeries;
  };

  const commodityColors = {
    Oil: cerPalette["Night Sky"],
    Gas: cerPalette["Forest"],
  };

  const finResourceColors = {
    "Companies using Financial Instrument": cerPalette["Cool Grey"],
    "Financial Instrument Total": cerPalette["Sun"],
  };

  const totals = commodityTotals(finResourceData, commodityColors);
  const finResourceSeries = finResourceChartTypes(
    prepareSeriesNonTidy(
      finResourceData,
      finResourceFilters,
      false,
      ["Companies using Financial Instrument", "Financial Instrument Total"],
      "Financial Instrument",
      finResourceColors,
      "name"
    )
  );

  var finResourceSeriesClass = prepareSeriesTidy(
    finResourceClass,
    false,
    false,
    "Commodity",
    "Pipeline Group",
    "Financial Resource",
    commodityColors,
    "name"
  );

  const createFinResourceTotals = (seriesData) => {
    return new Highcharts.chart("container_fin_totals", {
      chart: {
        height: "10%",
        type: "bar",
        gridLineWidth: 0,
      },
      credits: {
        enabled: false,
      },

      plotOptions: {
        bar: {
          animation: false,
          stacking: "normal",
          marker: true,
          dataLabels: {
            enabled: true,
            formatter: function () {
              return `${
                this.point.series.name
              } total financial resources: <br> ${(this.y / 1000000000).toFixed(
                2
              )} billion $CAD`;
            },
          },
        },
        series: {
          enableMouseTracking: false,
        },
      },

      legend: {
        enabled: false,
      },

      yAxis: {
        visible: false,
        title: {
          enabled: false,
        },
        labels: {
          enabled: false,
        },
      },

      xAxis: {
        visible: false,
        title: {
          enabled: false,
        },
        labels: {
          enabled: false,
        },
      },

      tooltip: {
        enabled: false,
      },

      series: seriesData,
    });
  };

  const createFinResourceChart = (seriesData, finResourceFilters) => {
    return new Highcharts.chart("container_fin_resources", {
      chart: {
        //height: "30%",
      },

      credits: {
        enabled: false,
      },

      plotOptions: {
        column: {
          marker: true,
        },
      },

      tooltip: {
        shared: true,
      },

      title: {
        text: `Financial Instruments Utilized in Financial Resource Plan: ${finResourceFilters.Commodity} Pipelines`,
      },

      xAxis: {
        type: "category",
      },
      yAxis: [
        {
          title: {
            text: "Number of companies using financial resource",
          },
          stackLabels: {
            enabled: true,
          },
        },
        {
          title: {
            text: "Financial resources (Billion $CAD)",
          },
          labels: {
            formatter: function () {
              return this.value / 1000000000;
            },
          },
          opposite: true,
        },
      ],

      series: seriesData,
    });
  };

  const createFinResourceChartClass = (seriesData, finResourceFilters) => {
    return new Highcharts.chart("container_fin_resources_class", {
      chart: {
        //height: "30%",
        type: "column",
        events: {
          load: function () {
            creditsClick(this, "https://www.cer-rec.gc.ca/en/index.html");
          },
        },
      },

      credits: {
        text: "Source: CER",
      },

      plotOptions: {
        column: {
          marker: true,
        },
        series: {
          events: {
            legendItemClick: function (e) {
              e.preventDefault();
            },
          },
        },
      },

      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.key +
            "</b><br>" +
            "<i>Companies in " +
            this.key +
            ": </i><br>" +
            finResourceNames[this.key].join(", ")
          );
        },
      },

      title: {
        text: `Absolute Liability Limits by Class: ${finResourceFilters.Commodity} Pipelines`,
      },

      xAxis: {
        type: "category",
      },
      yAxis: {
        title: {
          text: "Financial resource requirement (Billion $CAD)",
        },
        labels: {
          formatter: function () {
            return this.value / 1000000000;
          },
        },
        stackLabels: {
          enabled: true,
        },
      },

      series: seriesData,
    });
  };

  const loadInitialCharts = () => {
    const chartFinTotals = createFinResourceTotals(totals);
    var chartFinResource = createFinResourceChart(
      finResourceSeries,
      finResourceFilters
    );
    var chartFinResourceClass = createFinResourceChartClass(
      finResourceSeriesClass,
      finResourceFilters
    );
  };

  const commodityListener = () => {
    var selectCommodityFin = document.getElementById(
      "select_units_fin_resource"
    );
    selectCommodityFin.addEventListener("change", (selectCommodityFin) => {
      var tempScrollTop = $(window).scrollTop(); //saves the scroll location so that HC doesnt scroll up on chart changes
      var commodity = selectCommodityFin.target.value;
      finResourceFilters.Commodity = commodity;
      if (commodity == "Oil") {
        finResourceColors["Companies using Financial Instrument"] =
          cerPalette["Night Sky"];
        finResourceSeriesClass = prepareSeriesTidy(
          finResourceClass,
          finResourceFilters,
          false,
          "Commodity",
          "Pipeline Group",
          "Financial Resource",
          commodityColors,
          "name"
        );
      } else if (commodity == "Gas") {
        finResourceColors["Companies using Financial Instrument"] =
          cerPalette["Forest"];
        finResourceSeriesClass = prepareSeriesTidy(
          finResourceClass,
          finResourceFilters,
          false,
          "Commodity",
          "Pipeline Group",
          "Financial Resource",
          commodityColors,
          "name"
        );
      } else {
        finResourceColors["Companies using Financial Instrument"] =
          cerPalette["Cool Grey"];
        finResourceSeriesClass = prepareSeriesTidy(
          finResourceClass,
          false,
          false,
          "Commodity",
          "Pipeline Group",
          "Financial Resource",
          commodityColors,
          "name"
        );
      }
      const finResourceSeries = finResourceChartTypes(
        prepareSeriesNonTidy(
          finResourceData,
          finResourceFilters,
          false,
          [
            "Companies using Financial Instrument",
            "Financial Instrument Total",
          ],
          "Financial Instrument",
          finResourceColors,
          "name"
        )
      );
      var chartFinResource = createFinResourceChart(
        finResourceSeries,
        finResourceFilters
      );

      var chartFinResourceClass = createFinResourceChartClass(
        finResourceSeriesClass,
        finResourceFilters
      );
      $(window).scrollTop(tempScrollTop);
    });
  };
  loadInitialCharts();
  commodityListener();
};
