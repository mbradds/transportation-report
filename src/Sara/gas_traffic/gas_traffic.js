import { cerPalette, conversions, tooltipPoint } from "../../modules/util.js";
import { lineAndStackedArea, errorChart } from "../../modules/charts.js";
import Series from "../../../../highseries/dist/index.js";
import gasData from "./gas_traffic.json";

const createChart = () => {
  const gasColors = {
    "Alliance Pipeline - Border": cerPalette["Night Sky"],
    "Foothills System - Kingsgate": cerPalette["Sun"],
    "Foothills System - Monchy": cerPalette["Flame"],
    "TC Canadian Mainline - Prairies (Empress)": cerPalette["Forest"],
    Capacity: cerPalette["Cool Grey"],
  };

  const gasChartTypes = {
    "Alliance Pipeline - Border": "area",
    "Foothills System - Kingsgate": "area",
    "Foothills System - Monchy": "area",
    "TC Canadian Mainline - Prairies (Empress)": "area",
    Capacity: "line",
  };

  var units = conversions("Million m3/d to Bcf/d", "Bcf/d", "Million m3/d");

  const columns = [
    "Alliance Pipeline - Border",
    "Foothills System - Kingsgate",
    "Foothills System - Monchy",
    "TC Canadian Mainline - Prairies (Empress)",
    "Capacity",
  ];

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
      sourceText: "Source: Open Government Throughput and Capacity Data",
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
    mainGasTraffic();
  } catch (err) {
    errorChart("container_gas_traffic");
  }
};

export function saraGasTraffic() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart()), 0);
  });
}
