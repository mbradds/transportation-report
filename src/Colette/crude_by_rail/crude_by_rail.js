import { cerPalette, prepareSeriesNonTidy,creditsClick } from "../../modules/util.js";

import railData from "./crude_by_rail_wcs.json";

export const coletteCrudeByRail = () => {
  const railChartTypes = (series) => {
    series.map((data, seriesNum) => {
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

  const railFilters = { Units: "bbl per day" };
  const railColors = {
    "Crude by Rail": cerPalette["Night Sky"],
    "WCS-WTI Differential": cerPalette["Sun"],
  };

  const seriesData = railChartTypes(
    prepareSeriesNonTidy(
      railData,
      railFilters,
      ["Crude by Rail", "WCS-WTI Differential"],
      "Date",
      railColors
    )
  );

  const createRailChart = () => {
    const chartRail = new Highcharts.chart("container_crude_by_rail", {
      chart: {
        type: "area", //line,bar,scatter,area,areaspline
        zoomType: "x", 
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(this,"https://www.cer-rec.gc.ca/en/data-analysis/energy-commodities/crude-oil-petroleum-products/statistics/canadian-crude-oil-exports-rail-monthly-data.html")
          },
        },
      },

      credits: {
        text: "Source: CER Crude by Rail Exports & ne2 Group",
      },

      title: { text: null },

      tooltip: {
        shared: true,
      },

      series: seriesData,

      xAxis: {
        type: "datetime",
        crosshair: true,
        dateTimeLabelFormats: {
          day: "%e of %b",
        },
      },
      yAxis: [
        {
          // Primary yAxis
          labels: {
            format: "{value}",
            style: {
              color: "black",
            },
          },
          title: {
            text: "Rail Exports - bbl per day",
            style: {
              color: "black",
            },
          },
        },
        {
          // Secondary yAxis
          title: {
            text: "Differential - USD/bbl",
            style: {
              color: "black",
            },
          },
          labels: {
            format: "{value}",
            style: {
              color: "black",
            },
          },
          opposite: true,
        },
      ],
    });

    return chartRail;
  };

  var chartRail = createRailChart(seriesData);

  var selectUnitsRail = document.getElementById("select_units_rail");
  selectUnitsRail.addEventListener("change", (selectUnitsRail) => {
    var units = selectUnitsRail.target.value;
    railFilters["Units"] = units;
    const seriesData = railChartTypes(
      prepareSeriesNonTidy(
        railData,
        railFilters,
        ["Crude by Rail", "WCS-WTI Differential"],
        "Date",
        railColors
      )
    );
    chartRail.update({
      series: seriesData,
      yAxis: {
        title: { text: "Rail Exports - " + units },
      },
    });
  });
};
