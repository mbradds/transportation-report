import {
  cerPalette,
  prepareSeriesNonTidy,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import {lineAndStackedArea} from "../../modules/charts.js"
import crudeTakeawayData from "./fgrs-eng.json";

export const coletteCrudeTakeaway = () => {
  const crudeTakeawayChartTypes = (series) => {
    series.map((data) => {
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
    "Express Pipeline": cerPalette["Aubergine"],
    "Milk River Pipeline": cerPalette["hcRed"],
    "Aurora Pipeline": cerPalette["Dim Grey"],
    "Trans Mountain Pipeline": cerPalette["Night Sky"],
    "Enbridge Mainline": cerPalette["Sun"],
    Keystone: cerPalette["Forest"],
    "Structural Rail": cerPalette["Flame"],
    "Variable Rail": cerPalette["Ocean"],
  };

  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");

  const columns = [
    "Total Supply Available for Export",
    "Enbridge Mainline",
    "Express Pipeline",
    "Milk River Pipeline",
    "Aurora Pipeline",
    "Trans Mountain Pipeline",
    "Keystone",
    "Structural Rail",
    "Variable Rail",
  ];

  const seriesData = crudeTakeawayChartTypes(
    prepareSeriesNonTidy(
      crudeTakeawayData,
      false,
      units,
      columns,
      "Year",
      crudeTakeawayColors
    )
  );

  const mainCrudeTakeaway = () => {
    var params = {
      div:"container_crude_takeaway",
      sourceLink:"https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: "Source: Energy Futures",
      units: units,
      series: seriesData,
      xAxisType: "linear",
      crosshair:true
    }
    var crudeTakeawayChart = lineAndStackedArea(params)
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
            columns,
            "Year",
            crudeTakeawayColors
          )
        );

        crudeTakeawayChart.update({
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
  mainCrudeTakeaway();
};
