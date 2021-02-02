import { cerPalette, creditsClick } from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import Series from "highseries";
import railData from "./crude_by_rail_wcs.json";

const createChart = (lang) => {
  const railFilters = { Units: "Mb/d" };
  const railColors = {
    "Crude by Rail": cerPalette["Night Sky"],
    "WCS-WTI Differential": cerPalette["Sun"],
  };

  const railTypes = {
    "Crude by Rail": "area",
    "WCS-WTI Differential": "line",
  };

  const railAxis = {
    "Crude by Rail": 0,
    "WCS-WTI Differential": 1,
  };

  let series = new Series({
    data: railData,
    xCol: "Date",
    yCols: ["Crude by Rail", "WCS-WTI Differential"],
    colors: railColors,
    filters: railFilters,
    seriesTypes: railTypes,
    yAxis: railAxis,
  });

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
        text: lang.source,
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
            text: `${lang.yAxis} - ${railFilters.Units}`,
          },
        },
        {
          title: {
            text: `${lang.differential} - USD/bbl`,
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
    var chartRail = createRailChart(series.hcSeries, railFilters);
    var selectUnitsRail = document.getElementById("select_units_rail");
    selectUnitsRail.addEventListener("change", (selectUnitsRail) => {
      railFilters.Units = selectUnitsRail.target.value;
      series.update({ data: railData, filters: railFilters });
      chartRail.update({
        series: series.hcSeries,
        yAxis: {
          title: { text: `${lang.yAxis} - ${railFilters.Units}` },
        },
      });
    });
  };
  try {
    return mainChartRail();
  } catch (err) {
    return errorChart("container_crude_by_rail");
  }
};

export function coletteCrudeByRail(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
