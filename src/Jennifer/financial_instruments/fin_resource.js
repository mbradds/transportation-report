import {
  cerPalette,
  prepareSeriesNonTidy,
  prepareSeriesTidy,
} from "../../modules/util.js";

import finResourceData from "./fin_resource_totals.json";
import finResourceClass from "./fin_resource_class.json";

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
      ["Companies using Financial Instrument", "Financial Instrument Total"],
      "Financial Instrument",
      finResourceColors,
      "name"
    )
  );

  var finResourceSeriesClass = prepareSeriesTidy(
    finResourceClass,
    false,
    "Commodity",
    "Pipeline Group",
    "Financial Resource",
    commodityColors,
    "name"
  );

  const createFinResourceTotals = (seriesData) => {
    const chart = new Highcharts.chart("container_fin_totals", {
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

      title: {
        text: null,
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
        // formatter: function () {
        //   return `<b> Click to view ${this.series.name} financial resources </B> <br> <em> Double click to return to All </em>`;
        // },
      },

      series: seriesData,
    });

    return chart;
  };

  const createFinResourceChart = (seriesData, finResourceFilters) => {
    const chart = new Highcharts.chart("container_fin_resources", {
      chart: {
        height: "30%",
        animation: true,
      },

      credits: {
        enabled: false,
      },

      title: {
        text: null,
      },

      plotOptions: {
        column: {
          stacking: "normal",
          marker: true,
          dataLabels: {
            enabled: false,
          },
        },
      },

      tooltip: {
        animation: true,
        shared: true,
      },

      title: {
        text: `Number of Companies & Total Financial Resources: ${finResourceFilters.Commodity} Pipelines`,
      },

      xAxis: {
        type: "category",
      },
      yAxis: [
        {
          // Primary yAxis
          title: {
            text: "Number of companies using financial resource",
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: "bold",
              color: (Highcharts.theme && Highcharts.theme.textColor) || "gray",
            },
          },
        },
        {
          // Secondary yAxis
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

  const createFinResourceChartClass = (seriesData, finResourceFilters) => {
    const chart = new Highcharts.chart("container_fin_resources_class", {
      chart: {
        height: "30%",
        type: "column",
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

      plotOptions: {
        column: {
          stacking: "normal",
          marker: true,
          dataLabels: {
            enabled: false,
          },
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
        animation: true,
        shared: true,
      },

      title: {
        text: `Financial Resource Limits by Class: ${finResourceFilters.Commodity} Pipelines`,
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
          style: {
            fontWeight: "bold",
            color: (Highcharts.theme && Highcharts.theme.textColor) || "gray",
          },
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

  const loadInitialCharts = () => {
    const chartFinTotals = createFinResourceTotals(totals);
    const chartFinResource = createFinResourceChart(
      finResourceSeries,
      finResourceFilters
    );
    const chartFinResourceClass = createFinResourceChartClass(
      finResourceSeriesClass,
      finResourceFilters
    );
  };

  const commodityListener = () => {
    var selectCommodityFin = document.getElementById(
      "select_units_fin_resource"
    );
    selectCommodityFin.addEventListener("change", (selectCommodityFin) => {
      var commodity = selectCommodityFin.target.value;
      finResourceFilters.Commodity = commodity;
      if (commodity == "Oil") {
        finResourceColors["Companies using Financial Instrument"] =
          cerPalette["Night Sky"];
        finResourceSeriesClass = prepareSeriesTidy(
          finResourceClass,
          finResourceFilters,
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
          [
            "Companies using Financial Instrument",
            "Financial Instrument Total",
          ],
          "Financial Instrument",
          finResourceColors,
          "name"
        )
      );
      const chartFinResource = createFinResourceChart(
        finResourceSeries,
        finResourceFilters
      );

      const chartFinResourceClass = createFinResourceChartClass(
        finResourceSeriesClass,
        finResourceFilters
      );
    });
  };

  loadInitialCharts();
  commodityListener();
};
