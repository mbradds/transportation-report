import {
  cerPalette,
  getData,
  fillDrop,
  prepareSeriesNonTidy,
} from "../../modules/util.js";

export const jenniferFinResources = () => {
  const finResourceChartTypes = (series) => {
    series.map((data, seriesNum) => {
      data.data = data.data.map((row, rowNum) => {
        return { name: row.x, y: row.y };
      });
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
  const finResourceData = JSON.parse(
    getData("/src/Jennifer/financial_instruments/fin_resource_totals.json")
  );

  const totals = commodityTotals(finResourceData, commodityColors);

  var finResourceFilters = { Commodity: "All" };

  const finResourceSeries = finResourceChartTypes(
    prepareSeriesNonTidy(
      finResourceData,
      finResourceFilters,
      ["Companies using Financial Instrument", "Financial Instrument Total"],
      "Financial Instrument",
      finResourceColors
    )
  );

  const createFinResourceChart = (seriesData, finResourceFilters) => {
    const chart = new Highcharts.chart("container_fin_resources", {
      chart: {
        zoomType: "x", //allows the user to focus in on the x or y (x,y,xy)
        //borderColor: "black",
        //borderWidth: 1,
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
      },

      tooltip: {
        animation: true,
        shared: true,
      },

      title: {
        text: `CER Financial Resource Requirements: ${finResourceFilters.Commodity}`,
      },

      xAxis: {
        type: "category",
      },
      yAxis: [
        {
          // Primary yAxis
          title: {
            text: "Number of Companies using Financial Resource",
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
            text: "Total Financial Resource ($)",
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

  const createFinResourceTotals = (
    seriesData,
    finResourceFilters,
    finResourceColors
  ) => {
    const chart = new Highcharts.chart("container_fin_totals", {
      chart: {
        height: "20%",
        type: "bar",
        gridLineWidth: 0,
      },
      credits: {
        enabled: false,
      },

      plotOptions: {
        bar: {
          stacking: "normal",
          marker: true,
          dataLabels: {
            enabled: true,
            formatter: function () {
              //console.log(this.point.series.name)
              return `${
                this.point.series.name
              } financial resources: <br> ${this.y.toString()}`;
            },
          },
        },
        series: {
          point: {
            events: {
              click: function () {
                const newCommodity = this.series.userOptions.name;

                if (newCommodity !== finResourceFilters.Commodity) {
                  finResourceFilters.Commodity = newCommodity;
                } else {
                  finResourceFilters.Commodity = "All";
                  finResourceColors["Companies using Financial Instrument"] =
                    cerPalette["Cool Grey"];
                }

                if (finResourceFilters.Commodity == "Oil") {
                  finResourceColors["Companies using Financial Instrument"] =
                    cerPalette["Night Sky"];
                } else if (finResourceFilters.Commodity == "Gas") {
                  finResourceColors["Companies using Financial Instrument"] =
                    cerPalette["Forest"];
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
                    finResourceColors
                  )
                );
                const chartFinResource = createFinResourceChart(
                  finResourceSeries,
                  finResourceFilters
                );
              },
            },
          },
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
      },
      series: seriesData,
    });

    return chart;
  };

  const chartFinTotals = createFinResourceTotals(
    totals,
    finResourceFilters,
    finResourceColors
  );
  const chartFinResource = createFinResourceChart(
    finResourceSeries,
    finResourceFilters
  );
};
