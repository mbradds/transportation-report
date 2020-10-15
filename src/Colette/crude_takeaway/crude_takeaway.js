import { cerPalette, prepareSeriesNonTidyUnits,creditsClick } from "../../modules/util.js";

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

  const seriesData = crudeTakeawayChartTypes(
    prepareSeriesNonTidyUnits(
      crudeTakeawayData,
      false,
      "MMb/d",
      "MMb/d",
      0.0062898,
      "/",
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

  const createChartCrudeTakeaway = (seriesData) => {
    var chart = new Highcharts.chart("container_crude_takeaway", {
      chart: {
        zoomType: "x", //allows the user to focus in on the x or y (x,y,xy)
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(this,"https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html")
          },
        },
      },

      title: {
        text: null,
      },

      credits: {
        text: "Source: Energy Futures",
      },

      tooltip: {
        shared: true
      },

      plotOptions: {
        area: {
          stacking: "normal",
          marker: false,
        },
      },

      xAxis: {
        crosshair: true,
      },

      yAxis: {
        title: { text: "MMb/d" },
        stackLabels: {
          enabled: false,
        },
      },

      series: seriesData,
    });

    return chart;
  };

  const crudeTakeawayChart = createChartCrudeTakeaway(seriesData);

  var selectUnitsCrudeTakeaway = document.getElementById(
    "select_units_crude_takeaway"
  );
  selectUnitsCrudeTakeaway.addEventListener(
    "change",
    (selectUnitsCrudeTakeaway) => {
      var units = selectUnitsCrudeTakeaway.target.value;
      var seriesData = crudeTakeawayChartTypes(
        prepareSeriesNonTidyUnits(
          crudeTakeawayData,
          false,
          units,
          "MMb/d",
          0.0062898,
          "/",
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
          title: { text: units },
        },
      });
    }
  );
};
