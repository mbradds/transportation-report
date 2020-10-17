import {
  cerPalette,
  fillDropUpdate,
  prepareSeriesNonTidy,
  getUnique,
  creditsClick,
  conversions,
} from "../../modules/util.js";

import crudeProdData from "./Crude_Oil_Production.json";

export const kevinCrudeProduction = () => {
  const crudeProdColors = {
    "Conventional Light": cerPalette["Sun"],
    "Conventional Heavy": cerPalette["Night Sky"],
    "C5+": cerPalette["Ocean"],
    "Field Condensate": cerPalette["Forest"],
    "Mined Bitumen": cerPalette["Cool Grey"],
    "In Situ Bitumen": cerPalette["Dim Grey"],
  };
  const setTitle = (figure_title, filters) => {
    figure_title.innerText = `Figure 1: ${filters.Region} Crude Oil Production`;
  };

  var crudeProdFilters = { Region: "Canada" };

  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");

  const crudeProdColumns = [
    "Conventional Light",
    "Conventional Heavy",
    "C5+",
    "Field Condensate",
    "Mined Bitumen",
    "In Situ Bitumen",
  ];

  fillDropUpdate(
    "select_region_crude_prod",
    getUnique(crudeProdData, "Region"),
    false,
    "Canada"
  );

  var seriesData = prepareSeriesNonTidy(
    crudeProdData,
    crudeProdFilters,
    units,
    crudeProdColumns,
    "Year",
    crudeProdColors
  );

  const createCrudeProdChart = (seriesData, units) => {
    const chart = new Highcharts.chart("container_crude_production", {
      chart: {
        type: "column",
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

      yAxis: {
        title: { text: units.unitsCurrent },
        stackLabels: {
          enabled: true,
        },
      },

      series: seriesData,
    });
    return chart;
  };

  const mainCrudeProduction = () => {
    var figure_title = document.getElementById('figure1');
    setTitle(figure_title,crudeProdFilters)

    var chartCrude = createCrudeProdChart(seriesData, units);

    var selectRegionCrudeProd = document.getElementById(
      "select_region_crude_prod"
    );
    selectRegionCrudeProd.addEventListener(
      "change",
      (selectRegionCrudeProd) => {
        crudeProdFilters.Region = selectRegionCrudeProd.target.value;
        setTitle(figure_title,crudeProdFilters)
        var seriesData = prepareSeriesNonTidy(
          crudeProdData,
          crudeProdFilters,
          units,
          crudeProdColumns,
          "Year",
          crudeProdColors
        );
        chartCrude = createCrudeProdChart(seriesData, units);
      }
    );

    //update existing chart when the units change
    var selectUnitsCrudeProd = document.getElementById(
      "select_units_crude_prod"
    );
    selectUnitsCrudeProd.addEventListener("change", (selectUnitsCrudeProd) => {
      units.unitsCurrent = selectUnitsCrudeProd.target.value;
      var seriesData = prepareSeriesNonTidy(
        crudeProdData,
        crudeProdFilters,
        units,
        crudeProdColumns,
        "Year",
        crudeProdColors
      );

      chartCrude.update({
        series: seriesData,
        yAxis: {
          title: { text: units.unitsCurrent },
        },
      });
    });
  };
  mainCrudeProduction()
};
