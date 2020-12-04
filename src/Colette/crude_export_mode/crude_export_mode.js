import {
  cerPalette,
  creditsClick,
  prepareSeriesPie,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import crudeModeData from "./CrudeRawData-2019-01-01-2019-12-01.json";

export const coletteCrudeMode = () => {
  const crudeModeColors = {
    Pipeline: cerPalette["Night Sky"],
    Marine: cerPalette["Ocean"],
    Rail: cerPalette["Sun"],
  };

  const createCrudeModeChart = (seriesData) => {
    return Highcharts.chart("container_crude_mode", {
      chart: {
        borderWidth: 1,
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
        headerFormat: "<table>",
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
  };
  try {
    const seriesData = prepareSeriesPie(
      crudeModeData,
      "Crude Exports by Mode",
      "Attribute",
      "Percent",
      crudeModeColors
    );
    createCrudeModeChart(seriesData);
  } catch (err) {
    errorChart("container_crude_mode");
  }
};
