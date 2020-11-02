import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
  conversions,
  tooltipPoint,
} from "../../modules/util.js";
import gas2019Data from "./gas_2019.json";

export const sara2019 = () => {
  const gas2019Colors = {
    Throughput: cerPalette["Ocean"],
    "Spare Capacity": cerPalette["Cool Grey"],
  };

  var units = conversions("Million m3/d to Bcf/d", "Bcf/d", "Million m3/d");

  const seriesData = prepareSeriesNonTidy(
    gas2019Data,
    false,
    units,
    ["Spare Capacity", "Throughput"],
    "Series Name",
    gas2019Colors,
    2,
    "name"
  );
  
  const createGas2019Chart = (seriesData,units) => {
    return new Highcharts.chart("container_gas_2019", {
      chart: {
        type: "column",
        borderWidth: 1,
        events: {
          load: function () {
            creditsClick(
              this,
              "https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english"
            );
          },
        },
      },

      credits: {
        text: "Source: CER Commodity Tracking System",
      },

      yAxis: {
        title: { text: units.unitsCurrent},
      },

      tooltip:{
        shared: true,
        pointFormat: tooltipPoint(units.unitsCurrent),
      },

      xAxis: {
        type: "category",
      },

      series: seriesData,
    });
  };

  const mainGas2019 = () => {
    var chartGas2019 = createGas2019Chart(seriesData,units);
    var selectUnitsGas2019 = document.getElementById("select_units_gas_2019");
    selectUnitsGas2019.addEventListener("change", (selectUnitsGas2019) => {
      units.unitsCurrent = selectUnitsGas2019.target.value;
      const seriesData = prepareSeriesNonTidy(
        gas2019Data,
        false,
        units,
        ["Spare Capacity", "Throughput"],
        "Series Name",
        gas2019Colors,
        1,
        "name"
      );
      chartGas2019.update({
        series: seriesData,
        yAxis: {
          title: { text: units.unitsCurrent },
        },
      });
    });
  };
  mainGas2019();
};
