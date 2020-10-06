import {
  cerPalette,
  getData,
  prepareSeriesNonTidy,
} from "../../modules/util.js";

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

  const railData = JSON.parse(
    getData("/src/Colette/crude_by_rail/crude_by_rail_wcs.json")
  );
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
        zoomType: "x", //allows the user to focus in on the x or y (x,y,xy)
        borderColor: "black",
        borderWidth: 1,
        animation: true,
        events: {
          load: function () {
            this.credits.element.onclick = function () {
              window.open(
                "https://www.cer-rec.gc.ca/en/data-analysis/energy-commodities/crude-oil-petroleum-products/statistics/canadian-crude-oil-exports-rail-monthly-data.html",
                "_blank" // <- This is what makes it open in a new window.
              );
            };
          },
        },
      },

      credits: {
        //enabled:false //gets rid of the "Highcharts logo in the bottom right"
        text: "Source: CER Crude by Rail Exports & Net Energy Group",
      },

      legend: {
        enabled: true,
      },

      title: { text: null },

      tooltip: {
        shared: true,
      },

      series: seriesData,

      xAxis: {
        type: "datetime",
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

  const chartRail = createRailChart(seriesData);

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
