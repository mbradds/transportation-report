import {
  cerPalette,
  prepareSeriesTidy,
  conversions,
  tooltipPoint,
  creditsClick,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
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
    "U.S. crude oil imports from Canada": cerPalette["Sun"],
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
      },

      annotations: [
        {
          labels: [
            {
              point: { x: 840, y: 30 },
              style: {
                fontWeight: "bold",
                color:
                  (Highcharts.theme && Highcharts.theme.textColor) || "grey",
              },
              shape: "rect",
              backgroundColor: "white",
              borderColor: cerPalette["Sun"],
              text: "% - Canada's share of U.S. crude oil imports",
            },
          ],
        },
      ],

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
      sourceText: "Source: CER Commodity Tracking System & EIA",
      units: units,
      series: seriesData,
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
  try {
    mainUsImports();
  } catch (err) {
    errorChart("container_crude_imports");
  }
};
