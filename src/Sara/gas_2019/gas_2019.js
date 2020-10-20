import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
  conversions,
} from "../../modules/util.js";
import gas2019Data from "./gas_2019.json";

export const sara2019 = () => {
  const gas2019Colors = {
    Throughput: cerPalette["Ocean"],
    "Spare Capacity": cerPalette["Cool Grey"],
  };

  var units = conversions("Bcf/d to Mm3/d", "Bcf/d", "Mm3/d");

  const seriesData = prepareSeriesNonTidy(
    gas2019Data,
    false,
    units,
    ["Spare Capacity", "Throughput"],
    "Series Name",
    gas2019Colors,
    "name"
  );

  const createGas2019Chart = (seriesData) => {
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
        title: { text: "BCF/d" },
      },

      xAxis: {
        type: "category",
      },

      series: seriesData,
    });
  };

  const mainGas2019 = () => {
    var chartGas2019 = createGas2019Chart(seriesData);
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
