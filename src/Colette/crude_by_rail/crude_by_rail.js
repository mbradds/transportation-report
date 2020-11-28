import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";

import railData from "./crude_by_rail_wcs.json";

export const coletteCrudeByRail = () => {
  const railChartTypes = (series) => {
    series.map((data) => {
      if (data.name == "Crude by Rail") {
        data.type = "area";
        data.yAxis = 0;
      } else {
        data.type = "line";
        data.yAxis = 1;
      }
    });

    return series;
  };

  const railFilters = { Units: "Mb/d" };
  const railColors = {
    "Crude by Rail": cerPalette["Night Sky"],
    "WCS-WTI Differential": cerPalette["Sun"],
  };

  const seriesData = railChartTypes(
    prepareSeriesNonTidy(
      railData,
      railFilters,
      false,
      ["Crude by Rail", "WCS-WTI Differential"],
      "Date",
      railColors
    )
  );

  const createRailChart = (seriesData, railFilters) => {
    return new Highcharts.chart("container_crude_by_rail", {
      chart: {
        type: "area",
        zoomType: "x",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(
              this,
              "https://www.cer-rec.gc.ca/en/data-analysis/energy-commodities/crude-oil-petroleum-products/statistics/canadian-crude-oil-exports-rail-monthly-data.html"
            );
          },
        },
      },

      credits: {
        text: "Source: CER Crude by Rail Exports & ne2 Group",
      },

      tooltip: {
        shared: true,
        formatter: function () {
          var toolText = `<b> ${Highcharts.dateFormat(
            "%B-%Y",
            this.x
          )} </b><table>`;
          this.points.map((p) => {
            if (p.series.name == "Crude by Rail") {
              var unitsTooltip = railFilters.Units;
              var yValue = p.y;
            } else {
              var unitsTooltip = "USD/bbl";
              var yValue = p.y * -1;
            }
            toolText += `<tr><td> <span style="color: ${p.color}">\u25CF</span> ${p.series.name}: </td><td style="padding:0"><b>${yValue} ${unitsTooltip}</b></td></tr>`;
          });
          return toolText + "</table>";
        },
      },

      series: seriesData,

      xAxis: {
        type: "datetime",
        crosshair: true,
      },
      yAxis: [
        {
          title: {
            text: `Rail Exports - ${railFilters.Units}`,
          },
        },
        {
          title: {
            text: "Differential - USD/bbl",
          },
          labels: {
            formatter: function () {
              return this.value * -1;
            },
          },
          opposite: true,
        },
      ],
    });
  };

  const mainChartRail = () => {
    var chartRail = createRailChart(seriesData, railFilters);
    var selectUnitsRail = document.getElementById("select_units_rail");
    selectUnitsRail.addEventListener("change", (selectUnitsRail) => {
      railFilters.Units = selectUnitsRail.target.value;
      const seriesData = railChartTypes(
        prepareSeriesNonTidy(
          railData,
          railFilters,
          false,
          ["Crude by Rail", "WCS-WTI Differential"],
          "Date",
          railColors
        )
      );
      chartRail.update({
        series: seriesData,
        yAxis: {
          title: { text: `Rail Exports - ${railFilters.Units}` },
        },
      });
    });
  };
  try {
    mainChartRail();
  } catch (err) {
    errorChart("container_crude_by_rail");
  }
};
