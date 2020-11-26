import {
  cerPalette,
  prepareSeriesTidy,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import {lineAndStackedArea} from "../../modules/charts.js"
import crudeImportsData from "./UScrudeoilimports.json";

export const kevinUsImports = () => {
  const crudeImportsChartTypes = (series) => {
    series.map((data) => {
      if (data.name == "U.S. crude oil exports") {
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
    "U.S. crude oil imports from ROW": cerPalette["Night Sky"],
    "U.S. crude oil exports": cerPalette["Ocean"],
    "U.S. Crude Oil imports from Canada": cerPalette["Sun"],
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

  const mainUsImports = () => {
    var params = {
      div:"container_crude_imports",
      sourceLink:"https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english",
      sourceText: "Source: CER Commodity Tracking System & EIA",
      units: units,
      series: seriesData,
      xAxisType: "linear",
      crosshair: false
    }
    var chartCrudeImports = lineAndStackedArea(params)
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
  mainUsImports();
};
