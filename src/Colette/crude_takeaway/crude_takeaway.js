import {
  cerPalette,
  conversions,
  tooltipSorted,
  lines,
} from "../../modules/util.js";
import { lineAndStackedArea, errorChart } from "../../modules/charts.js";
import crudeTakeawayData from "./figures.json";
import Series from "highseries";

const createChart = (lang, langUnits) => {
  const crudeTakeawayColors = {
    "Total Supply Available for Export": cerPalette["Cool Grey"],
    "Express Pipeline": cerPalette["Aubergine"],
    "Milk River Pipeline": cerPalette["Flame"],
    "Aurora Pipeline": cerPalette["Dim Grey"],
    "Trans Mountain Pipeline": cerPalette["Night Sky"],
    "Enbridge Canadian Mainline": cerPalette["Sun"],
    "Keystone Pipeline": cerPalette["Forest"],
    Rail: cerPalette["Ocean"],
  };

  const crudeTakeawayTypes = {
    "Total Supply Available for Export": "line",
    "Express Pipeline": "area",
    "Milk River Pipeline": "area",
    "Aurora Pipeline": "area",
    "Trans Mountain Pipeline": "area",
    "Enbridge Canadian Mainline": "area",
    "Keystone Pipeline": "area",
    Rail: "area",
  };

  const z = {
    "Total Supply Available for Export": 10,
  };

  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");
  units.display = langUnits[units.unitsCurrent];

  const columns = [
    "Total Supply Available for Export",
    "Rail",
    "Enbridge Canadian Mainline",
    "Express Pipeline",
    "Milk River Pipeline",
    "Aurora Pipeline",
    "Trans Mountain Pipeline",
    "Keystone Pipeline",
  ];

  let series = new Series({
    data: crudeTakeawayData,
    xCol: "Year",
    yCols: columns,
    colors: crudeTakeawayColors,
    seriesTypes: crudeTakeawayTypes,
    zIndex: z,
    names: lang.series,
  });

  const mainCrudeTakeaway = () => {
    var params = {
      div: "container_crude_takeaway",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: lang.source,
      units: units,
      series: series.hcSeries,
      xAxisType: "linear",
      crosshair: true,
      endOnTick: true,
    };
    var crudeTakeawayChart = lineAndStackedArea(params);
    crudeTakeawayChart.update({
      tooltip: {
        formatter: function () {
          return tooltipSorted(this.points, this.x, units.display);
        },
      },
      xAxis: {
        plotLines: [lines("black", "longDash", 2019, lang.plotLines, 0)],
      },
    });
    var selectUnitsTake = document.getElementById(
      "select_units_crude_takeaway"
    );
    selectUnitsTake.addEventListener("change", (selectUnitsTake) => {
      units.unitsCurrent = selectUnitsTake.target.value;
      units.display = langUnits[units.unitsCurrent];
      if (units.unitsCurrent !== units.unitsBase) {
        series.update({
          data: crudeTakeawayData,
          transform: {
            conv: [units.conversion, units.type],
            decimals: 1,
          },
        });
      } else {
        series.update({
          data: crudeTakeawayData,
          transform: {
            conv: undefined,
            decimals: undefined,
          },
        });
      }
      crudeTakeawayChart.update({
        series: series.hcSeries,
        yAxis: {
          title: { text: units.display },
        },
      });
    });
  };

  try {
    return mainCrudeTakeaway();
  } catch (err) {
    return errorChart("container_crude_takeaway");
  }
};

export function coletteCrudeTakeaway(lang, langUnits) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang, langUnits)), 0);
  });
}
