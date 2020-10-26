import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
  conversions,
} from "../../modules/util.js";

import crudeTakeawayData from "./fgrs-eng.json";

export const coletteCrudeTakeaway = () => {
  const crudeTakeawayChartTypes = (series) => {
    series.map((data, seriesNum) => {
      if (data.name == "Total Supply Available for Export") {
        data.type = "line";
        data.zIndex = 1;
      } else {
        data.type = "area";
        data.zIndex = 0;
      }
    });
    return series;
  };

  const crudeTakeawayColors = {
    "Total Supply Available for Export": cerPalette["Cool Grey"],
    Express: cerPalette["Dim Grey"],
    "Milk River": cerPalette["Dim Grey"],
    "Aurora/Rangeland": cerPalette["Dim Grey"],
    TransMountain: cerPalette["Night Sky"],
    "Enbridge Mainline": cerPalette["Sun"],
    Keystone: cerPalette["Forest"],
    "Enbridge Line 3": cerPalette["Night Sky"],
    TMX: cerPalette["Night Sky"],
    "Keystone XL": cerPalette["Forest"],
    "Structural Rail": cerPalette["Flame"],
    "Variable Rail": cerPalette["Ocean"],
  };

  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");

  const seriesData = crudeTakeawayChartTypes(
    prepareSeriesNonTidy(
      crudeTakeawayData,
      false,
      units,
      [
        "Total Supply Available for Export",
        "Express",
        "Milk River",
        "Aurora/Rangeland",
        "TransMountain",
        "Enbridge Mainline",
        "Keystone",
        "Enbridge Line 3",
        "TMX",
        "Keystone XL",
        "Structural Rail",
        "Variable Rail",
      ],
      "Year",
      crudeTakeawayColors
    )
  );

  const createChartCrudeTakeaway = (seriesData,units) => {
    return new Highcharts.chart("container_crude_takeaway", {
      chart: {
        zoomType: "x",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(
              this,
              "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html"
            );
          },
        },
      },

      credits: {
        text: "Source: Energy Futures",
      },

      tooltip: {
        shared: true,
      },

      xAxis: {
        crosshair: true,
      },

      yAxis: {
        title: { text: units.unitsCurrent },
      },

      series: seriesData,
    });
  };

  const mainCrudeTakeaway = () => {
    var crudeTakeawayChart = createChartCrudeTakeaway(seriesData,units);
    var selectUnitsCrudeTakeaway = document.getElementById(
      "select_units_crude_takeaway"
    );
    selectUnitsCrudeTakeaway.addEventListener(
      "change",
      (selectUnitsCrudeTakeaway) => {
        units.unitsCurrent = selectUnitsCrudeTakeaway.target.value;
        var seriesData = crudeTakeawayChartTypes(
          prepareSeriesNonTidy(
            crudeTakeawayData,
            false,
            units,
            [
              "Total Supply Available for Export",
              "Express",
              "Milk River",
              "Aurora/Rangeland",
              "TransMountain",
              "Enbridge Mainline",
              "Keystone",
              "Enbridge Line 3",
              "TMX",
              "Keystone XL",
              "Structural Rail",
              "Variable Rail",
            ],
            "Year",
            crudeTakeawayColors
          )
        );

        crudeTakeawayChart.update({
          series: seriesData,
          yAxis: {
            title: { text: units.unitsCurrent },
          },
        });
      }
    );
  };
  mainCrudeTakeaway()
};
