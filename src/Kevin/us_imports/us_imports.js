import {
  cerPalette,
  conversions,
  tooltipPoint,
  creditsClick,
  annotation,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import crudeImportsData from "./UScrudeoilimports.json";
import Series from "highseries";

const createChart = (lang) => {
  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");

  const crudeImportColors = {
    "U.S. crude oil imports from ROW": cerPalette["Night Sky"],
    "U.S. crude oil exports": cerPalette["Ocean"],
    "U.S. crude oil imports from Canada": cerPalette["Sun"],
  };
  const seriesTypes = {
    "U.S. crude oil imports from ROW": "column",
    "U.S. crude oil exports": "line",
    "U.S. crude oil imports from Canada": "column",
  };

  let series = new Series({
    data: crudeImportsData,
    colors: crudeImportColors,
    xCol: "Year",
    yCols: "Attribute",
    valuesCol: "Value",
  });
  series.seriesTypes = seriesTypes;

  const createUSImports = (params) => {
    return new Highcharts.chart(params.div, {
      chart: {
        zoomType: "x",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(this, params.sourceLink);
          },
        },
      },

      credits: {
        text: params.sourceText,
      },

      tooltip: {
        shared: true,
        pointFormat: tooltipPoint(params.units.unitsCurrent),
      },

      xAxis: {
        type: params.xAxisType,
        crosshair: params.crosshair,
        categories: true,
      },

      annotations: [annotation(840, 30, cerPalette["Sun"], lang.annotation)],

      yAxis: {
        title: { text: params.units.unitsCurrent },
        stackLabels: {
          enabled: true,
          formatter: function () {
            var usROW = this.points[0][0];
            var usTotal = this.points[0].slice(-1)[0];
            var usCAN = usTotal - usROW;
            return ((usCAN / usTotal) * 100).toFixed(0) + "%";
          },
        },
      },

      series: params.series,
    });
  };

  const mainUsImports = () => {
    var params = {
      div: "container_crude_imports",
      sourceLink:
        "https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english",
      sourceText: lang.source,
      units: units,
      series: series.hcSeries,
      xAxisType: "linear",
      crosshair: false,
    };
    var chartCrudeImports = createUSImports(params);
    var selectUnitsCrudeImports = document.getElementById(
      "select_units_crude_imports"
    );
    selectUnitsCrudeImports.addEventListener(
      "change",
      (selectUnitsCrudeImports) => {
        units.unitsCurrent = selectUnitsCrudeImports.target.value;
        if (units.unitsCurrent !== units.unitsBase) {
          series.update({
            data: crudeImportsData,
            transform: {
              conv: [units.conversion, units.type],
              decimals: 1,
            },
          });
        } else {
          series.update({
            data: crudeImportsData,
            transform: {
              conv: undefined,
              decimals: undefined,
            },
          });
        }
        chartCrudeImports.update({
          series: series.hcSeries,
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
  try {
    return mainUsImports();
  } catch (err) {
    errorChart("container_crude_imports");
    return;
  }
};

export function kevinUsImports(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
