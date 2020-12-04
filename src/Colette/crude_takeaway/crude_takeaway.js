import {
  cerPalette,
  prepareSeriesNonTidy,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import { lineAndStackedArea, errorChart } from "../../modules/charts.js";
import crudeTakeawayData from "./figures.json";

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
    "Milk River Pipeline": cerPalette["Flame"],
    "Aurora Pipeline": cerPalette["Dim Grey"],
    "Trans Mountain Pipeline": cerPalette["Night Sky"],
    "Enbridge Canadian Mainline": cerPalette["Sun"],
    "Keystone Pipeline": cerPalette["Forest"],
    Rail: cerPalette["Ocean"],
  };

  var units = conversions("MMb/d to Mm3/d", "MMb/d", "MMb/d");

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

  const createTakeawaySeries = (
    crudeTakeawayData,
    units,
    crudeTakeawayColors
  ) => {
    return crudeTakeawayChartTypes(
      prepareSeriesNonTidy(
        crudeTakeawayData,
        false,
        units,
        columns,
        "Year",
        crudeTakeawayColors
      )
    );
  };

  const mainCrudeTakeaway = () => {
    var params = {
      div: "container_crude_takeaway",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: "Source: Energy Futures",
      units: units,
      series: createTakeawaySeries(
        crudeTakeawayData,
        units,
        crudeTakeawayColors
      ),
      xAxisType: "linear",
      crosshair: true,
    };
    var crudeTakeawayChart = lineAndStackedArea(params);
    crudeTakeawayChart.update({
      xAxis: {
        plotLines: [
          {
            color: "black",
            dashStyle: "longDash",
            value: 2019,
            width: 3,
            zIndex: 5,
            label: {
              text: "Estimated <br> value",
              rotation: 0,
              style: {
                fontWeight: "bold",
                color: cerPalette["Cool Grey"],
              },
            },
          },
        ],
      },
    });
    var selectUnitsCrudeTakeaway = document.getElementById(
      "select_units_crude_takeaway"
    );
    selectUnitsCrudeTakeaway.addEventListener(
      "change",
      (selectUnitsCrudeTakeaway) => {
        units.unitsCurrent = selectUnitsCrudeTakeaway.target.value;
        crudeTakeawayChart.update({
          series: createTakeawaySeries(
            crudeTakeawayData,
            units,
            crudeTakeawayColors
          ),
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
    mainCrudeTakeaway();
  } catch (err) {
    errorChart("container_crude_takeaway");
  }
};
