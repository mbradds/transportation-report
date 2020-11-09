import {
  cerPalette,
  fillDropUpdate,
  fillDropUpdateWet,
  prepareSeriesNonTidy,
  getUnique,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import { productionChart } from "../../modules/charts.js";
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

  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");

  const crudeProdColumns = [
    "Conventional Light",
    "Conventional Heavy",
    "C5+",
    "Field Condensate",
    "Mined Bitumen",
    "In Situ Bitumen",
  ];

  // fillDropUpdate(
  //   "select_region_crude_prod",
  //   getUnique(crudeProdData, "Region"),
  //   false,
  //   "Canada"
  // );

  fillDropUpdateWet(
    "select_region_crude_prod",
    getUnique(crudeProdData, "Region"),
    false,
    "Canada"
  );

  const roundValues = (filter) => {
    if (["Canada", "Alberta", "British Columbia"].includes(filter.Region)) {
      return 2;
    } else {
      return 3;
    }
  };

  var seriesData = prepareSeriesNonTidy(
    crudeProdData,
    crudeProdFilters,
    units,
    crudeProdColumns,
    "Year",
    crudeProdColors,
    roundValues(crudeProdFilters)
  );

  const mainCrudeProduction = () => {
    var figure_title = document.getElementById("crude_prod_title");
    setTitle(figure_title, crudeProdFilters);

    var params = {
      div: "container_crude_production",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: "Source: Energy Futures",
      units: units,
      series: seriesData,
    };

    var chartCrude = productionChart(params);

    var selectRegionCrudeProd = document.getElementById(
      "select_region_crude_prod"
    );
    selectRegionCrudeProd.addEventListener(
      "change",
      (selectRegionCrudeProd) => {
        crudeProdFilters.Region = selectRegionCrudeProd.target.value;
        setTitle(figure_title, crudeProdFilters);
        var seriesData = prepareSeriesNonTidy(
          crudeProdData,
          crudeProdFilters,
          units,
          crudeProdColumns,
          "Year",
          crudeProdColors,
          roundValues(crudeProdFilters)
        );
        params.series = seriesData;
        chartCrude = productionChart(params);
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
        crudeProdColors,
        roundValues(crudeProdFilters)
      );
      chartCrude.update({
        series: seriesData,
        yAxis: {
          title: { text: units.unitsCurrent },
        },
        tooltip: {
          pointFormat: tooltipPoint(units.unitsCurrent),
        },
      });
    });
  };
  mainCrudeProduction();
};
