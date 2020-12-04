import { cerPalette, prepareSeriesNonTidy } from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";

import abandonData from "./Modified.json";

export const jenniferAbandonment = () => {
  const colors = {
    "Amounts Set Aside": cerPalette["Sun"],
    "Remaining Estimate": cerPalette["Night Sky"],
  };

  var filters = { commodity: "All" };

  const g1SeriesName = (filters) => {
    if (filters.commodity == "All") {
      var company = "Total Group 1 Pipelines";
    } else {
      var company = `Total Group 1 ${filters.commodity} Pipelines`;
    }
    return company;
  };

  const filterData = (data, filters) => {
    const totals = (data) => {
      const exclude = ["Total CER Pipelines", "Total Group 2 Pipelines"];
      var totals = {
        ACE: 0,
        "Amounts Set Aside": 0,
        Commodity: "All",
        Company: g1SeriesName(filters),
      };
      data.map((row) => {
        if (!exclude.includes(row.Company)) {
          totals.ACE += row.ACE;
          totals["Amounts Set Aside"] += row["Amounts Set Aside"];
        }
      });
      totals["% of ACE Set Aside"] =
        totals["Amounts Set Aside"] / totals["ACE"];
      totals["Remaining Estimate"] =
        totals["ACE"] - totals["Amounts Set Aside"];
      return totals;
    };

    if (filters.commodity == "All") {
      var totalG1 = totals(data);
    } else {
      data = data.filter(
        (row) => row.Commodity == filters.commodity || row.Commodity == "All"
      );
      var totalG1 = totals(data);
    }
    data = data.concat(totalG1);
    data.sort(function (a, b) {
      return b.ACE - a.ACE;
    });
    return data;
  };

  const filterSeries = (seriesData, filters) => {
    var exclude = [
      g1SeriesName(filters),
      "Total Group 2 Pipelines",
      "Total CER Pipelines",
    ];

    var seriesTotals = [];

    seriesData = seriesData.map((series) => {
      seriesTotals.push({
        name: series.name,
        color: series.color,
        data: series.data.filter((row) => exclude.includes(row.name)),
      });

      return {
        data: series.data.filter((row) => !exclude.includes(row.name)),
        name: series.name,
        color: series.color,
      };
    });
    return [seriesData, seriesTotals];
  };

  const createAbandSeries = (abandonData, filters, colors) => {
    var [seriesData, seriesTotals] = filterSeries(
      prepareSeriesNonTidy(
        filterData(abandonData, filters),
        false,
        false,
        ["Amounts Set Aside", "Remaining Estimate"],
        "Company",
        colors,
        2,
        "name"
      ),
      filters
    );
    return [seriesData, seriesTotals];
  };

  const tooltipAbandon = (event) => {
    var toolText = `<b>${event.points[0].key}</b><table>`;
    var calc = {};
    event.points.map((p) => {
      calc[p.series.name] = p.y;
      toolText += `<tr><td> <span style="color: ${p.color}">\u25CF</span> ${
        p.series.name
      }: </td><td style="padding:0"><b>${Highcharts.numberFormat(
        p.y,
        0,
        ".",
        " "
      )}</b></td></tr>`;
    });

    calc["pctRecovered"] = (
      (calc["Amounts Set Aside"] /
        (calc["Remaining Estimate"] + calc["Amounts Set Aside"])) *
      100
    ).toFixed(1);
    return (
      toolText +
      `<tr><td> % set-aside: </td><td style="padding:0"> <b>${calc["pctRecovered"]}% </b></td></tr>`
    );
  };

  const createAbandonmentTotals = (seriesData) => {
    new Highcharts.chart("container_abandonment_totals", {
      chart: {
        type: "bar",
        gridLineWidth: 0,
      },

      title: { text: "Abandonment Funding Totals" },

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
              if (this.key !== "Total Group 2 Pipelines") {
                return `${(this.point.y / 1000000000).toFixed(1)} Billion`;
              } else {
                return null;
              }
            },
          },
        },
        series: {
          pointWidth: 30,
          states: {
            inactive: {
              opacity: 1,
            },
          },
        },
      },

      legend: {
        enabled: false,
      },

      yAxis: {
        gridLineColor: "transparent",
        lineColor: "transparent",
        title: {
          enabled: false,
        },
        labels: {
          enabled: false,
        },
        stackLabels: {
          enabled: true,
          formatter: function () {
            var [remaining, total] = this.points[0];
            var recovered = total - remaining;
            return (recovered / total).toFixed(2) * 100 + "% set-aside";
          },
        },
      },

      xAxis: {
        categories: true,
        title: {
          enabled: false,
        },
        stackLabels: {
          enabled: true,
        },
      },

      tooltip: {
        shared: true,
        formatter: function () {
          return tooltipAbandon(this);
        },
      },

      series: seriesData,
    });
  };

  const createAbandonmentChart = (seriesData) => {
    return new Highcharts.chart("container_abandonment", {
      chart: {
        type: "column",
      },

      title: { text: "Group 1 Abandonment Breakdown" },

      plotOptions: {
        series: {
          states: {
            inactive: {
              opacity: 1,
            },
          },
        },
      },

      credits: {
        text: "Source: CER",
      },
      xAxis: {
        categories: true,
      },

      tooltip: {
        shared: true,
        formatter: function () {
          return tooltipAbandon(this);
        },
      },

      yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
          text: "Abandonment Costs (Billions)",
        },
        labels: {
          formatter: function () {
            return this.value / 1000000000;
          },
        },
      },

      series: seriesData,
    });
  };

  const mainAbandon = () => {
    var [seriesData, seriesTotals] = createAbandSeries(
      abandonData,
      filters,
      colors
    );
    createAbandonmentTotals(seriesTotals);
    createAbandonmentChart(seriesData);
    var selectCommodityAbandon = document.getElementById(
      "select_commodity_abandon"
    );
    selectCommodityAbandon.addEventListener(
      "change",
      (selectCommodityAbandon) => {
        filters.commodity = selectCommodityAbandon.target.value;
        var [seriesData, seriesTotals] = createAbandSeries(
          abandonData,
          filters,
          colors
        );
        createAbandonmentTotals(seriesTotals);
        var abandonChart = createAbandonmentChart(seriesData);
        if (filters.commodity == "All") {
          var titleText = "Group 1 Abandonment Breakdown";
        } else {
          var titleText = `Group 1 Abandonment Breakdown - ${filters.commodity}`;
        }
        abandonChart.update({
          title: { text: titleText },
        });
      }
    );
  };
  try {
    mainAbandon();
  } catch (err) {
    errorChart("container_abandonment_totals");
    errorChart("container_abandonment");
  }
};
