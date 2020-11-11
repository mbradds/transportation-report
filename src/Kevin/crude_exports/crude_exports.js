import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
  conversions,
  mouseOverFunction,
  mouseOutFunction,
  tooltipPoint,
} from "../../modules/util.js";

import crudeExportsData from "./crude-oil-exports-by-destination-annual.json";

export const kevinCrudeExports = () => {
  const crudeExportColors = {
    "PADD I": cerPalette["Sun"],
    "PADD II": cerPalette["Night Sky"],
    "PADD III": cerPalette["Ocean"],
    "PADD IV": cerPalette["Forest"],
    "PADD V": cerPalette["Cool Grey"],
    Other: cerPalette["Flame"],
  };

  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");

  var seriesData = prepareSeriesTidy(
    crudeExportsData,
    false,
    units,
    "PADD",
    "Year",
    "Value",
    crudeExportColors
  );

  const createPaddMap = () => {
    return (paddMap = new Highcharts.mapChart("container_padd_map", {
      chart: {
        type: "map",
        map: "countries/us/custom/us-all-mainland",
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

      legend: {
        enabled: false,
      },

      tooltip: {
        formatter: function () {
          return this.series.name;
        },
      },

      plotOptions: {
        map: {
          allAreas: false,
        },
        series: {
          states: {
            inactive: {
              opacity: 0.5,
            },
            hover: {
              brightness: 0,
            },
          },
          events: {
            mouseOver: function () {
              var currentSelection = this.name;
              mouseOverFunction(this.chart.series, currentSelection);
              mouseOverFunction(chartCrudeExports.series, currentSelection);
            },
            mouseOut: function () {
              mouseOutFunction(this.chart.series);
              mouseOutFunction(chartCrudeExports.series);
            },
          },
        },
      },

      series: [
        {
          name: "PADD I",
          data: [
            ["us-me", 1],
            ["us-vt", 1],
            ["us-nh", 1],
            ["us-ma", 1],
            ["us-ct", 1],
            ["us-ri", 1],
            ["us-ny", 1],
            ["us-pa", 1],
            ["us-nj", 1],
            ["us-de", 1],
            ["us-md", 1],
            ["us-wv", 1],
            ["us-va", 1],
            ["us-nc", 1],
            ["us-sc", 1],
            ["us-ga", 1],
            ["us-fl", 1],
          ],
          color: crudeExportColors["PADD I"],
        },
        {
          name: "PADD II",
          data: [
            ["us-nd", 1],
            ["us-sd", 1],
            ["us-ne", 1],
            ["us-ks", 1],
            ["us-ok", 1],
            ["us-mn", 1],
            ["us-ia", 1],
            ["us-mo", 1],
            ["us-wi", 1],
            ["us-il", 1],
            ["us-mi", 1],
            ["us-in", 1],
            ["us-ky", 1],
            ["us-tn", 1],
            ["us-oh", 1],
          ],
          color: crudeExportColors["PADD II"],
        },
        {
          name: "PADD III",
          data: [
            ["us-tx", 1],
            ["us-la", 1],
            ["us-nm", 1],
            ["us-ms", 1],
            ["us-al", 1],
            ["us-ar", 1],
          ],
          color: crudeExportColors["PADD III"],
        },
        {
          name: "PADD IV",
          data: [
            ["us-mt", 1],
            ["us-id", 1],
            ["us-ut", 1],
            ["us-co", 1],
            ["us-wy", 1],
          ],
          color: crudeExportColors["PADD IV"],
        },
        {
          name: "PADD V",
          data: [
            ["us-wa", 1],
            ["us-or", 1],
            ["us-ca", 1],
            ["us-nv", 1],
            ["us-az", 1],
          ],
          color: crudeExportColors["PADD V"],
        },
      ],
    }));
  };

  const createCrudeExportsChart = (seriesData, units) => {
    return (chartCrudeExports = new Highcharts.chart(
      "container_crude_exports",
      {
        chart: {
          type: "column",
        },

        credits: {
          enabled: false,
        },

        plotOptions: {
          series: {
            events: {
              mouseOver: function () {
                var currentSelection = this.name;
                mouseOverFunction(paddMap.series, currentSelection);
              },
              mouseOut: function () {
                mouseOutFunction(paddMap.series);
              },
            },
          },
        },

        tooltip: {
          pointFormat: tooltipPoint(units.unitsCurrent),
        },

        yAxis: {
          title: { text: units.unitsCurrent },
          stackLabels: {
            enabled: true,
          },
        },

        series: seriesData,
      }
    ));
  };

  var paddMap = createPaddMap();
  var chartCrudeExports = createCrudeExportsChart(seriesData, units);

  var selectUnitsCrudeExports = document.getElementById(
    "select_units_crude_exports"
  );
  selectUnitsCrudeExports.addEventListener(
    "change",
    (selectUnitsCrudeExports) => {
      units.unitsCurrent = selectUnitsCrudeExports.target.value;
      var seriesData = prepareSeriesTidy(
        crudeExportsData,
        false,
        units,
        "PADD",
        "Year",
        "Value",
        crudeExportColors
      );

      chartCrudeExports.update({
        series: seriesData,
        yAxis: {
          title: { text: units.unitsCurrent },
        },
        tooltip: {
          pointFormat: tooltipPoint(units.unitsCurrent),
        },
      });
    }
  );
};
