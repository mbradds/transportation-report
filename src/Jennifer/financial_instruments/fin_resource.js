import { cerPalette, creditsClick, tooltipPoint } from "../../modules/util.js";
import Series from "highseries";
import { errorChart } from "../../modules/charts.js";
import finResData from "./fin_resource_totals.json";
import finClassData from "./fin_resource_class.json";
import finResNames from "./fin_resource_class_names.json";

export async function jenniferFinResources(lang) {
  var resFilters = { Commodity: "All" };

  const resChartTypes = {
    "Companies using Financial Instrument": "column",
    "Financial Instrument Total": "line",
  };

  const resyAxis = {
    "Companies using Financial Instrument": 0,
    "Financial Instrument Total": 1,
  };

  const commodityTotals = (data, colors) => {
    var totals = {};

    data.map((row) => {
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

  const prodColors = {
    Oil: cerPalette["Night Sky"],
    Gas: cerPalette["Forest"],
  };

  const finResColors = {
    "Companies using Financial Instrument": cerPalette["Cool Grey"],
    "Financial Instrument Total": cerPalette["Sun"],
  };

  const createFinResourceTotals = (seriesData) => {
    return new Highcharts.chart("hc-fin-totals", {
      chart: {
        type: "bar",
        gridLineWidth: 0,
        margin: [0, 0, 0, 50],
      },
      title: {
        text: "",
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
              return `${this.point.series.name} ${lang.dataLabel} <br> ${(
                this.y / 1000000000
              ).toFixed(2)} ${lang.billy}`;
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

  const createResChart = (seriesData, resFilters) => {
    return new Highcharts.chart("container_fin_resources", {
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
        pointFormat: tooltipPoint(""),
      },

      legend: {
        enabled: true,
        marginTop: 5,
        y: 0,
        itemDistance: 10,
      },

      title: {
        text: `${lang.titleResource} ${resFilters.Commodity} ${lang.pipe}`,
      },

      xAxis: {
        type: "category",
      },
      yAxis: [
        {
          title: {
            text: `${lang.yAxisResource1}`,
          },
          stackLabels: {
            enabled: true,
          },
        },
        {
          title: {
            text: `${lang.yAxisResource2}`,
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

  const createClassChart = (seriesData, resFilters) => {
    return new Highcharts.chart("container_fin_resources_class", {
      chart: {
        type: "column",
        events: {
          load: function () {
            creditsClick(this, "https://www.cer-rec.gc.ca/en/index.html");
          },
        },
      },

      credits: {
        text: lang.source,
      },

      plotOptions: {
        column: {
          marker: true,
        },
        series: {
          states: {
            inactive: {
              opacity: 1,
            },
          },
          events: {
            legendItemClick: function (e) {
              e.preventDefault();
            },
          },
        },
      },

      tooltip: {
        formatter: function () {
          return `<b>${this.key}</b><br>
            <i>${lang.tooltipClass} ${this.key}:</i><br>
            ${finResNames[this.key].join(", ")}`;
        },
      },

      title: {
        text: `${lang.titleClass} ${resFilters.Commodity} ${lang.pipe}`,
        margin: 0,
      },

      xAxis: {
        type: "category",
      },
      yAxis: {
        endOnTick: false,
        title: {
          text: `${lang.yAxisClass}`,
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

  const getClassFilters = (filters) => {
    if (filters.Commodity == "All") {
      return false;
    } else {
      return filters;
    }
  };

  const loadInitialCharts = () => {
    const totals = commodityTotals(finResData, prodColors);
    var seriesFin = new Series({
      data: finResData,
      xCol: "Financial Instrument",
      yCols: [
        "Companies using Financial Instrument",
        "Financial Instrument Total",
      ],
      xName: "name",
      colors: finResColors,
      seriesTypes: resChartTypes,
      filters: resFilters,
      yAxis: resyAxis,
    });
    var seriesClass = new Series({
      data: finClassData,
      colors: prodColors,
      filters: getClassFilters(resFilters),
      xCol: "Pipeline Group",
      yCols: "Commodity",
      valuesCol: "Financial Resource",
      xName: "name",
    });

    const chartFinTotals = createFinResourceTotals(totals);
    var chartFinResource = createResChart(seriesFin.hcSeries, resFilters);
    var chartfinClassData = createClassChart(seriesClass.hcSeries, resFilters);

    var selectCommodityFin = document.getElementById(
      "select_units_fin_resource"
    );
    selectCommodityFin.addEventListener("change", (selectCommodityFin) => {
      var commodity = selectCommodityFin.target.value;
      resFilters.Commodity = commodity;
      if (commodity == "Oil") {
        finResColors["Companies using Financial Instrument"] =
          cerPalette["Night Sky"];
      } else if (commodity == "Gas") {
        finResColors["Companies using Financial Instrument"] =
          cerPalette["Forest"];
      } else {
        finResColors["Companies using Financial Instrument"] =
          cerPalette["Cool Grey"];
      }
      //create new series after commodity is selected
      seriesClass.update({
        data: finClassData,
        colors: prodColors,
        filters: getClassFilters(resFilters),
      });
      seriesFin.update({ data: finResData, filters: resFilters });
      //create new charts after commodity is selected
      var chartFinResource = createResChart(seriesFin.hcSeries, resFilters);
      var chartfinClassData = createClassChart(
        seriesClass.hcSeries,
        resFilters
      );
    });
  };

  try {
    return loadInitialCharts();
  } catch (err) {
    errorChart("container_fin_totals");
    errorChart("container_fin_resources");
    errorChart("container_fin_resources_class");
    return;
  }
}
