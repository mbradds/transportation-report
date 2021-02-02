import { cerPalette, conversions, tooltipPoint } from "../../modules/util.js";
import { lineAndStackedArea, errorChart } from "../../modules/charts.js";
import Series from "highseries";
import gasData from "./gas_traffic.json";

const createChart = (lang) => {
  const gasColors = {
    "Alliance Pipeline - Border": cerPalette["Night Sky"],
    "Foothills System - Kingsgate": cerPalette["Sun"],
    "Foothills System - Monchy": cerPalette["Flame"],
    "TC Canadian Mainline - Prairies (Empress)": cerPalette["Forest"],
    "Westcoast Energy Inc. - BC Pipeline - Huntingdon/Lower Mainland":
      cerPalette["Ocean"],
    "Combined Pipeline Capacity": cerPalette["Cool Grey"],
  };

  const gasChartTypes = {
    "Alliance Pipeline - Border": "area",
    "Foothills System - Kingsgate": "area",
    "Foothills System - Monchy": "area",
    "TC Canadian Mainline - Prairies (Empress)": "area",
    "Westcoast Energy Inc. - BC Pipeline - Huntingdon/Lower Mainland": "area",
    "Combined Pipeline Capacity": "line",
  };

  var units = conversions("Bcf/d to Million m3/d", "Bcf/d", "Bcf/d");
  const columns = Object.keys(gasChartTypes);

  const mainGasTraffic = () => {
    let series = new Series({
      data: gasData,
      xCol: "Date",
      yCols: columns,
      colors: gasColors,
      seriesTypes: gasChartTypes,
    });
    var params = {
      div: "container_gas_traffic",
      sourceLink:
        "https://open.canada.ca/data/en/dataset/dc343c43-a592-4a27-8ee7-c77df56afb34",
      sourceText: lang.source,
      units: units,
      series: series.hcSeries,
      xAxisType: "datetime",
      crosshair: true,
    };
    var chartGasTraffic = lineAndStackedArea(params);

    var selectUnitsGasTraffic = document.getElementById(
      "select_units_gas_traffic"
    );
    selectUnitsGasTraffic.addEventListener(
      "change",
      (selectUnitsGasTraffic) => {
        units.unitsCurrent = selectUnitsGasTraffic.target.value;
        if (units.unitsCurrent !== units.unitsBase) {
          series.update({
            data: gasData,
            transform: {
              conv: [units.conversion, units.type],
              decimals: 1,
            },
          });
        } else {
          series.update({
            data: gasData,
            transform: {
              conv: undefined,
              decimals: undefined,
            },
          });
        }
        chartGasTraffic.update({
          series: series.hcSeries,
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
    return mainGasTraffic();
  } catch (err) {
    return errorChart("container_gas_traffic");
  }
};

export function saraGasTraffic(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
