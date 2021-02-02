import {
  cerPalette,
  creditsClick,
  mouseOverFunction,
  mouseOutFunction,
  conversions,
  setTitle,
  bands,
} from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import gas2019Data from "./gas_2019.json";
import Series from "highseries";

const createChart = (lang) => {
  const gas2019Colors = {
    Throughput: cerPalette["Sun"],
    Capacity: cerPalette["Night Sky"],
  };

  var units = conversions("Bcf/d to Million m3/d", "Bcf/d", "Bcf/d");
  var pointsFilters = { Year: "2019" };

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

  const createGas2019Map = () => {
    return Highcharts.mapChart("container_gas_2019_map", {
      chart: {
        type: "map",
        map: "countries/ca/ca-all",
      },
      credits: {
        text: "",
      },

      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          states: {
            inactive: {
              opacity: 1,
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
                mouseOverFunction(
                  this.series.chart.series,
                  currentSelection,
                  cerPalette["Sun"]
                );
              },
              mouseOut: function () {
                mouseOutFunction(
                  this.series.chart.series,
                  cerPalette["Night Sky"]
                );
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
        events: {
          load: function () {
            creditsClick(
              this,
              "https://open.canada.ca/data/en/dataset/dc343c43-a592-4a27-8ee7-c77df56afb34"
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
        text: lang.source,
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
        formatter: function () {
          var pipelineName = this.points[0].key;
          var toolText = `<b> ${pipelineName} (${pointsFilters.Year.trim()}) </b><table>`;
          var cap = this.points[0].y;
          var through = this.points.slice(-1)[0].y;
          var utilization = ((through / cap) * 100).toFixed(0);
          toolText += `<tr><td>${lang.tooltipUtilization}</td><td style="padding:0">:<b> ${utilization} %</b></td></tr>`;
          this.points.map((p) => {
            toolText += `<tr><td><span style="color: ${
              p.series.color
            }">&#9679</span> ${
              p.series.name
            }:</td><td style="padding:0"><b>${Math.abs(p.y)} ${
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
            bands(6.5, 7.5, lang.imports, 15),
            bands(8.5, 9.5, lang.imports, 15),
          ],
        },
        {
          type: "category",
          linkedTo: 0,
          opposite: true,
          title: { text: lang.xAxis },
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

  try {
    let series = new Series({
      data: gas2019Data,
      xCol: "Series Name",
      yCols: ["Capacity", "Throughput"],
      colors: gas2019Colors,
      filters: pointsFilters,
      xName: "name",
    });
    let seriesData = columnPlacement(series.hcSeries);
    var figure_title = document.getElementById("gas_points_title");
    setTitle(figure_title, "20", pointsFilters.Year, lang.title);
    var gasPointsMap = createGas2019Map();
    var chartGas2019 = createGas2019Chart(seriesData, units);
    var selectUnitsGas2019 = document.getElementById("select_units_gas_2019");
    selectUnitsGas2019.addEventListener("change", (selectUnitsGas2019) => {
      units.unitsCurrent = selectUnitsGas2019.target.value;
      if (units.unitsCurrent !== units.unitsBase) {
        series.update({
          data: gas2019Data,
          transform: {
            conv: [units.conversion, units.type],
            decimals: 2,
          },
        });
      } else {
        series.update({
          data: gas2019Data,
          transform: {
            conv: undefined,
            decimals: undefined,
          },
        });
      }
      chartGas2019.update({
        series: columnPlacement(series.hcSeries),
        yAxis: {
          title: { text: units.unitsCurrent },
        },
      });
    });

    $("#gas-points-years button").on("click", function () {
      $(".btn-gas-points > .btn").removeClass("active");
      $(this).addClass("active");
      var thisBtn = $(this);
      var btnText = thisBtn.text();
      var btnValue = thisBtn.val();
      $("#selectedVal").text(btnValue);
      pointsFilters.Year = btnText;
      setTitle(figure_title, "20", pointsFilters.Year, lang.title);
      series.update({ data: gas2019Data, filters: pointsFilters });
      chartGas2019.update({
        series: columnPlacement(series.hcSeries),
      });
    });
    return chartGas2019;
  } catch (err) {
    errorChart("container_gas_2019_map");
    errorChart("container_gas_2019");
    return;
  }
};

export function sara2019(lang) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang)), 0);
  });
}
