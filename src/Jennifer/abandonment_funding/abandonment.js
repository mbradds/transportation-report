import {
  cerPalette,
  prepareSeriesNonTidy,
  getUnique,
} from "../../modules/util.js";

import abandonmentData from "./Modified.json";

export const jenniferAbandonment = () => {
  const abandonmentColors = {
    "Amounts Set Aside": cerPalette["Sun"],
    "Amount to Recover": cerPalette["Night Sky"],
  };

  const filterSeries = (seriesData) => {
    var exclude = [
      "Total Group 1 Pipelines",
      "Total Group 2 Pipelines",
      "Total CER Regulated Pipelines",
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

  var [seriesData, seriesTotals] = filterSeries(
    prepareSeriesNonTidy(
      abandonmentData,
      false,
      false,
      ["Amounts Set Aside", "Amount to Recover"],
      "Company",
      abandonmentColors,
      2,
      "name"
    )
  );

  console.log(seriesData);
  const createAbandonmentTotals = (seriesData) => {
    return new Highcharts.chart("container_abandonment_totals", {
      chart: {
        height: "30%",
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
            // formatter: function () {
            //   return `${
            //     this.point.series.name
            //   } total financial resources: <br> ${(this.y / 1000000000).toFixed(
            //     2
            //   )} billion $CAD`;
            // },
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
        //visible: false,
        categories: true,
        title: {
          enabled: false,
        },
        // labels: {
        //   enabled: false,
        // },
      },

      tooltip: {
        enabled: false,
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

      yAxis: {},

      series: seriesData,
    });
  };
  const abandonTotals = createAbandonmentTotals(seriesTotals);
  const abandonChart = createAbandonmentChart(seriesData);
};
