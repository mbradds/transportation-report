import {
  cerPalette,
  prepareSeriesTidy,
  creditsClick,
  conversions,
  tooltipPoint,
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

  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");

  const crudeImportColors = {
    "ROW imports": cerPalette["Night Sky"],
    "U.S crude oil exports": cerPalette["Ocean"],
    "Canadian imports": cerPalette["Sun"],
  };

  var seriesData = crudeImportsChartTypes(
    prepareSeriesTidy(
      crudeImportsData,
      false,
      units,
      "Attribute",
      "Year",
      "Value",
      crudeImportColors
    )
  );
  const createCrudeImportsChart = (seriesData, units) => {
    return new Highcharts.chart("container_crude_imports", {
      chart: {
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

      credits: {
        text: "Source: CER Commodity Tracking System & EIA",
      },

      tooltip: {
        shared: true,
        pointFormat: tooltipPoint(units.unitsCurrent),
      },

      yAxis: {
        title: { text: units.unitsCurrent },
      },

      series: seriesData,
    });
  };

  var chartCrudeImports = createCrudeImportsChart(seriesData, units);
  var selectUnitsCrudeImports = document.getElementById(
    "select_units_crude_imports"
  );
  selectUnitsCrudeImports.addEventListener(
    "change",
    (selectUnitsCrudeImports) => {
      units.unitsCurrent = selectUnitsCrudeImports.target.value;
      var seriesData = crudeImportsChartTypes(
        prepareSeriesTidy(
          crudeImportsData,
          false,
          units,
          "Attribute",
          "Year",
          "Value",
          crudeImportColors
        )
      );
      chartCrudeImports.update({
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
