import {
  cerPalette,
  conversions,
  tooltipPoint,
  setTitle,
} from "../../modules/util.js";
import { productionChart, errorChart } from "../../modules/charts.js";
import crudeProdData from "./Crude_Oil_Production.json";
import Series from "highseries";

const createChart = (lang) => {
  const crudeProdColors = {
    ["Conventional Light"]: cerPalette["Sun"],
    ["Conventional Heavy"]: cerPalette["Night Sky"],
    ["C5+"]: cerPalette["Ocean"],
    ["Field Condensate"]: cerPalette["Forest"],
    ["Mined Bitumen"]: cerPalette["Cool Grey"],
    ["In Situ Bitumen"]: cerPalette["Dim Grey"],
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
    setTitle(figure_title, "5", crudeProdFilters.Region, lang.title);

    let series = new Series({
      data: crudeProdData,
      colors: crudeProdColors,
      filters: crudeProdFilters,
      xCol: "Year",
      yCols: crudeProdColumns,
    });
    series.transform = { decimals: roundValues(crudeProdFilters) };

    var params = {
      div: "container_crude_production",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: lang.source,
      units: units,
      series: series.hcSeries,
    };

    var chartCrude = productionChart(params);
    var selectRegionCrudeProd = document.getElementById(
      "select_region_crude_prod"
    );
    selectRegionCrudeProd.addEventListener(
      "change",
      (selectRegionCrudeProd) => {
        crudeProdFilters.Region = selectRegionCrudeProd.target.value;
        setTitle(figure_title, "5", crudeProdFilters.Region, lang.title);
        series.update({
          data: crudeProdData,
          filters: crudeProdFilters,
          transform: { decimals: roundValues(crudeProdFilters) },
        });
        params.series = series.hcSeries;
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
      if (units.unitsCurrent !== units.unitsBase) {
        series.update({
          data: crudeProdData,
          transform: {
            conv: [units.conversion, units.type],
            decimals: roundValues(crudeProdFilters),
          },
        });
      } else {
        series.update({
          data: crudeProdData,
          transform: {
            conv: undefined,
            decimals: roundValues(crudeProdFilters),
          },
        });
      }
      chartCrude.update({
        series: series.hcSeries,
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
    return mainCrudeProduction();
  } catch (err) {
    errorChart("container_crude_production");
    return;
  }
};

export function kevinCrudeProduction(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
