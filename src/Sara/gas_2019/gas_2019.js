import { cerPalette, prepareSeriesNonTidyUnits } from "../../modules/util.js";
import gas2019Data from "./gas_2019.json";

export const sara2019 = () => {
  const gas2019Colors = {
    Throughput: cerPalette["Ocean"],
    "Spare Capacity": cerPalette["Cool Grey"],
  };

  const seriesData = prepareSeriesNonTidyUnits(
    gas2019Data,
    false,
    "BCf/d",
    "1000 m3/d",
    0.0000353,
    "*",
    ["Spare Capacity", "Throughput"],
    "Series Name",
    gas2019Colors,
    "name"
  );

  const createGas2019Chart = (seriesData) => {
    const chartGas2019 = new Highcharts.chart("container_gas_2019", {
      chart: {
        type: "column",
        borderColor: "black",
        borderWidth: 1,
        animation: true,
        events: {
          load: function () {
            this.credits.element.onclick = function () {
              window.open(
                "https://apps.cer-rec.gc.ca/CommodityStatistics/Statistics.aspx?language=english",
                "_blank" // <- This is what makes it open in a new window.
              );
            };
          },
        },
      },

      title: {
        text: null,
      },

      credits: {
        text: "Source: CER Commodity Tracking System",
      },

      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: false,
          },
        },
      },

      tooltip: {
        animation: true,
      },

      yAxis: {
        title: { text: "BCF/d" },
      },

      xAxis: {
        type: "category",
      },

      series: seriesData,
    });

    return chartGas2019;
  };

  const chartGas2019 = createGas2019Chart(seriesData);
  var selectUnitsGas2019 = document.getElementById("select_units_gas_2019");
  selectUnitsGas2019.addEventListener("change", (selectUnitsGas2019) => {
    var units = selectUnitsGas2019.target.value;
    const seriesData = prepareSeriesNonTidyUnits(
      gas2019Data,
      false,
      units,
      "1000 m3/d",
      0.0000353,
      "*",
      ["Spare Capacity", "Throughput"],
      "Series Name",
      gas2019Colors,
      "name"
    );
    chartGas2019.update({
      series: seriesData,
      yAxis: {
        title: { text: units },
      },
    });
  });
};
