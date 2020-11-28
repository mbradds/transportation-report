import {
  cerPalette,
  prepareSeriesNonTidy,
  creditsClick,
  mouseOverFunction,
  mouseOutFunction,
  conversions,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
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

  const createGas2019Map = () => {
    return Highcharts.mapChart("container_gas_2019_map", {
      chart: {
        type: "map",
        map: "countries/ca/ca-all",
        // events: {
        //   load: function () {
        //     creditsClick(this, "https://www.spglobal.com/platts/en");
        //   },
        // },
      },
      credits: {
        text: "Source: CER",
      },

      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          states: {
            inactive: {
              opacity: 0.5,
            },
            hover: {
              brightness: 0,
            },
          },
          stickyTracking: false,
          marker: {
            radius: 5,
            symbol: "circle",
          },
          point: {
            events: {
              mouseOver: function () {
                var currentSelection = this.series.name;
                //console.log(this)
                //mouseOverFunction(this.series, currentSelection);
                //mouseOverFunction(chartGas2019.series, currentSelection);
              },
              mouseOut: function () {
                //mouseOutFunction(this.series);
                //mouseOutFunction(chartGas2019.series);
              },
            },
          },
        },
      },

      tooltip: {
        formatter: function () {
          return this.series.name;
        },
      },

      series: [
        {
          name: "Basemap",
          borderColor: "#606060",
          nullColor: "rgba(200, 200, 200, 0.2)",
          showInLegend: false,
        },
        {
          type: "mappoint",
          name: "NGTL System - Upstream of James River - intracanada",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 51.9475,
              lon: -114.74,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "TC Canadian Mainline - Prairies - intracanada",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 50.6836,
              lon: -110.087,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "Foothills System - Kingsgate - export",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 49.0015,
              lon: -116.187,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "NGTL System - West Gate - intracanada",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 49.6348,
              lon: -114.588,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "Foothills System - Monchy - export",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 49.0004,
              lon: -107.544,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "Enbridge BC Pipeline - Huntingdon Export - export",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 49.0034,
              lon: -122.22,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "Alliance Pipeline - Border - export",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 49,
              lon: -101.588,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "TC Canadian Mainline - Iroquois - export",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 44.8556,
              lon: -75.2667,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "M&NP Pipeline - St. Stephen - import",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 45.205,
              lon: -67.4545,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
        {
          type: "mappoint",
          name: "TC Canadian Mainline - Niagara - import",
          color: cerPalette["Night Sky"],
          data: [
            {
              lat: 43.1922,
              lon: -79.0693,
            },
          ],
          dataLabels: {
            enabled: false,
          },
        },
      ],
    });
  };

  const createGas2019Chart = (seriesData, units) => {
    return new Highcharts.chart("container_gas_2019", {
      chart: {
        type: "column",
        // borderWidth: 1,
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
        series: {
          point: {
            events: {
              mouseOver: function () {
                var currentSelection = this.name;
                mouseOverFunction(
                  gasPointsMap.series,
                  currentSelection,
                  cerPalette["Sun"]
                );
              },
              mouseOut: function () {
                mouseOutFunction(gasPointsMap.series, cerPalette["Night Sky"]);
              },
            },
          },
        },
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

  var gasPointsMap = createGas2019Map();
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
