import { cerPalette } from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import abandonData from "./Modified.json";
import Series from "highseries";

const createChart = (lang) => {
  const colors = {
    "Amounts Set Aside": cerPalette["Sun"],
    "Remaining Estimate": cerPalette["Night Sky"],
  };

  var filters = { commodity: "All" };

  const g1SeriesName = (filters) => {
    if (filters.commodity == "All") {
      return "Group 1 Pipeline Companies";
    } else {
      return `Group 1 ${filters.commodity} Pipelines`;
    }
  };

  const filterData = (data, filters) => {
    const totals = (data) => {
      const exclude = [
        "All CER Regulated Pipeline Companies",
        "Group 2 Pipeline Companies",
      ];
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
      "Group 2 Pipeline Companies",
      "All CER Regulated Pipeline Companies",
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

  const tooltipAbandon = (event) => {
    var toolText = `<b>${event.points[0].key}</b><table>`;
    var calc = {};
    event.points.map((p) => {
      calc[p.series.name] = p.y;
      toolText += `<tr><td> <span style="color: ${p.color}">\u25CF</span> ${
        p.series.name
      }: </td><td style="padding:0"><b>$${Highcharts.numberFormat(
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
      `<tr><td> ${lang.pctAside} </td><td style="padding:0"> <b>${calc["pctRecovered"]}% </b></td></tr>`
    );
  };

  const createAbandonmentTotals = (seriesData) => {
    new Highcharts.chart("hc-abanbdon-totals", {
      chart: {
        type: "bar",
        gridLineWidth: 0,
      },

      title: { text: `${lang.titleTotal}`, margin: 0 },

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
              if (this.key !== "Group 2 Pipeline Companies") {
                return `$${(this.point.y / 1000000000).toFixed(1)} ${
                  lang.billy
                }`;
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
            return (recovered / total).toFixed(2) * 100 + lang.pctAside;
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

      title: {
        text: lang.title,
        margin: 0,
      },

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
        text: lang.source,
      },
      xAxis: {
        categories: true,
      },

      legend: {
        margin: 0,
        y: 0,
        padding: 0,
        itemMarginTop: 0,
        itemMarginBottom: 0,
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
          text: lang.yAxis,
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
    let series = new Series({
      data: filterData(abandonData, filters),
      xCol: "Company",
      yCols: ["Amounts Set Aside", "Remaining Estimate"],
      colors: colors,
      xName: "name",
    });
    var [seriesData, seriesTotals] = filterSeries(series.hcSeries, filters);
    createAbandonmentTotals(seriesTotals);
    createAbandonmentChart(seriesData);
    var selectCommodityAbandon = document.getElementById(
      "select_commodity_abandon"
    );
    selectCommodityAbandon.addEventListener(
      "change",
      (selectCommodityAbandon) => {
        filters.commodity = selectCommodityAbandon.target.value;
        series.update({ data: filterData(abandonData, filters) });
        var [seriesData, seriesTotals] = filterSeries(series.hcSeries, filters);
        createAbandonmentTotals(seriesTotals);
        var abandonChart = createAbandonmentChart(seriesData);
        if (filters.commodity == "All") {
          var titleText = lang.title;
        } else {
          var titleText = `${lang.title} - ${filters.commodity}`;
        }
        abandonChart.update({
          title: { text: titleText },
        });
      }
    );
  };
  try {
    return mainAbandon();
  } catch (err) {
    errorChart("hc-abanbdon-totals");
    errorChart("container_abandonment");
    return;
  }
};

export function jenniferAbandonment(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
