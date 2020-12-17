import {
  cerPalette,
  prepareSeriesNonTidy,
  conversions,
  tooltipPoint,
  setTitle,
} from "../../modules/util.js";
import { productionChart, errorChart } from "../../modules/charts.js";
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

  const roundValues = (filter) => {
    if (["Canada", "Alberta"].includes(filter.Region)) {
      return 2;
    } else {
      return 3;
    }
  };

  const mainCrudeProduction = () => {
    const ticks = (crudeProdFilters, units) => {
      if (["Canada", "Alberta"].includes(crudeProdFilters.Region)) {
        if (units.unitsCurrent == "MMb/d") {
          var tickInterval = 1;
        } else {
          var tickInterval = 100;
        }
      } else if (
        ["Ontario", "Northwest Territories", "Nova Scotia"].includes(
          crudeProdFilters.Region
        )
      ) {
        if (units.unitsCurrent == "MMb/d") {
          var tickInterval = 0.001;
        } else {
          var tickInterval = 0.5;
        }
      } else {
        if (units.unitsCurrent == "MMb/d") {
          var tickInterval = 0.05;
        } else {
          var tickInterval = 10;
        }
      }
      return tickInterval;
    };

    var figure_title = document.getElementById("crude_prod_title");
    setTitle(
      figure_title,
      "1",
      crudeProdFilters.Region,
      "Crude Oil Production"
    );

    var seriesData = prepareSeriesNonTidy(
      crudeProdData,
      crudeProdFilters,
      units,
      crudeProdColumns,
      "Year",
      crudeProdColors,
      roundValues(crudeProdFilters)
    );

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
        setTitle(
          figure_title,
          "1",
          crudeProdFilters.Region,
          "Crude Oil Production"
        );
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
        chartCrude.update({
          yAxis: {
            tickInterval: ticks(crudeProdFilters, units),
            labels: {
              formatter: function () {
                return this.value;
              },
            },
          },
        });
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
          tickInterval: ticks(crudeProdFilters, units),
          labels: {
            formatter: function () {
              return this.value;
            },
          },
        },
        tooltip: {
          pointFormat: tooltipPoint(units.unitsCurrent),
        },
      });
    });
    return chartCrude;
  };

  try {
    const chart = mainCrudeProduction();
  } catch (err) {
    errorChart("container_crude_production");
  }
};
