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

  const prepareSeriesPie = (
    data,
    nameCol,
    yCols,
    colors,
    colorByPoint = true
  ) => {
    const series1 = {
      name: 'Group 1',
      colorByPoint: colorByPoint,
      color: colors[0],
    };
    series1.data = []
    yCols.map((yCol) => {
      data.map((row) => {
        series1.data.push({
          name: row[nameCol] + "-" + yCol,
          y: row[yCol],
          color: colors[yCol],
        });
      });
    });
    console.log(series1)
    return [series1];
  };

  const filterSeries = (seriesData) => {
    var exclude = [
      "Total Group 1 Pipelines",
      "Total Group 2 Pipelines",
      "Total CER Regulated Pipelines",
    ];
    return seriesData.map((series) => {
      return {
        data: series.data.filter((row) => !exclude.includes(row.name.split("-")[0])),
        name: series.name,
        color: series.color,
      };
    });
  };

  const seriesPie = filterSeries(
    prepareSeriesPie(
      abandonmentData,
      "Company",
      ["Amounts Set Aside", "Amount to Recover"],
      abandonmentColors,
      false
    )
  );

  console.log(seriesPie);

  var seriesData = filterSeries(
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

  const createPieChart = (seriesData) => {
    return Highcharts.chart("container_pie_group1", {
      chart: {
        type: "pie",
      },
      tooltip: {
        pointFormat: "<b>{point.percentage:.1f}%</b>",
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          cursor: "pointer",
          dataLabels: {
            enabled: false,
          },
          showInLegend: false,
        },
      },
      series: seriesData,
    });
  };

  const createAbandonmentChart = (seriesData) => {
    return new Highcharts.chart("container_abandonment", {
      chart: {
        type: "column",
        borderWidth: 1,
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
        text: "Source: CER",
      },
      xAxis: {
        categories: true,
      },

      yAxis: {},

      series: seriesData,
    });
  };

  const pieGroup1 = createPieChart(seriesPie);
  const abandonChart = createAbandonmentChart(seriesData);
};
