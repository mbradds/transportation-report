import { cerPalette, fillDrop, prepareSeriesTidy } from "../../modules/util.js";

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

  var crudeExportFilters = { Unit: "bbl/d" };

  fillDrop("Unit", "select_units_crude_exports", "bbl/d", crudeExportsData);
  var seriesData = prepareSeriesTidy(
    crudeExportsData,
    crudeExportFilters,
    "PADD",
    "Year",
    "Value",
    crudeExportColors
  );

  const createCrudeExportsChart = (seriesData) => {
    var chartCrudeExports = new Highcharts.chart("container_crude_exports", {
      chart: {
        type: "column", //line,bar,scatter,area,areaspline
        zoomType: "x", //allows the user to focus in on the x or y (x,y,xy)
        borderColor: "black",
        borderWidth: 1,
        animation: true,
        events: {
          load: function () {
            this.credits.element.onclick = function () {
              window.open(
                "https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english",
                "_blank" // <- This is what makes it open in a new window.
              );
            };
          },
        },
      },

      title: {
        text: null,
      },

      credits: {
        text: "Source: CER Commodity Tracking System",
      },

      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false,
          },
        },
      },

      tooltip: {
        animation: true,
        //shared: true,
      },

      yAxis: {
        title: { text: "bbl/d" },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: "bold",
            color: (Highcharts.theme && Highcharts.theme.textColor) || "gray",
          },
        },
      },

      lang: {
        noData: "No Exports",
      },

      noData: {
        style: {
          fontWeight: "bold",
          fontSize: "15px",
          color: "#303030",
        },
      },
      series: seriesData,
    });

    return chartCrudeExports;
  };

  var chartCrudeExports = createCrudeExportsChart(seriesData);

  /**
   * @description Method description
   */
  var selectUnitsCrudeExports = document.getElementById(
    "select_units_crude_exports"
  );
  selectUnitsCrudeExports.addEventListener(
    "change",
    (selectUnitsCrudeExports) => {
      var units = selectUnitsCrudeExports.target.value;
      crudeExportFilters["Unit"] = units;
      var seriesData = prepareSeriesTidy(
        crudeExportsData,
        crudeExportFilters,
        "PADD",
        "Year",
        "Value",
        crudeExportColors
      );

      chartCrudeExports.update({
        series: seriesData,
        yAxis: {
          title: { text: units },
        },
      });
    }
  );
};
