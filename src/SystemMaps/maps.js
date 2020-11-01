import {
  cerPalette,
} from "../modules/util.js";

export const systemMaps = () => {

  const getData = (Url) => {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", Url, false);
    Httpreq.send(null);
    return Httpreq.responseText;
  };

  const oilFileNames = {
    "AURORA PIPE LINE COMPANY LTD": {
      color: cerPalette["Aubergine"],
      zIndex: 9,
    },
    "ENBRIDGE PIPELINES INC": { color: cerPalette["Sun"], zIndex: 2 },
    "ENBRIDGE PIPELINES (NW) INC": {
      color: cerPalette["Cool Grey"],
      zIndex: 9,
    },
    "ENBRIDGE SOUTHERN LIGHTS GP INC ON BEHALF OF ENBRIDGE SOUTHERN LIGHTS LP": {
      color: cerPalette["Forest"],
      zIndex: 8,
    },
    "EXPRESS PIPELINE LTD": { color: cerPalette["Night Sky"], zIndex: 7 },
    "MONTREAL PIPE LINE LIMITED": { color: cerPalette["hcBlue"], zIndex: 9 },
    "TEML WESTSPUR PIPELINES LIMITED": {
      color: cerPalette["hcGreen"],
      zIndex: 9,
    },
    "KINDER MORGAN COCHIN ULC": { color: cerPalette["hcLightBlue"], zIndex: 8 },
    "TRANS MOUNTAIN PIPELINE ULC": { color: cerPalette["Ocean"], zIndex: 6 },
    "TRANS-NORTHERN PIPELINES INC": { color: cerPalette["Flame"], zIndex: 9 },
    "TRANSCANADA KEYSTONE PIPELINE GP LTD": {
      color: cerPalette["hcRed"],
      zIndex: 6,
    },
  };

  const gasFileNames = {
    "ALLIANCE PIPELINE LTD": { color: cerPalette["Flame"], zIndex: 9 },
    "EMERA BRUNSWICK PIPELINE COMPANY LTD": {
      color: cerPalette["hcAqua"],
      zIndex: 8,
    },
    "FOOTHILLS PIPE LINES LTD": { color: cerPalette["Sun"], zIndex: 7 },
    "MARITIMES & NORTHEAST PIPELINE MANAGEMENT LTD": {
      color: cerPalette["hcRed"],
      zIndex: 6,
    },
    "NOVA GAS TRANSMISSION LTD": { color: cerPalette["Night Sky"], zIndex: 1 },
    "TRANS QUÉBEC AND MARITIMES PIPELINE INC": {
      color: cerPalette["hcPurple"],
      zIndex: 5,
    },
    "TRANSCANADA PIPELINES LIMITED": { color: cerPalette["Forest"], zIndex: 4 },
    "VECTOR PIPELINE LIMITED PARTNERSHIP": {
      color: cerPalette["Aubergine"],
      zIndex: 3,
    },
    "WESTCOAST ENERGY INC, CARRYING ON BUSINESS AS SPECTRA ENERGY TRANSMISSION": {
      color: cerPalette["Ocean"],
      zIndex: 2,
    },
  };

  const importPipes = (fileNames, commodity) => {
    const shapes = [];

    for (const [key, value] of Object.entries(fileNames)) {
      shapes.push({
        name: key,
        // data: Highcharts.geojson(
        //   JSON.parse(
        //     getData(
        //       "/src/SystemMaps/pipeline_output/" +
        //         commodity +
        //         "/" +
        //         key +
        //         ".geojson"
        //     )
        //   )
        // ),
        color: value.color,
        type: "map",
        borderWidth: 0.2,
        borderColor: "black",
        zIndex: value.zIndex,
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            width: "80px", // force line-wrap
          },
        },
      });
    }

    const baseMap = {
      name: "Pipeline Map",
      data: Highcharts.geojson(
        JSON.parse(getData("/src/SystemMaps/map_output/statsCanFormat.json"))
      ),
      type: "map",
      color: "#F0F0F0",
      borderWidth: 0.5,
      borderColor: "black",
      zIndex: 0,
      showInLegend: false,
      enableMouseTracking: false,
    };
    shapes.push(baseMap);

    return shapes;
  };

  const oilShapes = importPipes(oilFileNames, "oil");
  const gasShapes = importPipes(gasFileNames, "gas");

  const mapTooltip = (e, container) => {
    var properties = {};
    var hasProperties = false;
    var propertiesList = [
      "Year",
      "Pipeline Name",
      "throughput",
      "availableCapacity",
      "Direction of Flow",
      "product",
      "tradeType",
      "Capacity Utilization",
      "Key Point",
    ];
    if (container == "container_map_oil") {
      var units = "1000 b/d";
    } else {
      var units = "1000 m3/d";
    }
    propertiesList.map((prop) => {
      if (e.point.properties.hasOwnProperty(prop)) {
        properties[prop] = e.point.properties[prop];
        hasProperties = e;
      } else {
        properties[prop] = "n/a";
      }
    });

    if (hasProperties) {
      var toolText = `<b> ${e.point.properties.OPERATOR} - ${properties["Pipeline Name"]} ( ${properties["Key Point"]} key point) <b><br>`;
      return toolText;
    } else {
      var toolText = `<b> ${e.point.properties.OPERATOR} <b><br>`;
      return toolText;
    }
  };

  const mapPopUp = (e, container) => {
    var properties = {};
    var hasProperties = false;
    var propertiesList = [
      "Year",
      "Pipeline Name",
      "throughput",
      "availableCapacity",
      "Direction of Flow",
      "product",
      "tradeType",
      "Capacity Utilization",
      "Key Point",
    ];
    if (container == "container_map_oil") {
      var units = "(1000 b/d)";
    } else {
      var units = "(1000 m3/d)";
    }
    propertiesList.map((prop) => {
      if (e.properties.hasOwnProperty(prop)) {
        properties[prop] = e.properties[prop];
        hasProperties = e;
      } else {
        properties[prop] = "n/a";
      }
    });

    if (hasProperties) {
      var toolText = `<span style="color:${e.color};font-size:14px;font-weight:bold">${properties["Pipeline Name"]}  (${properties["Key Point"]} key point) </span><br>`;
      toolText += `<b>Direction of Flow:</b> ${properties["Direction of Flow"]} <br>`;
      toolText += `<b>Products on Pipeline:</b> ${properties.product} <br>`;
      toolText += `<b>Pipeline Trade Type:</b> ${properties.tradeType} <br>`;
      toolText += `<b>${properties.Year} Average Throughput:</b> ${properties.throughput} ${units} <br>`;
      toolText += `<b>${properties.Year} Average Capacity:</b> ${properties.availableCapacity} ${units} <br>`;
      toolText += `<b>${properties.Year} Capacity Utilization:</b> ${
        properties["Capacity Utilization"] * 100
      } %`;
      return toolText;
    } else {
      var toolText = `<span style="color:${e.color};font-size:14px;font-weight:bold">${e.properties["OPERATOR"]}</span><br>`;
      toolText += `<b>CER Group:</b> ${e.properties["NEBGROUP"]}<br>`;
      toolText += `<b>Pipeline Type:</b> ${e.properties["TYPE"]}`;
      return toolText;
    }
  };

  const createPointMap = (shapes, container) => {
    return new Highcharts.mapChart(container, {
      chart: {
        borderColor: "black",
        borderWidth: 1,
        animation: true,
      },

      credits: {
        text: "Source: CER",
      },

      mapNavigation: {
        enabled: true,
      },

      title: {
        text: "",
      },

      legend: {
        title: { text: "Click on a legend item to add/remove from map" },
        //layout: "vertical",
        borderColor: cerPalette["Dim Grey"],
        borderWidth: 3,
        itemWidth: 400,
      },

      tooltip: {
        enabled: true,
        formatter: function () {
          return mapTooltip(this, container);
        },
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom",
        },
      },

      plotOptions: {
        series: {
          point: {
            events: {
              // click: function () {
              //   var text = mapPopUp(this, container);
              //   const chart = this.series.chart;
              //   if (!chart.clickLabel) {
              //     chart.clickLabel = chart.renderer
              //       .text(text, 725, 75, [, true])
              //       .css({
              //         width: "350px",
              //       })
              //       .add();
              //   } else {
              //     chart.clickLabel.attr({
              //       text: text,
              //     });
              //   }
              // },
              mouseOver: function () {
                var text = mapPopUp(this, container);
                const chart = this.series.chart;
                if (!chart.mouseOver) {
                  chart.mouseOver = chart.renderer
                    .text(text, 725, 75, [, true])
                    .css({
                      width: "350px",
                    })
                    .add();
                } else {
                  chart.mouseOver.attr({
                    text: text,
                  });
                }
              },
            },
          },
        },
      },

      series: shapes,
    });
  };
  const crudePipeMap = createPointMap(oilShapes, "container_map_oil");
  const gasPipeMap = createPointMap(gasShapes, "container_map_gas");
};
