import {
  getUnique,
  creditsClick,
  cerPalette,
  tooltipSorted,
  sortJson,
  sortObj,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import financialData from "./PipelineProfileTables.json";

export const cassandraAllPipes = () => {
  const sortLegend = (series) => {
    const toSort = sortJson(
      series.map((row) => {
        return { name: row.name, value: row.data.slice(-1)[0].y };
      })
    );
    const legendOrder = {};
    toSort.map((legendVal, legendPosition) => {
      legendOrder[legendVal.name] = legendPosition + 1;
    });

    return series.map((row) => {
      row.legendIndex = legendOrder[row.name];
      return row;
    });
  };

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
    const overlaps = {};

    for (const pipe in finPipes) {
      var pipeName = finPipes[pipe];
      var dataPipe = data.filter((row) => row.Pipeline == pipeName);
      var unit = dataPipe[0]["Unit"];
      dataPipe = dataPipe.map((v) => {
        if (overlaps.hasOwnProperty(pipeName)) {
          overlaps[pipeName].push(v["Value"]);
        } else {
          overlaps[pipeName] = [];
        }
        return {
          x: v["Year"],
          y: v["Value"],
        };
      });

      var completedMetric = {
        name: pipeName,
        data: dataPipe,
        color: colors[pipe],
      };
      hcData.push(completedMetric);
    }

    // //handle overlaps
    var overlapCounts = {};
    var completed = new Set();
    for (const [key, value] of Object.entries(overlaps)) {
      var currentKey = key;
      var currentData = value;
      for (const [nextKey, nextVal] of Object.entries(overlaps)) {
        if (
          nextKey !== currentKey &&
          !(
            completed.has(currentKey + "-" + nextKey) ||
            completed.has(nextKey + "-" + currentKey)
          )
        ) {
          currentData.map((row, rowNum) => {
            if (row == nextVal[rowNum]) {
              if (overlapCounts.hasOwnProperty(currentKey)) {
                overlapCounts[currentKey]++;
              } else {
                overlapCounts[currentKey] = 1;
              }
              if (overlapCounts.hasOwnProperty(nextKey)) {
                overlapCounts[nextKey]++;
              } else {
                overlapCounts[nextKey] = 1;
              }
            }
          });
          completed.add(currentKey + "-" + nextKey);
          completed.add(nextKey + "-" + currentKey);
        }
      }
    }
    overlapCounts = sortObj(overlapCounts);
    var maxPoint = 10;
    var z = 3;
    for (const [key, value] of Object.entries(overlapCounts)) {
      overlapCounts[key] = { radius: maxPoint, zIndex: z };
      maxPoint = maxPoint - 2;
      z++;
    }

    hcData.map((series) => {
      if (overlapCounts.hasOwnProperty(series.name)) {
        series.zIndex = overlapCounts[series.name].zIndex;
        series.marker = {
          enabled: true,
          radius: overlapCounts[series.name].radius,
        };
        return series;
      }
    });

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

    return [sortLegend(hcData), yOptions];
  };

  const createFinancialChart = (newData, yOptions, filters) => {
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
        text: filters.Type + ": " + filters.Category + " pipelines",
      },

      legend: {
        title: {
          text:
            "Larger symbol size used to show overlapping data. Click on legend items to view less data.",
        },
      },

      tooltip: {
        shared: true,
        formatter: function () {
          return tooltipSorted(this.points, this.x, yOptions.yLabel);
        },
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
        min: 2015.5,
        max: 2018.5,
        crosshair: true,
        categories: true,
      },

      lang: {
        noData: "No Financial Data",
      },
      series: newData,
    });
  };

  const mainPipeline = () => {
    var defaultMetric = "Deemed Equity Ratio";
    var financeFilters = { Category: "All", Type: defaultMetric };
    var [seriesData, yOptions] = prepareSeriesFinance(
      financialData,
      financeFilters
    );
    var chartFinance = createFinancialChart(
      seriesData,
      yOptions,
      financeFilters
    );
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
      return createFinancialChart(seriesData, yOptions, financeFilters);
    };
  };
  try {
    mainPipeline();
  } catch (err) {
    console.log(err);
    errorChart("container_financial_metrics");
  }
};
