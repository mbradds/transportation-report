import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
} from "../../modules/util.js";

import crudeImportsData from "./UScrudeoilimports.json";

export const kevinUsImports = () => {
  const crudeImportsChartTypes = (series) => {
    series.map((data, seriesNum) => {
      if (data.name == "U.S crude oil exports") {
        data.type = "line";
        data.zIndex = 1;
      } else {
        data.type = "column";
        data.zIndex = 0;
      }
    });

    return series;
  };

  const crudeImportColors = {
    "ROW imports": cerPalette["Night Sky"],
    "U.S crude oil exports": cerPalette["Ocean"],
    "Canadian imports": cerPalette["Sun"],
  };

  var crudeImportsFilters = { Units: "MMb/d" };
  var seriesData = crudeImportsChartTypes(
    prepareSeriesTidy(
      crudeImportsData,
      crudeImportsFilters,
      false,
      "Attribute",
      "Year",
      "Value",
      crudeImportColors
    )
  );
  const createCrudeImportsChart = (seriesData) => {
    var chartCrudeImports = new Highcharts.chart("container_crude_imports", {
      chart: {
        zoomType: "x", //allows the user to focus in on the x or y (x,y,xy)
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(
              this,
              "https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english"
            );
          },
        },
      },

      title: {
        text: null,
      },

      credits: {
        text: "Source: CER Commodity Tracking System & EIA",
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
        shared: true,
      },

      yAxis: {
        title: { text: "MMb/d" },
      },

      series: seriesData,
    });

    return chartCrudeImports;
  };

  var chartCrudeImports = createCrudeImportsChart(seriesData);

  var selectUnitsCrudeImports = document.getElementById(
    "select_units_crude_imports"
  );
  selectUnitsCrudeImports.addEventListener(
    "change",
    (selectUnitsCrudeImports) => {
      var units = selectUnitsCrudeImports.target.value;
      crudeImportsFilters["Units"] = units;
      var seriesData = crudeImportsChartTypes(
        prepareSeriesTidy(
          crudeImportsData,
          crudeImportsFilters,
          false,
          "Attribute",
          "Year",
          "Value",
          crudeImportColors
        )
      );
      chartCrudeImports.update({
        series: seriesData,
        yAxis: {
          title: { text: units },
        },
      });
    }
  );
};
