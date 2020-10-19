import {
  cerPalette,
  creditsClick,
  prepareSeriesPie,
} from "../../modules/util.js";

import crudeModeData from "./CrudeRawData-2019-01-01-2019-12-01.json";

export const coletteCrudeMode = () => {
  const crudeModeColors = {
    Pipeline: cerPalette["Night Sky"],
    Marine: cerPalette["Ocean"],
    Railroad: cerPalette["Sun"],
  };
  const seriesData = prepareSeriesPie(
    crudeModeData,
    "Crude Exports by Mode",
    "Attribute",
    "Percent",
    crudeModeColors
  );
  const createCrudeModeChart = (seriesData) => {
    const crudeModeChart = Highcharts.chart("container_crude_mode", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        events: {
          load: function () {
            creditsClick(
              this,
              "https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english"
            );
          },
        },
      },
      credits: {
        text: "Source: CER Commodity Tracking System",
      },
      tooltip: {
        pointFormat: "<b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
          showInLegend: true,
        },
      },
      series: seriesData,
    });
    return crudeModeChart;
  };
  createCrudeModeChart(seriesData);
};
