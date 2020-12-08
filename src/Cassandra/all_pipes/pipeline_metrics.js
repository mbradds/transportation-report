import {
  getUnique,
  creditsClick,
  cerPalette,
  tooltipPoint,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import financialData from "./PipelineProfileTables.json";

export const cassandraAllPipes = () => {
  const prepareSeriesFinance = (data, filters) => {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== "All") {
        data = data.filter((row) => row[key] == value);
      }
    }

    const colors = [];
    for (const [key, value] of Object.entries(cerPalette)) {
      colors.push(value);
    }

    var finPipes = getUnique(data, "Pipeline");
    var hcData = [];

    for (const pipe in finPipes) {
      var dataPipe = data.filter((row) => row.Pipeline == finPipes[pipe]);
      var unit = dataPipe[0]["Unit"];
      dataPipe = dataPipe.map((v) => {
        return {
          x: v["Year"],
          y: v["Value"],
        };
      });

      var completedMetric = {
        name: finPipes[pipe],
        data: dataPipe,
        color: colors[pipe],
      };
      hcData.push(completedMetric);
    }

    var yOptions = {};
    if (unit == "%") {
      yOptions.yFormat = "{value}%";
      yOptions.yLabel = "%";
      yOptions.tooltip = "%";
      yOptions.yCall = function () {
        return this.value + "%";
      };
    } else {
      yOptions.yFormat = "{value:,.0f}";
      yOptions.yLabel = "C$ (Millions)";
      yOptions.tooltip = "C$";
      yOptions.yCall = function () {
        return this.value / 1000000;
      };
    }
    yOptions.yMin = function () {
      if (filters.Type == "Deemed Equity Ratio") {
        return 0;
      }
    };

    return [hcData, yOptions];
  };

  var defaultMetric = "Deemed Equity Ratio";
  var financeFilters = { Category: "All", Type: defaultMetric };

  const createFinancialChart = (newData, yOptions) => {
    return new Highcharts.chart("container_financial_metrics", {
      chart: {
        type: "line",
        zoomType: "x",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(this, "https://apps.cer-rec.gc.ca/REGDOCS/Home/Index");
          },
        },
      },

      credits: {
        text: "Source: CER REGDOCS",
      },

      plotOptions: {
        series: {
          connectNulls: false,
          states: {
            inactive: {
              opacity: 1,
            },
            hover: {
              enabled: false,
            },
          },
        },
      },

      title: {
        text:
          financeFilters.Type + ": " + financeFilters.Category + " pipelines",
      },

      // legend: {
      //   labelFormatter: function () {
      //     console.log(this);
      //   },
      // },

      tooltip: {
        shared: true,
        pointFormat: tooltipPoint(yOptions.tooltip),
      },

      yAxis: {
        startOnTick: false,
        endOnTick: false,
        min: yOptions.yMin(),
        title: {
          text: yOptions.yLabel,
        },
        labels: {
          formatter: yOptions.yCall,
        },
      },

      xAxis: {
        crosshair: true,
      },

      lang: {
        noData: "No Financial Data",
      },
      series: newData,
    });
  };

  const mainPipeline = () => {
    var [seriesData, yOptions] = prepareSeriesFinance(
      financialData,
      financeFilters
    );
    var chartFinance = createFinancialChart(seriesData, yOptions);
    var selectMetricFinancial = document.getElementById(
      "select_metric_financial"
    );

    selectMetricFinancial.addEventListener(
      "change",
      (selectMetricFinancial) => {
        var metric = selectMetricFinancial.target.value;
        financeFilters.Type = metric;
        chartFinance = graphEvent(financeFilters);
      }
    );

    var selectPipeFinancial = document.getElementById(
      "select_pipelines_financial"
    );

    selectPipeFinancial.addEventListener("change", (selectPipeFinancial) => {
      var pipeGroup = selectPipeFinancial.target.value;
      financeFilters.Category = pipeGroup;
      chartFinance = graphEvent(financeFilters);
    });

    const graphEvent = (filters) => {
      [seriesData, yOptions] = prepareSeriesFinance(financialData, filters);
      return createFinancialChart(seriesData, yOptions);
    };
  };
  try {
    mainPipeline();
  } catch (err) {
    errorChart("container_financial_metrics");
  }
};
