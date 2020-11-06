import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
  conversions,
} from "../../modules/util.js";
import gas2019Data from "./gas_2019.json";

export const sara2019 = () => {
  const gas2019Colors = {
    Throughput: cerPalette["Sun"],
    Capacity: cerPalette["Night Sky"],
  };

  var units = conversions("Million m3/d to Bcf/d", "Bcf/d", "Million m3/d");

  const columnPlacement = (series) => {
    return series.map((s) => {
      if (s.name == "Capacity") {
        s.pointPadding = 0.3;
        s.pointPlacement = 0;
        s.groupPadding = 0;
      } else {
        s.pointPadding = 0.4;
        s.pointPlacement = 0;
        s.groupPadding = 0;
      }
      return s;
    });
  };

  const seriesData = columnPlacement(
    prepareSeriesNonTidy(
      gas2019Data,
      false,
      units,
      ["Capacity", "Throughput"],
      "Series Name",
      gas2019Colors,
      2,
      "name"
    )
  );

  const createGas2019Chart = (seriesData, units) => {
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

      plotOptions: {
        column: {
          stacking: undefined,
          grouping: false,
          shadow: false,
          borderWidth: 0,
        },
      },

      credits: {
        text: "Source: CER Commodity Tracking System",
      },

      yAxis: {
        gridLineWidth: 0,
        startOnTick: false,
        endOnTick: false,
        title: { text: units.unitsCurrent },
        labels: {
          formatter: function () {
            return Math.abs(this.value);
          },
        },
        plotLines: [
          {
            color: "black",
            value: 0,
            width: 1,
            zIndex: 5,
          },
        ],
      },

      tooltip: {
        shared: true,
        shared: true,
        formatter: function () {
          var pipelineName = this.points[0].key;
          var toolText = `<b> ${pipelineName} </b><table>`;
          this.points.map((p) => {
            toolText += `<tr><td> <span style="color: ${
              p.series.color
            }">&#9679</span> ${
              p.series.name
            }: </td><td style="padding:0"><b>${Math.abs(p.y)} ${
              units.unitsCurrent
            }</b></td></tr>`;
          });
          return toolText + "</table>";
        },
      },

      xAxis: [
        {
          type: "category",
          gridLineWidth: 1,
          crosshair: true,
          labels: {
            useHTML: true,
            formatter: function () {
              var companyName = this.value.split(" - ")[0];
              companyName = companyName.split(" ");
              return companyName.join("<br>");
            },
          },
          plotBands: [
            {
              color: "#D3D3D3",
              from: 7.5,
              to: 9.5,
              zIndex: 3,
              label: {
                text: "Imports",
                align: "center",
              },
            },
          ],
        },
        {
          type: "category",
          linkedTo: 0,
          opposite: true,
          title: { text: "Key Point" },
          labels: {
            autoRotation: 0,
            formatter: function () {
              var pointName = this.chart.xAxis[0].names[this.value]
                .split(" - ")
                .slice(-2)[0];
              if (pointName == "Upstream of James River") {
                return "Upstream<br> of<br> James River";
              } else if (pointName == "Huntingdon Export") {
                return "Huntingdon";
              } else {
                return pointName;
              }
            },
          },
        },
      ],

      series: seriesData,
    });
  };

  const mainGas2019 = () => {
    var chartGas2019 = createGas2019Chart(seriesData, units);
    var selectUnitsGas2019 = document.getElementById("select_units_gas_2019");
    selectUnitsGas2019.addEventListener("change", (selectUnitsGas2019) => {
      units.unitsCurrent = selectUnitsGas2019.target.value;
      const seriesData = prepareSeriesNonTidy(
        gas2019Data,
        false,
        units,
        ["Capacity", "Throughput"],
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
