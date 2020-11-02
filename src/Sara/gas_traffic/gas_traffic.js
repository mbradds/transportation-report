import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
  conversions,
} from "../../modules/util.js";

import gasData from "./gas_traffic.json";

export const saraGasTraffic = () => {
  const gasTrafficChartTypes = (series) => {
    series.map((data, seriesNum) => {
      if (data.name == "Capacity") {
        data.type = "line";
      } else {
        data.type = "area";
      }
    });

    return series;
  };

  const gasColors = {
    "Alliance Pipeline - Border": cerPalette["Night Sky"],
    "Foothills System - Kingsgate": cerPalette["Sun"],
    "Foothills System - Monchy": cerPalette["Flame"],
    "TransCanada Mainline - Northern Ontario Line": cerPalette["Forest"],
    Capacity: cerPalette["Cool Grey"],
  };

  var units = conversions("Million m3/d to Bcf/d", "Bcf/d", "Million m3/d");

  const columns = [
    "Alliance Pipeline - Border",
    "Foothills System - Kingsgate",
    "Foothills System - Monchy",
    "TransCanada Mainline - Northern Ontario Line",
    "Capacity",
  ];

  const seriesData = gasTrafficChartTypes(
    prepareSeriesNonTidy(gasData, false, units, columns, "Date", gasColors)
  );

  const createChartGasTraffic = (seriesData, units) => {
    return new Highcharts.chart("container_gas_traffic", {
      chart: {
        zoomType: "x",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(
              this,
              "https://open.canada.ca/data/en/dataset/dc343c43-a592-4a27-8ee7-c77df56afb34"
            );
          },
        },
      },

      credits: {
        text: "Source: Open Government Throughput and Capacity Data",
      },

      tooltip: {
        shared: true,
      },

      xAxis: {
        type: "datetime",
        crosshair: true,
      },

      yAxis: {
        title: { text: units.unitsCurrent },
      },

      series: seriesData,
    });
  };
  const mainGasTraffic = () => {
    var chartGasTraffic = createChartGasTraffic(seriesData, units);
    var selectUnitsGasTraffic = document.getElementById(
      "select_units_gas_traffic"
    );
    selectUnitsGasTraffic.addEventListener(
      "change",
      (selectUnitsGasTraffic) => {
        units.unitsCurrent = selectUnitsGasTraffic.target.value;
        const seriesData = gasTrafficChartTypes(
          prepareSeriesNonTidy(
            gasData,
            false,
            units,
            columns,
            "Date",
            gasColors
          )
        );

        chartGasTraffic.update({
          series: seriesData,
          yAxis: {
            title: { text: units.unitsCurrent },
          },
        });
      }
    );
  };
  mainGasTraffic();
};
